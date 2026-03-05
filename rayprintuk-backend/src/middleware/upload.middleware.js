const multer = require("multer");
const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");
const { sendError } = require("../utils/apiResponse");

const MAX_ARTWORK_MB = 50;
const MAX_IMAGE_MB = 10;

const ARTWORK_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "application/postscript",
  "image/vnd.adobe.photoshop",
  "image/tiff",
];
const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// ─── Memory storage (buffers uploaded to Cloudinary in controller) ────────────
const memoryStorage = multer.memoryStorage();

const artworkFilter = (req, file, cb) =>
  ARTWORK_TYPES.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error(`Unsupported type: ${file.mimetype}`), false);

const imageFilter = (req, file, cb) =>
  IMAGE_TYPES.includes(file.mimetype)
    ? cb(null, true)
    : cb(new Error("Only JPG, PNG, WebP allowed."), false);

const uploadArtwork = multer({
  storage: memoryStorage,
  fileFilter: artworkFilter,
  limits: { fileSize: MAX_ARTWORK_MB * 1024 * 1024 },
});

const uploadProductImages = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_IMAGE_MB * 1024 * 1024 },
});

// ─── Helper: stream a buffer to Cloudinary ───────────────────────────────────
const streamUploadToCloudinary = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });

/**
 * Middleware factory: wraps a multer instance to buffer files in memory,
 * uploads them to Cloudinary, then attaches enriched `req.file` / `req.files`.
 *
 * @param {multer.Multer} multerInstance - pre-configured multer instance
 * @param {{ folder: string, resource_type?: string, transformation?: object[] }} cloudinaryOpts
 * @param {'single'|'array'} mode
 * @param {string} fieldName
 * @param {number} maxCount - only used in array mode
 */
const cloudinaryUpload =
  (
    multerInstance,
    cloudinaryOpts,
    mode = "single",
    fieldName = "file",
    maxCount = 10
  ) =>
  async (req, res, next) => {
    const multerFn =
      mode === "array"
        ? multerInstance.array(fieldName, maxCount)
        : multerInstance.single(fieldName);

    multerFn(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return err.code === "LIMIT_FILE_SIZE"
          ? sendError(
              res,
              400,
              `File too large. Max ${
                mode === "array" ? MAX_IMAGE_MB : MAX_ARTWORK_MB
              }MB.`
            )
          : sendError(res, 400, err.message);
      }
      if (err) return sendError(res, 400, err.message || "Upload error.");

      try {
        const files = mode === "array" ? req.files : req.file ? [req.file] : [];
        if (!files.length) return next();

        const uploaded = await Promise.all(
          files.map((f) => {
            const opts = {
              ...cloudinaryOpts,
              folder:
                typeof cloudinaryOpts.folder === "function"
                  ? cloudinaryOpts.folder(req)
                  : cloudinaryOpts.folder,
              public_id: `${Date.now()}-${f.originalname.replace(/\s+/g, "_")}`,
            };
            return streamUploadToCloudinary(f.buffer, opts);
          })
        );

        // Enrich req.file / req.files with Cloudinary result
        if (mode === "array") {
          req.files = uploaded.map((r, i) => ({
            ...files[i],
            path: r.secure_url,
            filename: r.public_id,
            width: r.width,
            height: r.height,
          }));
        } else {
          req.file = {
            ...files[0],
            path: uploaded[0].secure_url,
            filename: uploaded[0].public_id,
            width: uploaded[0].width,
            height: uploaded[0].height,
          };
        }
        next();
      } catch (uploadErr) {
        next(uploadErr);
      }
    });
  };

// ─── Pre-configured middleware ────────────────────────────────────────────────
const artworkUploadMiddleware = cloudinaryUpload(
  uploadArtwork,
  {
    folder: (req) => `rayprintuk/artwork/${req.user?._id || "guest"}`,
    resource_type: "auto",
  },
  "single",
  "artwork"
);

const productImagesUploadMiddleware = cloudinaryUpload(
  uploadProductImages,
  {
    folder: "rayprintuk/products",
    resource_type: "image",
    transformation: [
      { width: 1200, height: 1200, crop: "limit", quality: "auto" },
    ],
  },
  "array",
  "images",
  10
);

module.exports = {
  uploadArtwork,
  uploadProductImages,
  artworkUploadMiddleware,
  productImagesUploadMiddleware,
  streamUploadToCloudinary,
};
