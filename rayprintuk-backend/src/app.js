const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const artworkRoutes = require("./routes/artwork.routes");
const adminRoutes = require("./routes/admin.routes");
const contactRoutes = require("./routes/contact.routes");
const errorHandler = require("./middleware/errorHandler");
const logger = require("./utils/logger");

const app = express();

// ─── Security middleware ────────────────────────────────────────────────────
app.use(helmet());
app.use(hpp());

const allowedOrigins = (
  process.env.CLIENT_URL || "http://localhost:5173"
).split(",");
app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// ─── Global rate limiter ────────────────────────────────────────────────────
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", globalLimiter);

// ─── Stripe webhook MUST use raw body ──────────────────────────────────────
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// ─── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── HTTP request logging ───────────────────────────────────────────────────
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
  })
);

// ─── Session (required for OAuth state verification) ────────────────────────
// Only used during the Google OAuth redirect dance — JWT is used for everything else.
app.use(
  session({
    secret: process.env.JWT_SECRET || "rayprintuk-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 5 * 60 * 1000 }, // 5 min — just for OAuth flow
  })
);

// ─── Passport ───────────────────────────────────────────────────────────────
app.use(passport.initialize());
app.use(passport.session());

// ─── Health check ───────────────────────────────────────────────────────────
app.get("/health", (req, res) =>
  res.json({ status: "OK", timestamp: new Date().toISOString() })
);

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/artwork", artworkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);

// ─── 404 handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ─── Global error handler ────────────────────────────────────────────────────
app.use(errorHandler);

module.exports = app;
