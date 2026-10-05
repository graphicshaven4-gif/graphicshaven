const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const streamifier = require('stream');
const { cloudinary, isCloudinaryConfigured } = require('../config/cloudinary');

const router = express.Router();

// Ensure local uploads directory exists for fallback
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage for multer (buffers in RAM for Cloudinary streaming)
const storage = multer.memoryStorage();

// File filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg\+xml|gif|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname || mimetype) {
    return cb(null, true);
  }
  cb(new Error('Only image files (JPEG, PNG, WebP, SVG, GIF) are allowed!'));
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter,
});

/**
 * @route   POST /api/upload/image
 * @desc    Upload an image file to Cloudinary (or local fallback if keys not configured)
 * @access  Public / Protected (can be called from Admin dashboard)
 */
router.post('/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided in request. Field name should be "image".',
      });
    }

    // 1. If Cloudinary credentials are valid, attempt stream to Cloudinary
    if (isCloudinaryConfigured()) {
      try {
        const uploadFromBuffer = (fileBuffer) => {
          return new Promise((resolve, reject) => {
            const cld_upload_stream = cloudinary.uploader.upload_stream(
              {
                folder: 'graphicshaven',
                resource_type: 'image',
              },
              (error, result) => {
                if (result) {
                  resolve(result);
                } else {
                  reject(error);
                }
              }
            );
            const readableStream = new streamifier.Readable();
            readableStream.push(fileBuffer);
            readableStream.push(null);
            readableStream.pipe(cld_upload_stream);
          });
        };

        const result = await uploadFromBuffer(req.file.buffer);

        return res.status(200).json({
          success: true,
          url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          provider: 'cloudinary',
          message: 'Image uploaded to Cloudinary successfully.',
        });
      } catch (cldErr) {
        console.warn(`[Cloudinary Warning] Upload failed (${cldErr.message}). Falling back to local storage.`);
      }
    }

    // 2. Fallback: Save to local uploads folder if Cloudinary credentials are missing
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(req.file.originalname) || '.png';
    const filename = `gh-${uniqueSuffix}${extension}`;
    const filePath = path.join(uploadDir, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    // Build public URL
    const protocol = req.protocol;
    const host = req.get('host');
    const localUrl = `${protocol}://${host}/uploads/${filename}`;

    return res.status(200).json({
      success: true,
      url: localUrl,
      provider: 'local',
      message: 'Cloudinary not configured yet in server/.env. Saved to local storage fallback.',
    });
  } catch (error) {
    console.error('[Upload Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Image upload failed',
    });
  }
});

/**
 * @route   GET /api/upload/status
 * @desc    Check Cloudinary configuration status
 */
router.get('/status', (req, res) => {
  const configured = isCloudinaryConfigured();
  res.status(200).json({
    configured,
    cloudName: configured ? process.env.CLOUDINARY_CLOUD_NAME : null,
    message: configured
      ? 'Cloudinary is configured and ready.'
      : 'Cloudinary credentials missing. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in server/.env.',
  });
});

module.exports = router;
