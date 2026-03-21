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
    body("phone").optional().trim(),
    body("whatsapp").optional().trim(),
    body("profession").optional().trim(),
    body("business").optional().trim(),
  ],
  ctrl.updateMe
);

router.patch("/change-password", protect, ctrl.changePassword);

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

// ─── Google OAuth (session-free — works on Vercel serverless) ────────────────
// Passport is NOT used for Google OAuth to avoid session state issues.
// The controller handles the full OAuth code-exchange flow directly.
router.get("/google", ctrl.googleInit);
router.get("/google/callback", ctrl.googleCallback);

module.exports = router;
