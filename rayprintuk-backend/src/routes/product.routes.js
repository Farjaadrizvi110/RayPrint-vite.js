const express = require("express");
const { body, param } = require("express-validator");
const ctrl = require("../controllers/product.controller");
const { protect } = require("../middleware/auth.middleware");
const {
  isAdmin,
  requirePermission,
} = require("../middleware/admin.middleware");
const {
  productImagesUploadMiddleware,
} = require("../middleware/upload.middleware");

const router = express.Router();

const productRules = [
  body("name").trim().notEmpty().withMessage("Product name is required."),
  body("slug").trim().notEmpty().toLowerCase(),
  body("category").notEmpty().withMessage("Category is required."),
  body("basePrice")
    .isInt({ min: 1 })
    .withMessage("Base price must be a positive integer (pence)."),
];

// ─── Public routes ────────────────────────────────────────────────────────────
router.get("/", ctrl.getProducts);
router.get("/:slug", ctrl.getProductBySlug);

// ─── Admin routes ─────────────────────────────────────────────────────────────
router.post(
  "/",
  protect,
  isAdmin,
  requirePermission("manageProducts"),
  productImagesUploadMiddleware,
  productRules,
  ctrl.createProduct
);

router.patch(
  "/:id",
  protect,
  isAdmin,
  requirePermission("manageProducts"),
  productImagesUploadMiddleware,
  [body("basePrice").optional().isInt({ min: 1 })],
  ctrl.updateProduct
);

router.delete(
  "/:id",
  protect,
  isAdmin,
  requirePermission("manageProducts"),
  ctrl.deleteProduct
);

router.delete(
  "/:id/images/:publicId",
  protect,
  isAdmin,
  requirePermission("manageProducts"),
  ctrl.deleteProductImage
);

module.exports = router;
