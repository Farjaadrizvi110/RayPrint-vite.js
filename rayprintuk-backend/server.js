require("dotenv").config();
const app = require("./src/app");
const connectDB = require("./src/config/db");
const logger = require("./src/utils/logger");
const User = require("./src/models/User");
const Admin = require("./src/models/Admin");

const PORT = process.env.PORT || 5000;

// Ensure the admin User + Admin record both exist in MongoDB
async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || "admin@rayprintuk.com";
    const password = process.env.ADMIN_SECRET || "admin@bilal555";

    // ── 1. Upsert the User document ──────────────────────────────────────────
    let userDoc = await User.findOne({ email });
    if (userDoc) {
      userDoc.role = "admin";
      userDoc.isActive = true;
      userDoc.isVerified = true;
      userDoc.password = password; // pre-save hook re-hashes
      await userDoc.save();
      logger.info(`Admin user synced: ${email}`);
    } else {
      userDoc = await User.create({
        email,
        password,
        firstName: "Admin",
        lastName: "RayPrint",
        role: "admin",
        isVerified: true,
        isActive: true,
      });
      logger.info(`Admin user created: ${email}`);
    }

    // ── 2. Upsert the Admin document (required by isAdmin middleware) ─────────
    const adminRecord = await Admin.findOne({ user: userDoc._id });
    if (!adminRecord) {
      await Admin.create({
        user: userDoc._id,
        isSuperAdmin: true,
        permissions: {
          manageProducts: true,
          manageOrders: true,
          manageUsers: true,
          manageAdmins: true,
          viewAnalytics: true,
        },
      });
      logger.info("Admin record created (super-admin).");
    } else if (!adminRecord.isSuperAdmin) {
      adminRecord.isSuperAdmin = true;
      await adminRecord.save();
      logger.info("Admin record promoted to super-admin.");
    } else {
      logger.info("Admin record already exists.");
    }
  } catch (err) {
    logger.error("seedAdmin failed", { error: err.message });
  }
}

// Connect to MongoDB then start server
connectDB()
  .then(async () => {
    await seedAdmin();

    const server = app.listen(PORT, () => {
      logger.info(
        `🚀 RayPrint UK API running on port ${PORT} [${
          process.env.NODE_ENV || "development"
        }]`
      );
    });

    // Graceful shutdown
    const shutdown = (signal) => {
      logger.info(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        logger.info("HTTP server closed.");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB", { error: err.message });
    process.exit(1);
  });
