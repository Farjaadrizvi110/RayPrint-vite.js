const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  line1: { type: String, required: true },
  line2: { type: String, default: "" },
  city: { type: String, required: true },
  county: { type: String, default: "" },
  postcode: { type: String, required: true },
  country: { type: String, default: "GB" },
  phone: { type: String, default: "" },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    googleId: { type: String, unique: true, sparse: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, select: false },
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsapp: { type: String, default: "" },
    profession: { type: String, default: "" },
    business: { type: String, default: "" },
    role: { type: String, enum: ["customer", "admin"], default: "customer" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    addresses: [addressSchema],
    stripeCustomerId: { type: String, default: "" },
    emailVerificationToken: { type: String, select: false },
    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

userSchema.set("toJSON", {
  virtuals: true,
  transform: (_, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
