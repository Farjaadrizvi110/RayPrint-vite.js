const cloudinary = require('cloudinary').v2;
const logger = require('../utils/logger');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

// Verify configuration on startup
cloudinary.api.ping()
  .then(() => logger.info('✅ Cloudinary connected'))
  .catch((err) => logger.warn('⚠️  Cloudinary ping failed — check credentials', { error: err.message }));

module.exports = cloudinary;

