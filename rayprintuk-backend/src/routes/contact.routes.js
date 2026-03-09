const express = require("express");
const rateLimit = require("express-rate-limit");
const ctrl = require("../controllers/contact.controller");

const router = express.Router();

// Strict rate limit — max 5 design requests per IP per 15 min (prevents spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

router.post("/design-request", contactLimiter, ctrl.submitDesignRequest);
router.post("/support", contactLimiter, ctrl.submitSupportMessage);

module.exports = router;
