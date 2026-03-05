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

    const allowed = ["firstName", "lastName", "phone", "avatar"];
    const updates = {};
    allowed.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });
    return sendSuccess(res, 200, "Profile updated.", user);
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

// GET /api/auth/google/callback  — handled by passport, then this finalises
exports.googleCallback = (req, res) => {
  try {
    logger.info("Google OAuth callback fired", {
      user: req.user?._id,
      email: req.user?.email,
    });
    if (!req.user) {
      logger.error("Google OAuth: req.user is undefined after Passport");
      return res.redirect(
        `${process.env.CLIENT_URL}/#/login?error=google_failed`
      );
    }
    const token = generateJWT(req.user);
    logger.info("Google OAuth: JWT generated, redirecting to client");
    // Use /#/ prefix so HashRouter in the React app routes correctly
    res.redirect(`${process.env.CLIENT_URL}/#/auth/callback?token=${token}`);
  } catch (err) {
    logger.error("Google OAuth callback error", { error: err.message });
    res.redirect(`${process.env.CLIENT_URL}/#/login?error=google_failed`);
  }
};
