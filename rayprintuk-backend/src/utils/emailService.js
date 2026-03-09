const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = `"RayPrint UK" <${
  process.env.EMAIL_FROM || process.env.GMAIL_USER
}>`;

// ─── Send raw email ───────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({
      from: FROM,
      to,
      subject,
      html,
      text,
    });
    logger.info(`Email sent to ${to}`, { messageId: info.messageId });
    return info;
  } catch (err) {
    logger.error("Email send failed", { to, error: err.message });
    throw err;
  }
};

// ─── Email templates ──────────────────────────────────────────────────────────
const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: "Welcome to RayPrint UK 🎉",
    html: `<h1>Hi ${user.firstName},</h1>
         <p>Thanks for joining RayPrint UK — your go-to online print partner.</p>
         <p>Explore our products at <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>`,
  });

const sendOrderConfirmation = (user, order) =>
  sendEmail({
    to: user.email,
    subject: `Order Confirmed — ${order.orderNumber}`,
    html: `<h2>Order Confirmed ✅</h2>
         <p>Hi ${user.firstName}, your order <strong>${
      order.orderNumber
    }</strong> has been received.</p>
         <p>Total: <strong>£${(order.totalAmount / 100).toFixed(2)}</strong></p>
         <p>We'll email you when your order ships.</p>`,
  });

const sendPasswordReset = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: "RayPrint UK — Password Reset",
    html: `<p>Hi ${user.firstName},</p>
         <p>Click below to reset your password (valid for 10 minutes):</p>
         <a href="${resetUrl}" style="padding:10px 20px;background:#3B6CFF;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
         <p>If you didn't request this, ignore this email.</p>`,
  });

const sendArtworkStatusEmail = (user, artwork) =>
  sendEmail({
    to: user.email,
    subject: `Artwork Update — ${artwork.status.replace("_", " ")}`,
    html: `<p>Hi ${user.firstName}, your artwork <strong>${
      artwork.fileName
    }</strong> status has been updated to: <strong>${
      artwork.status
    }</strong>.</p>
         ${artwork.reviewNotes ? `<p>Notes: ${artwork.reviewNotes}</p>` : ""}`,
  });

const sendOrderDispatchedEmail = (user, order) =>
  sendEmail({
    to: user.email,
    subject: `Your order ${order.orderNumber} has been dispatched! 📦`,
    html: `<p>Hi ${user.firstName}, your order <strong>${
      order.orderNumber
    }</strong> is on its way.</p>
         ${
           order.trackingNumber
             ? `<p>Tracking: <strong>${order.trackingNumber}</strong></p>`
             : ""
         }`,
  });

// ─── Design Request — notify studio + confirm to customer ────────────────────
const sendDesignRequestToStudio = ({
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
}) => {
  const addressParts = [addressLine1, addressLine2, city, postcode].filter(
    Boolean
  );
  const fullAddress = addressParts.length ? addressParts.join(", ") : "—";
  const projectLabels = {
    logo: "Logo Design",
    layout: "Layout Help",
    brand: "Brand System",
    other: "Other",
  };
  const budgetLabels = {
    "under-500": "Under £500",
    "500-1000": "£500 – £1,000",
    "1000-2500": "£1,000 – £2,500",
    "2500+": "£2,500+",
  };

  return sendEmail({
    to: "info@raydesign.uk",
    subject: `🎨 New Design Request from ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0B0F17;color:#F6F8FF;border-radius:12px;overflow:hidden;">
        <div style="background:#3B6CFF;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;color:#fff;">New Design Request</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Submitted via RayPrint UK website</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;width:160px;font-size:13px;">Client Name</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:600;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Reply-To Email</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><a href="mailto:${email}" style="color:#3B6CFF;">${email}</a></td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Project Type</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${
                  projectLabels[projectType] || projectType || "—"
                }</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Budget Range</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${
                  budgetLabels[budget] || budget || "—"
                }</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Deadline</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${
                  deadline || "—"
                }</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Colour Prefs</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${
                  colorPreferences || "—"
                }</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Phone</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${
                  phone || "—"
                }</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Address</td>
                <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${fullAddress}</td></tr>
          </table>
          <div style="margin-top:24px;">
            <p style="color:#A6B0C5;font-size:13px;margin-bottom:8px;">Project Description</p>
            <div style="background:rgba(255,255,255,0.05);border-left:3px solid #3B6CFF;padding:16px;border-radius:4px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${description}</div>
          </div>
          <div style="margin-top:28px;">
            <a href="mailto:${email}" style="display:inline-block;background:#3B6CFF;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${name}</a>
          </div>
        </div>
      </div>`,
  });
};

const sendDesignRequestConfirmation = ({ name, email, projectType }) => {
  const projectLabels = {
    logo: "Logo Design",
    layout: "Layout Help",
    brand: "Brand System",
    other: "Other",
  };
  return sendEmail({
    to: email,
    subject: "We received your design request ✅",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#3B6CFF;padding:24px 32px;border-radius:12px 12px 0 0;">
          <h1 style="margin:0;font-size:22px;color:#fff;">Thanks, ${name}!</h1>
        </div>
        <div style="padding:32px;background:#f9fafb;border-radius:0 0 12px 12px;">
          <p style="font-size:15px;color:#374151;">We've received your <strong>${
            projectLabels[projectType] || "design"
          }</strong> request and our team will review it shortly.</p>
          <p style="font-size:15px;color:#374151;">We aim to reply within <strong>24 hours</strong>. Keep an eye on your inbox!</p>
          <p style="margin-top:24px;font-size:14px;color:#6B7280;">Questions? Reply to this email or reach us at <a href="mailto:info@raydesign.uk" style="color:#3B6CFF;">info@raydesign.uk</a></p>
          <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb;" />
          <p style="font-size:12px;color:#9CA3AF;margin:0;">RayPrint UK · Professional Print &amp; Design Services</p>
        </div>
      </div>`,
  });
};

// ─── Support / Contact message — notify studio ────────────────────────────────
const sendSupportMessageToStudio = ({ name, email, subject, message }) =>
  sendEmail({
    to: "info@raydesign.uk",
    subject: `📩 New Support Message: ${subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#0B0F17;color:#F6F8FF;border-radius:12px;overflow:hidden;">
        <div style="background:#3B6CFF;padding:24px 32px;">
          <h1 style="margin:0;font-size:22px;color:#fff;">New Support Message</h1>
          <p style="margin:4px 0 0;color:rgba(255,255,255,0.75);font-size:14px;">Submitted via RayPrint UK — Support page</p>
        </div>
        <div style="padding:32px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;width:140px;font-size:13px;">From</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Email</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);"><a href="mailto:${email}" style="color:#3B6CFF;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#A6B0C5;font-size:13px;">Subject</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);">${subject}</td>
            </tr>
          </table>
          <div style="margin-top:24px;">
            <p style="color:#A6B0C5;font-size:13px;margin-bottom:8px;">Message</p>
            <div style="background:rgba(246,248,255,0.05);border:1px solid rgba(246,248,255,0.10);border-radius:8px;padding:16px;white-space:pre-wrap;font-size:14px;line-height:1.6;">${message}</div>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#A6B0C5;">Reply directly to <a href="mailto:${email}" style="color:#3B6CFF;">${email}</a></p>
        </div>
      </div>`,
    text: `New Support Message\n\nFrom: ${name} <${email}>\nSubject: ${subject}\n\n${message}`,
  });

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordReset,
  sendArtworkStatusEmail,
  sendOrderDispatchedEmail,
  sendDesignRequestToStudio,
  sendDesignRequestConfirmation,
  sendSupportMessageToStudio,
};
