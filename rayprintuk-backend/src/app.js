const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const artworkRoutes = require("./routes/artwork.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// ─── CORS — MUST be the very first middleware, before helmet ─────────────────
// Handles both preflight (OPTIONS) and actual requests.
// "Failed to fetch" errors in the browser are caused by missing CORS headers.
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173"
)
  .split(",")
  .map((o) => o.trim());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,X-Requested-With",
    );
    res.setHeader("Vary", "Origin");
  }
  // Respond to preflight immediately — no further processing needed
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  next();
});

// ─── Security middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  }),
);
app.use(hpp());

// ─── Global rate limiter ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", globalLimiter);

// ─── Stripe webhook MUST use raw body ──────────────────────────────────────
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── HTTP request logging ───────────────────────────────────────────────────
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  }),
);

// ─── Session (required for OAuth state verification) ────────────────────────
// Only used during the Google OAuth redirect dance — JWT is used for everything else.
const isProd = process.env.NODE_ENV === "production";
if (isProd) app.set("trust proxy", 1); // Required behind Vercel's reverse proxy
app.use(
  session({
    secret: process.env.JWT_SECRET || "rayprintuk-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: isProd, // HTTPS-only in production
      sameSite: isProd ? "none" : "lax",
      maxAge: 5 * 60 * 1000, // 5 min — just for OAuth flow
    },
  }),
);

// ─── Passport ───────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date().toISOString() }),
);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
