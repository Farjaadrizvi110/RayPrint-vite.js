/**
 * Send a standardised success response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} data
 * @param {object} meta  - optional pagination / extra metadata
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const payload = { success: true, message };
  if (data !== null) payload.data = data;
  if (Object.keys(meta).length) payload.meta = meta;
  return res.status(statusCode).json(payload);
};

/**
 * Send a standardised error response.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} errors - optional validation errors or details
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
};

/**
 * Build pagination meta from mongoose query results.
 * @param {number} total   - Total document count
 * @param {number} page    - Current page (1-based)
 * @param {number} limit   - Items per page
 */
const paginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  totalPages: Math.ceil(total / limit),
  hasNextPage: page * limit < total,
  hasPrevPage: page > 1,
});

module.exports = { sendSuccess, sendError, paginationMeta };

