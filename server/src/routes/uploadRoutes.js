import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Memory storage for multer (max 5MB)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WebP) are allowed!'), false);
    }
  }
});

// Configure Cloudinary if credentials exist
const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// @desc    Upload item photo (Cloudinary if configured, fallback to Base64 data URL for offline college labs)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded.'
      });
    }

    // 1. If Cloudinary is configured, upload to Cloudinary
    if (isCloudinaryConfigured) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'lostloop' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return res.status(500).json({
              success: false,
              message: 'Failed to upload image to Cloudinary.'
            });
          }
          return res.status(200).json({
            success: true,
            imageUrl: result.secure_url,
            provider: 'cloudinary'
          });
        }
      );

      uploadStream.end(req.file.buffer);
      return;
    }

    // 2. Offline / local college lab fallback:
    // Convert to high-efficiency base64 data URL so user doesn't need paid/external accounts
    const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    return res.status(200).json({
      success: true,
      imageUrl: base64Image,
      provider: 'local-data-url',
      note: 'Using local data URL storage because Cloudinary credentials are not configured in .env'
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Check upload service status
// @route   GET /api/upload/status
// @access  Public
router.get('/status', (req, res) => {
  res.status(200).json({
    cloudinaryConfigured: isCloudinaryConfigured,
    mode: isCloudinaryConfigured ? 'cloudinary' : 'local-data-url-fallback'
  });
});

export default router;
