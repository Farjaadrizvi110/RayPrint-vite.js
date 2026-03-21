const jwt = require("jsonwebtoken");
const crypto = require("crypto");

/**
 * Generate a signed JWT for a user document.
 * @param {object} user - Mongoose User document
 * @returns {string} JWT token
 */
const generateJWT = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar || "",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    issuer: "rayprintuk-api",
    audience: "rayprintuk-client",
  });
};

/**
 * Generate a cryptographically secure random token (for email verification / password reset).
 * @param {number} bytes - Number of random bytes (default 32)
 * @returns {string} hex token
 */
const generateSecureToken = (bytes = 32) =>
  crypto.randomBytes(bytes).toString("hex");

/**
 * Hash a token for secure storage.
 * @param {string} token
 * @returns {string} SHA-256 hex hash
 */
const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

module.exports = { generateJWT, generateSecureToken, hashToken };
