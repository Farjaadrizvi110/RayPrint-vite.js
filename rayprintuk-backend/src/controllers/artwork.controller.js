const Artwork = require("../models/Artwork");
const cloudinary = require("../config/cloudinary");
const {
  sendSuccess,
  sendError,
  paginationMeta,
} = require("../utils/apiResponse");
const { sendArtworkStatusEmail } = require("../utils/emailService");
const User = require("../models/User");
const logger = require("../utils/logger");

// POST /api/artwork/upload
exports.uploadArtwork = async (req, res, next) => {
  try {
    if (!req.file) return sendError(res, 400, "No file uploaded.");

    const { orderId, productId } = req.body;
    const f = req.file;

    // Derive extension from original filename (safe — Cloudinary URL may vary)
    const ext = f.originalname.split(".").pop()?.toLowerCase() || "";

    const artwork = await Artwork.create({
      user: req.user._id,
      order: orderId || undefined,
      product: productId || undefined,
      fileName: f.originalname,
      fileUrl: f.path, // Cloudinary secure_url
      publicId: f.filename, // Cloudinary public_id
      fileType: f.mimetype,
      fileSize: f.size || f.buffer?.length || 0,
      format: ext,
      width: f.width || undefined,
      height: f.height || undefined,
    });

    return sendSuccess(res, 201, "Artwork uploaded successfully.", artwork);
  } catch (err) {
    next(err);
  }
};

// GET /api/artwork  (my uploads)
exports.getMyArtwork = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.status) filter.status = req.query.status;

    const [artworks, total] = await Promise.all([
      Artwork.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Artwork.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      "Artworks retrieved.",
      artworks,
      paginationMeta(total, page, limit)
    );
  } catch (err) {
    next(err);
  }
};

// DELETE /api/artwork/:id
exports.deleteArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!artwork) return sendError(res, 404, "Artwork not found.");
    if (artwork.status === "approved")
      return sendError(res, 400, "Cannot delete an approved artwork.");

    await cloudinary.uploader.destroy(artwork.publicId, {
      resource_type: "auto",
    });
    await artwork.deleteOne();

    return sendSuccess(res, 200, "Artwork deleted.");
  } catch (err) {
    next(err);
  }
};

// PATCH /api/artwork/:id/review  (admin)
exports.reviewArtwork = async (req, res, next) => {
  try {
    const { status, reviewNotes } = req.body;
    const validStatuses = ["approved", "rejected", "needs_changes"];
    if (!validStatuses.includes(status))
      return sendError(res, 400, "Invalid review status.");

    const artwork = await Artwork.findByIdAndUpdate(
      req.params.id,
      {
        status,
        reviewNotes: reviewNotes || "",
        reviewedBy: req.admin._id,
        reviewedAt: new Date(),
      },
      { new: true }
    );
    if (!artwork) return sendError(res, 404, "Artwork not found.");

    // Notify the customer
    const user = await User.findById(artwork.user);
    if (user)
      sendArtworkStatusEmail(user, artwork).catch((e) =>
        logger.warn("Artwork email failed", { error: e.message })
      );

    return sendSuccess(res, 200, "Artwork reviewed.", artwork);
  } catch (err) {
    next(err);
  }
};

// GET /api/artwork/:id/download  (admin — download file via Cloudinary URL)
exports.downloadArtwork = async (req, res, next) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return sendError(res, 404, "Artwork not found.");

    // Return the Cloudinary URL and filename so the frontend can trigger download
    return sendSuccess(res, 200, "Download URL retrieved.", {
      fileUrl: artwork.fileUrl,
      fileName: artwork.fileName,
      fileType: artwork.fileType,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/artwork/admin/all  (admin — all artwork)
exports.getAllArtwork = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const [artworks, total] = await Promise.all([
      Artwork.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("user", "firstName lastName email"),
      Artwork.countDocuments(filter),
    ]);

    return sendSuccess(
      res,
      200,
      "All artworks retrieved.",
      artworks,
      paginationMeta(total, page, limit)
    );
  } catch (err) {
    next(err);
  }
};
