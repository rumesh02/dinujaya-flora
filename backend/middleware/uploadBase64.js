const multer = require('multer');

// Configure multer to use memory storage (no files saved to disk)
const storage = multer.memoryStorage();

// File filter to validate image types
const fileFilter = (req, file, cb) => {
  // Allowed image MIME types
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    // Accept file
    cb(null, true);
  } else {
    // Reject file
    cb(
      new Error('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.'),
      false
    );
  }
};

// Configure multer with memory storage, file filter, and size limits
const uploadBase64 = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB maximum file size
  }
});

// Error handling middleware for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: 'File size too large. Maximum size is 2MB.'
      });
    }
    return res.status(400).json({
      success: false,
      error: `Upload error: ${err.message}`
    });
  }
  
  if (err) {
    return res.status(400).json({
      success: false,
      error: err.message
    });
  }
  
  next();
};

module.exports = { uploadBase64, handleMulterError };
