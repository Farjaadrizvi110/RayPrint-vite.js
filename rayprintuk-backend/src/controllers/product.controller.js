const { validationResult } = require('express-validator');
const Product = require('../models/Product');
const cloudinary = require('../config/cloudinary');
const { sendSuccess, sendError, paginationMeta } = require('../utils/apiResponse');

// GET /api/products
exports.getProducts = async (req, res, next) => {
  try {
    const page     = Math.max(1, parseInt(req.query.page)  || 1);
    const limit    = Math.min(100, parseInt(req.query.limit) || 12);
    const skip     = (page - 1) * limit;
    const filter   = { isActive: true };

    if (req.query.category) filter.category = req.query.category;
    if (req.query.featured === 'true') filter.isFeatured = true;
    if (req.query.search) filter.$text = { $search: req.query.search };

    const sort = req.query.sort === 'price_asc'  ? { basePrice: 1 }
               : req.query.sort === 'price_desc' ? { basePrice: -1 }
               : req.query.sort === 'newest'     ? { createdAt: -1 }
               : { isFeatured: -1, createdAt: -1 };

    const [products, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return sendSuccess(res, 200, 'Products retrieved.', products, paginationMeta(total, page, limit));
  } catch (err) { next(err); }
};

// GET /api/products/:slug
exports.getProductBySlug = async (req, res, next) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true });
    if (!product) return sendError(res, 404, 'Product not found.');
    return sendSuccess(res, 200, 'Product retrieved.', product);
  } catch (err) { next(err); }
};

// POST /api/products  (admin)
exports.createProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 422, 'Validation failed', errors.array());

    const imageUrls = req.files?.map((f) => f.path) || [];
    const product = await Product.create({ ...req.body, images: imageUrls, createdBy: req.admin._id });
    return sendSuccess(res, 201, 'Product created.', product);
  } catch (err) { next(err); }
};

// PATCH /api/products/:id  (admin)
exports.updateProduct = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return sendError(res, 422, 'Validation failed', errors.array());

    const newImages = req.files?.map((f) => f.path) || [];
    const updateData = { ...req.body };
    if (newImages.length) updateData.$push = { images: { $each: newImages } };

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
    if (!product) return sendError(res, 404, 'Product not found.');
    return sendSuccess(res, 200, 'Product updated.', product);
  } catch (err) { next(err); }
};

// DELETE /api/products/:id  (admin)
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return sendError(res, 404, 'Product not found.');

    // Remove Cloudinary images
    await Promise.allSettled(
      product.images.map((url) => {
        const parts = url.split('/');
        const publicId = parts.slice(-2).join('/').split('.')[0];
        return cloudinary.uploader.destroy(publicId);
      })
    );

    await product.deleteOne();
    return sendSuccess(res, 200, 'Product deleted.');
  } catch (err) { next(err); }
};

// DELETE /api/products/:id/images/:publicId  (admin)
exports.deleteProductImage = async (req, res, next) => {
  try {
    const { id, publicId } = req.params;
    await cloudinary.uploader.destroy(decodeURIComponent(publicId));
    const product = await Product.findByIdAndUpdate(
      id,
      { $pull: { images: { $regex: decodeURIComponent(publicId) } } },
      { new: true }
    );
    if (!product) return sendError(res, 404, 'Product not found.');
    return sendSuccess(res, 200, 'Image deleted.', product);
  } catch (err) { next(err); }
};

