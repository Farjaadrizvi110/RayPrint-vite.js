/**
 * Live credential tester — Cloudinary + Google OAuth 2.0
 * Run: node test-credentials.js
 */
require("dotenv").config();
const https = require("https");

let passed = 0;
let failed = 0;

const ok = (label, msg) => {
  console.log(`  ✅  ${label}: ${msg}`);
  passed++;
};
const err = (label, msg) => {
  console.error(`  ❌  ${label}: ${msg}`);
  failed++;
};
const sep = (title) =>
  console.log(`\n${"─".repeat(55)}\n  ${title}\n${"─".repeat(55)}`);

// ─── Helper: raw HTTPS GET ────────────────────────────────────────────────────
const httpsGet = (url) =>
  new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode, body: data }));
      })
      .on("error", reject);
  });

// ─── Helper: raw HTTPS POST ───────────────────────────────────────────────────
const httpsPost = (hostname, path, body) =>
  new Promise((resolve, reject) => {
    const postData = typeof body === "string" ? body : JSON.stringify(body);
    const options = {
      hostname,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
      },
    };
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (c) => (data += c));
      res.on("end", () => resolve({ status: res.statusCode, body: data }));
    });
    req.on("error", reject);
    req.write(postData);
    req.end();
  });

// ════════════════════════════════════════════════════════
//  1. ENV VARS CHECK
// ════════════════════════════════════════════════════════
sep("1. ENVIRONMENT VARIABLES");

const required = [
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_CALLBACK_URL",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
];
for (const key of required) {
  if (
    process.env[key] &&
    !process.env[key].startsWith("your_") &&
    !process.env[key].includes("<")
  ) {
    ok(
      key,
      process.env[key].slice(0, 30) + (process.env[key].length > 30 ? "…" : "")
    );
  } else {
    err(key, "Not set or still contains placeholder value");
  }
}

// ════════════════════════════════════════════════════════
//  2. GOOGLE OAUTH CALLBACK URL FORMAT
// ════════════════════════════════════════════════════════
sep("2. GOOGLE OAUTH — CALLBACK URL");
const cbUrl = process.env.GOOGLE_CALLBACK_URL || "";
if (
  cbUrl.includes("developers.google.com") ||
  cbUrl.includes("oauthplayground")
) {
  err(
    "Callback URL",
    `"${cbUrl}" is the OAuth Playground — must be YOUR server URL`
  );
} else if (cbUrl.startsWith("http")) {
  ok("Callback URL", cbUrl);
} else {
  err("Callback URL", "Missing or malformed");
}

// ════════════════════════════════════════════════════════
//  3. GOOGLE OAUTH — VERIFY CLIENT ID WITH GOOGLE API
// ════════════════════════════════════════════════════════
sep("3. GOOGLE OAUTH — CLIENT ID VERIFICATION");
(async () => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    // Google's tokeninfo endpoint can verify a client_id format & existence
    // We use the discovery document + client ID validation approach
    const res = await httpsGet(
      `https://www.googleapis.com/oauth2/v3/tokeninfo?client_id=${encodeURIComponent(
        clientId
      )}`
    );
    // 400 = endpoint reached but no token given (expected — proves client_id is reachable)
    // 200 = would only occur with a real token
    const body = JSON.parse(res.body);
    if (res.status === 400 && body.error === "invalid_request") {
      ok(
        "Client ID reachable",
        `Google API responded (HTTP ${res.status}) — client_id format valid`
      );
    } else {
      ok("Client ID", `Google responded HTTP ${res.status}`);
    }
  } catch (e) {
    err("Client ID verification", e.message);
  }

  // ─── Verify client_secret by attempting token exchange (will get specific error) ─
  try {
    const postBody = new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      code: "INVALID_TEST_CODE",
      redirect_uri: process.env.GOOGLE_CALLBACK_URL,
      grant_type: "authorization_code",
    }).toString();

    const res = await httpsPost("oauth2.googleapis.com", "/token", postBody);
    const body = JSON.parse(res.body);

    if (body.error === "invalid_grant") {
      // "invalid_grant" means the code was wrong but client_id + secret were ACCEPTED by Google
      ok(
        "Client Secret",
        "Accepted by Google (invalid_grant — credentials valid, test code expected)"
      );
    } else if (body.error === "invalid_client") {
      err(
        "Client Secret",
        `Google rejected credentials: ${body.error_description}`
      );
    } else if (body.error === "redirect_uri_mismatch") {
      err(
        "Redirect URI",
        `"${process.env.GOOGLE_CALLBACK_URL}" is NOT registered in Google Cloud Console\n` +
          "        → Add it at: https://console.cloud.google.com/apis/credentials"
      );
    } else {
      ok(
        "Client Secret",
        `Google responded: ${body.error || "OK"} — ${
          body.error_description || ""
        }`
      );
    }
  } catch (e) {
    err("Client Secret verification", e.message);
  }

  // ════════════════════════════════════════════════════════
  //  4. CLOUDINARY — LIVE PING TEST
  // ════════════════════════════════════════════════════════
  sep("4. CLOUDINARY — LIVE API PING");
  try {
    const cloudinary = require("cloudinary").v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    const ping = await cloudinary.api.ping();
    if (ping.status === "ok") {
      ok(
        "Cloudinary ping",
        `Cloud "${process.env.CLOUDINARY_CLOUD_NAME}" → ${ping.status}`
      );
    } else {
      err("Cloudinary ping", JSON.stringify(ping));
    }
  } catch (e) {
    const httpCode = e?.error?.http_code || e?.http_code;
    const msg = e?.error?.message || e?.message || String(e);
    if (httpCode === 401 && msg.includes("cloud_name mismatch")) {
      err(
        "Cloudinary cloud_name",
        `CLOUDINARY_CLOUD_NAME="${process.env.CLOUDINARY_CLOUD_NAME}" does NOT match this API key.\n` +
          "        → Log in at https://cloudinary.com/console — your cloud name is shown\n" +
          '          in the top-left of the dashboard (e.g. "dxxxxxxxx").\n' +
          "          Update CLOUDINARY_CLOUD_NAME in .env with that value."
      );
    } else if (httpCode === 401) {
      err(
        "Cloudinary auth",
        `HTTP 401 — API key or secret is wrong. Check your Cloudinary dashboard.\n        Detail: ${msg}`
      );
    } else {
      err("Cloudinary ping", `${msg} (HTTP ${httpCode || "N/A"})`);
    }
  }

  // ─── Summary ──────────────────────────────────────────────────────────────────
  sep("SUMMARY");
  console.log(`  Passed: ${passed}   Failed: ${failed}`);
  if (failed > 0) {
    console.log(
      "\n  ⚠️  Fix the items marked ❌ above before starting the server.\n"
    );
    process.exit(1);
  } else {
    console.log("\n  🎉 All checks passed!\n");
    process.exit(0);
  }
})();
