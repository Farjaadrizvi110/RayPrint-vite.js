const express = require("express");
const { body } = require("express-validator");
const ctrl = require("../controllers/artwork.controller");
const { protect } = require("../middleware/auth.middleware");
const {
  isAdmin,
  requirePermission,
} = require("../middleware/admin.middleware");
const { artworkUploadMiddleware } = require("../middleware/upload.middleware");

const router = express.Router();

// ─── Customer routes ──────────────────────────────────────────────────────────
router.post("/upload", protect, artworkUploadMiddleware, ctrl.uploadArtwork);

router.get("/", protect, ctrl.getMyArtwork);
router.delete("/:id", protect, ctrl.deleteArtwork);

// ─── Admin routes ─────────────────────────────────────────────────────────────
// NOTE: specific admin paths must be declared BEFORE /:id to avoid conflicts
router.get(
  "/admin/all",
  protect,
  isAdmin,
  requirePermission("manageOrders"),
  ctrl.getAllArtwork
);

// GET /api/artwork/:id/download — admin downloads a specific file
router.get("/:id/download", protect, isAdmin, ctrl.downloadArtwork);

router.patch(
  "/admin/:id/review",
  protect,
  isAdmin,
  requirePermission("manageOrders"),
  [
    body("status")
      .isIn(["approved", "rejected", "needs_changes"])
      .withMessage("Invalid status."),
    body("reviewNotes").optional().isString(),
  ],
  ctrl.reviewArtwork
);

module.exports = router;
