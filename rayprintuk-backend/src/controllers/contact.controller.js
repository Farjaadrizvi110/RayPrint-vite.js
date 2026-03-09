const { sendSuccess, sendError } = require("../utils/apiResponse");
const {
  sendDesignRequestToStudio,
  sendDesignRequestConfirmation,
  sendSupportMessageToStudio,
} = require("../utils/emailService");
const logger = require("../utils/logger");

// POST /api/contact/design-request  (public — no auth required)
exports.submitDesignRequest = async (req, res, next) => {
  try {
    const {
      name,
      email,
      projectType,
      description,
      colorPreferences,
      budget,
      deadline,
      phone,
      addressLine1,
      addressLine2,
      city,
      postcode,
    } = req.body;

    // Basic validation
    if (!name || !email || !description) {
      return sendError(
        res,
        400,
        "Name, email and project description are required."
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please provide a valid email address.");
    }

    const payload = {
      name,
      email,
      projectType,
      description,
      colorPreferences,
      budget,
      deadline,
      phone,
      addressLine1,
      addressLine2,
      city,
      postcode,
    };

    // Send to studio — non-blocking on the customer response
    await sendDesignRequestToStudio(payload);

    // Send confirmation to customer (fire-and-forget — don't fail the request if this fails)
    sendDesignRequestConfirmation(payload).catch((e) =>
      logger.warn("Design request confirmation email failed", {
        error: e.message,
      })
    );

    logger.info("Design request received", { name, email, projectType });

    return sendSuccess(
      res,
      200,
      "Design request received! We'll be in touch within 24 hours."
    );
  } catch (err) {
    next(err);
  }
};

// POST /api/contact/support  (public — no auth required)
exports.submitSupportMessage = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return sendError(
        res,
        400,
        "Name, email, subject and message are required."
      );
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return sendError(res, 400, "Please provide a valid email address.");
    }

    await sendSupportMessageToStudio({ name, email, subject, message });

    logger.info("Support message received", { name, email, subject });

    return sendSuccess(res, 200, "Message sent! We'll get back to you soon.");
  } catch (err) {
    next(err);
  }
};
