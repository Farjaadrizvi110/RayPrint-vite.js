const dns = require("dns");
const mongoose = require("mongoose");
const logger = require("../utils/logger");

// Some ISP/router DNS servers block SRV record lookups (required by mongodb+srv://).
// Force Node.js to use Google public DNS so the Atlas SRV lookup always resolves.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri)
    throw new Error("MONGO_URI is not defined in environment variables.");

  mongoose.connection.on("connected", () =>
    logger.info("✅ MongoDB connected")
  );
  mongoose.connection.on("disconnected", () =>
    logger.warn("⚠️  MongoDB disconnected")
  );
  mongoose.connection.on("error", (err) =>
    logger.error("MongoDB error", { error: err.message })
  );

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 15_000,
    socketTimeoutMS: 45_000,
  });
};

module.exports = connectDB;
