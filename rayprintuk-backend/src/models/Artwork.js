const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  order:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  product:   { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  fileName:  { type: String, required: true },
  fileUrl:   { type: String, required: true },       // Cloudinary secure URL
  publicId:  { type: String, required: true },       // Cloudinary public_id
  fileType:  { type: String, required: true },       // MIME type
  fileSize:  { type: Number, required: true },       // bytes
  format:    { type: String },                       // pdf, ai, psd, png, jpg…
  width:     { type: Number },                       // px
  height:    { type: Number },                       // px
  dpi:       { type: Number },
  status: {
    type: String,
    enum: ['uploaded', 'under_review', 'approved', 'rejected', 'needs_changes'],
    default: 'uploaded',
  },
  reviewNotes: { type: String, default: '' },
  reviewedBy:  { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  reviewedAt:  { type: Date },
}, { timestamps: true });

artworkSchema.index({ user: 1, createdAt: -1 });
artworkSchema.index({ order: 1 });
artworkSchema.index({ status: 1 });

module.exports = mongoose.model('Artwork', artworkSchema);

