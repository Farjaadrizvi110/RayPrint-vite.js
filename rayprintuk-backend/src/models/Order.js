const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true }, // pence
    options: { type: Map, of: String, default: {} }, // { size: 'A4', finish: 'Gloss' }
    artwork: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork" },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    line1: { type: String, required: true },
    line2: { type: String, default: "" },
    city: { type: String, required: true },
    county: { type: String, default: "" },
    postcode: { type: String, required: true },
    country: { type: String, default: "GB" },
    phone: { type: String, default: "" },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    shippingAddress: { type: shippingAddressSchema, required: true },
    subtotal: { type: Number, required: true }, // pence
    shippingCost: { type: Number, default: 0 }, // pence
    tax: { type: Number, default: 0 }, // pence
    totalAmount: { type: Number, required: true }, // pence
    currency: { type: String, default: "gbp" },
    status: {
      type: String,
      enum: [
        "pending",
        "payment_received",
        "artwork_review",
        "in_production",
        "dispatched",
        "delivered",
        "cancelled",
        "refunded",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded", "failed"],
      default: "unpaid",
    },
    stripePaymentIntentId: { type: String, default: "" },
    stripeChargeId: { type: String, default: "" },
    trackingNumber: { type: String, default: "" },
    notes: { type: String, default: "" },
    adminNotes: { type: String, default: "" },
    estimatedDelivery: { type: Date },
  },
  { timestamps: true }
);

// Auto-generate order number before first save
orderSchema.pre("save", async function (next) {
  if (this.isNew) {
    const count = await mongoose.model("Order").countDocuments();
    this.orderNumber = `RP-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

orderSchema.index({ user: 1, createdAt: -1 });
// orderNumber index is already created by unique:true in schema definition
orderSchema.index({ status: 1 });

module.exports = mongoose.model("Order", orderSchema);
