const nodemailer = require('nodemailer');
const logger = require('./logger');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const FROM = `"RayPrint UK" <${process.env.EMAIL_FROM || process.env.GMAIL_USER}>`;

// ─── Send raw email ───────────────────────────────────────────────────────────
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const info = await transporter.sendMail({ from: FROM, to, subject, html, text });
    logger.info(`Email sent to ${to}`, { messageId: info.messageId });
    return info;
  } catch (err) {
    logger.error('Email send failed', { to, error: err.message });
    throw err;
  }
};

// ─── Email templates ──────────────────────────────────────────────────────────
const sendWelcomeEmail = (user) => sendEmail({
  to: user.email,
  subject: 'Welcome to RayPrint UK 🎉',
  html: `<h1>Hi ${user.firstName},</h1>
         <p>Thanks for joining RayPrint UK — your go-to online print partner.</p>
         <p>Explore our products at <a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>`,
});

const sendOrderConfirmation = (user, order) => sendEmail({
  to: user.email,
  subject: `Order Confirmed — ${order.orderNumber}`,
  html: `<h2>Order Confirmed ✅</h2>
         <p>Hi ${user.firstName}, your order <strong>${order.orderNumber}</strong> has been received.</p>
         <p>Total: <strong>£${(order.totalAmount / 100).toFixed(2)}</strong></p>
         <p>We'll email you when your order ships.</p>`,
});

const sendPasswordReset = (user, resetUrl) => sendEmail({
  to: user.email,
  subject: 'RayPrint UK — Password Reset',
  html: `<p>Hi ${user.firstName},</p>
         <p>Click below to reset your password (valid for 10 minutes):</p>
         <a href="${resetUrl}" style="padding:10px 20px;background:#3B6CFF;color:#fff;border-radius:6px;text-decoration:none;">Reset Password</a>
         <p>If you didn't request this, ignore this email.</p>`,
});

const sendArtworkStatusEmail = (user, artwork) => sendEmail({
  to: user.email,
  subject: `Artwork Update — ${artwork.status.replace('_', ' ')}`,
  html: `<p>Hi ${user.firstName}, your artwork <strong>${artwork.fileName}</strong> status has been updated to: <strong>${artwork.status}</strong>.</p>
         ${artwork.reviewNotes ? `<p>Notes: ${artwork.reviewNotes}</p>` : ''}`,
});

const sendOrderDispatchedEmail = (user, order) => sendEmail({
  to: user.email,
  subject: `Your order ${order.orderNumber} has been dispatched! 📦`,
  html: `<p>Hi ${user.firstName}, your order <strong>${order.orderNumber}</strong> is on its way.</p>
         ${order.trackingNumber ? `<p>Tracking: <strong>${order.trackingNumber}</strong></p>` : ''}`,
});

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendPasswordReset,
  sendArtworkStatusEmail,
  sendOrderDispatchedEmail,
};

