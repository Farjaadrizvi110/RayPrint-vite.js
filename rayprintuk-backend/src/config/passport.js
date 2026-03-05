const passport = require("passport");
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const User = require("../models/User");
const logger = require("../utils/logger");

// ─── JWT Strategy ─────────────────────────────────────────────────────────────
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.id).select("-password");
        if (!user) return done(null, false);
        return done(null, user);
      } catch (err) {
        logger.error("JWT strategy error", { error: err.message });
        return done(err, false);
      }
    }
  )
);

// ─── Google OAuth 2.0 Strategy ───────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      // Disable state/CSRF verification — we use JWT for real auth security.
      // This eliminates the session dependency during the OAuth dance.
      state: false,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email)
          return done(new Error("No email returned from Google"), false);

        let user = await User.findOne({
          $or: [{ googleId: profile.id }, { email }],
        });

        if (user) {
          // Link Google ID if signing in via Google for the first time
          if (!user.googleId) {
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        }

        // Create new user from Google profile
        user = await User.create({
          googleId: profile.id,
          email,
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          avatar: profile.photos?.[0]?.value || "",
          isVerified: true,
        });

        return done(null, user);
      } catch (err) {
        logger.error("Google OAuth strategy error", { error: err.message });
        return done(err, false);
      }
    }
  )
);

// ─── Session serialization (minimal — only used during OAuth state dance) ─────
// After the Google callback we issue a JWT, so we never actually store users in session.
passport.serializeUser((user, done) =>
  done(null, user._id?.toString() ?? user.id)
);
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
