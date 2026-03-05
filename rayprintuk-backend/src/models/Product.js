const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Size"
    values: [{ type: String }], // e.g. ["A4","A5","A6"]
  },
  { _id: false }
);

const pricingTierSchema = new mongoose.Schema(
  {
    quantity: { type: Number, required: true },
    pricePerUnit: { type: Number, required: true }, // in pence (GBP)
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      required: true,
      enum: [
        "business-cards",
        "flyers",
        "posters",
        "banners",
        "packaging",
        "stickers",
        "leaflets",
        "booklets",
        "signage",
        "other",
      ],
    },
    images: [{ type: String }],
    basePrice: { type: Number, required: true }, // in pence
    pricingTiers: [pricingTierSchema],
    options: [optionSchema],
    turnaround: {
      type: [String],
      default: ["Standard (3-5 days)", "Express (1-2 days)"],
    },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    stock: { type: Number, default: -1 }, // -1 = unlimited
    tags: [{ type: String }],
    metaTitle: { type: String, default: "" },
    metaDesc: { type: String, default: "" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
  },
  { timestamps: true }
);

// slug index is already created by unique:true in schema definition
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ name: "text", description: "text", tags: "text" });

module.exports = mongoose.model("Product", productSchema);
