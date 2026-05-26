import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';

export const uploadImageFile = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Image file is required');
  }

  const url = process.env.PUBLIC_MEDIA_URL
    ? `${process.env.PUBLIC_MEDIA_URL.replace(/\/$/, '')}/${req.file.filename}`
    : `/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: {
      url,
      filename: req.file.filename,
      size: req.file.size,
      mimetype: req.file.mimetype
    }
  });
});
