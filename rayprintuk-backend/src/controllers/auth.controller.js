const { validationResult } = require("express-validator");
const User = require("../models/User");
const {
  generateJWT,
  generateSecureToken,
  hashToken,
} = require("../utils/generateToken");
const { sendSuccess, sendError } = require("../utils/apiResponse");
const {
  sendWelcomeEmail,
  sendPasswordReset,
} = require("../utils/emailService");
const logger = require("../utils/logger");

// POST /api/auth/register
exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return sendError(res, 422, "Validation failed", errors.array());

    const { email, password, firstName, lastName } = req.body;

    const existing = await User.findOne({ email });
    if (existing)
      return sendError(res, 409, "An account with this email already exists.");

    const user = await User.create({ email, password, firstName, lastName });
    const token = generateJWT(user);

    sendWelcomeEmail(user).catch((e) =>
      logger.warn("Welcome email failed", { error: e.message })
    );

    return sendSuccess(res, 201, "Account created successfully.", {
      token,
      user,
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return sendError(res, 422, "Validation failed", errors.array());

    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user || !user.password)
      return sendError(res, 401, "Invalid email or password.");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return sendError(res, 401, "Invalid email or password.");

    if (!user.isActive)
      return sendError(res, 403, "Account has been deactivated.");

    const token = generateJWT(user);
    user.password = undefined;
    return sendSuccess(res, 200, "Login successful.", { token, user });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    return sendSuccess(res, 200, "Profile retrieved.", user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/me
exports.updateMe = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return sendError(res, 422, "Validation failed", errors.array());

    const allowed = [
      "firstName",
      "lastName",
      "phone",
      "avatar",
      "whatsapp",
      "profession",
      "business",
    ];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    // Handle saved address upsert
    if (req.body.address) {
      const addr = req.body.address;
      const user = await User.findById(req.user._id);
      const defIdx = user.addresses.findIndex((a) => a.isDefault);
      if (defIdx >= 0) {
        Object.assign(user.addresses[defIdx], addr, { isDefault: true });
      } else {
        user.addresses.push({ ...addr, isDefault: true });
      }
      Object.assign(user, updates);
      await user.save({ validateBeforeSave: false });
      return sendSuccess(res, 200, "Profile updated.", user);
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    return sendSuccess(res, 200, "Profile updated.", user);
  } catch (err) {
    next(err);
  }
};

// PATCH /api/auth/change-password
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return sendError(
        res,
        400,
        "currentPassword and newPassword are required."
      );
    if (newPassword.length < 8)
      return sendError(res, 400, "New password must be at least 8 characters.");

    const user = await User.findById(req.user._id).select("+password");
    if (!user.password)
      return sendError(
        res,
        400,
        "This account uses Google login — no password to change."
      );

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return sendError(res, 401, "Current password is incorrect.");

    user.password = newPassword;
    await user.save();
    return sendSuccess(res, 200, "Password changed successfully.");
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return sendSuccess(
        res,
        200,
        "If that email exists, a reset link has been sent."
      );

    const rawToken = generateSecureToken();
    user.passwordResetToken = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    await sendPasswordReset(user, resetUrl);

    return sendSuccess(res, 200, "Password reset email sent.");
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashed = hashToken(token);

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+password");

    if (!user) return sendError(res, 400, "Invalid or expired reset token.");

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    const jwt = generateJWT(user);
    return sendSuccess(res, 200, "Password reset successfully.", {
      token: jwt,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/google — initiate Google OAuth (session-free, works on Vercel serverless)
exports.googleInit = (req, res) => {
  const params = new URLSearchParams({
    response_type: "code",
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
    scope: "openid profile email",
    access_type: "offline",
  });
  res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
};

// GET /api/auth/google/callback — exchange code directly (no session/passport state needed)
exports.googleCallback = async (req, res) => {
  try {
    const { code, error } = req.query;

    if (error) {
      logger.error("Google returned error in callback", { error });
      return res.redirect(
        `${process.env.CLIENT_URL}/#/login?error=google_failed`
      );
    }
    if (!code) {
      logger.error("Google callback: no code in query");
      return res.redirect(
        `${process.env.CLIENT_URL}/#/login?error=google_failed`
      );
    }

    // 1. Exchange authorisation code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_CALLBACK_URL,
        grant_type: "authorization_code",
      }),
    });
    const tokens = await tokenRes.json();

    if (!tokenRes.ok || !tokens.access_token) {
      logger.error("Google token exchange failed", { tokens });
      return res.redirect(
        `${process.env.CLIENT_URL}/#/login?error=google_failed`
      );
    }

    // 2. Fetch Google profile
    const profileRes = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${tokens.access_token}` } }
    );
    const profile = await profileRes.json();

    if (!profileRes.ok || !profile.email) {
      logger.error("Google userinfo fetch failed", { profile });
      return res.redirect(
        `${process.env.CLIENT_URL}/#/login?error=google_failed`
      );
    }

    // 3. Find or create user
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.email }],
    });

    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    } else {
      // Google may not always return given_name/family_name — use safe fallbacks
      // (Mongoose rejects empty strings for required string fields)
      const nameParts = (profile.name || "Google User").split(" ");
      const firstName = profile.given_name || nameParts[0] || "Google";
      const lastName =
        profile.family_name || nameParts.slice(1).join(" ") || "User";
      user = await User.create({
        googleId: profile.id,
        email: profile.email,
        firstName,
        lastName,
        avatar: profile.picture || "",
        isVerified: true,
      });
    }

    // 4. Issue JWT and redirect to frontend
    const token = generateJWT(user);
    logger.info("Google OAuth: JWT issued, redirecting to client", {
      userId: user._id,
    });
    res.redirect(`${process.env.CLIENT_URL}/#/auth/callback?token=${token}`);
  } catch (err) {
    logger.error("Google OAuth callback error", { error: err.message });
    res.redirect(`${process.env.CLIENT_URL}/#/login?error=google_failed`);
  }
};
