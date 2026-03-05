const express = require("express");
const passport = require("passport");
const rateLimit = require("express-rate-limit");
const { body } = require("express-validator");
const ctrl = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

// Stricter rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many auth attempts, please try again later.",
  },
});

// ─── Validation rules ─────────────────────────────────────────────────────────
const registerRules = [
  body("firstName").trim().notEmpty().withMessage("First name is required."),
  body("lastName").trim().notEmpty().withMessage("Last name is required."),
  body("email").isEmail().normalizeEmail().withMessage("Valid email required."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

const loginRules = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

// ─── Routes ───────────────────────────────────────────────────────────────────
router.post("/register", authLimiter, registerRules, ctrl.register);
router.post("/login", authLimiter, loginRules, ctrl.login);

router.get("/me", protect, ctrl.getMe);
router.patch(
  "/me",
  protect,
  [
    body("firstName").optional().trim().notEmpty(),
    body("lastName").optional().trim().notEmpty(),
    body("phone").optional().isMobilePhone(),
  ],
  ctrl.updateMe
);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().normalizeEmail()],
  ctrl.forgotPassword
);
router.post(
  "/reset-password",
  authLimiter,
  [body("token").notEmpty(), body("password").isLength({ min: 8 })],
  ctrl.resetPassword
);

// ─── Google OAuth ─────────────────────────────────────────────────────────────
// NOTE: session:true here so Passport can store the OAuth state for CSRF verification.
// After verification we issue a JWT and never use the session again.
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], state: false })
);

router.get(
  "/google/callback",
  (req, res, next) => {
    const logger = require("../utils/logger");
    logger.info("Google callback query params:", { query: req.query });
    if (req.query.error) {
      logger.error("Google returned an error:", {
        error: req.query.error,
        hint: req.query.error_description,
      });
    }
    next();
  },
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/#/login?error=google_failed`,
    session: false,
    state: false,
  }),
  ctrl.googleCallback
);

module.exports = router;
