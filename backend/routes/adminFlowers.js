const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');
const { protect, authorize } = require('../middleware/auth');
const { uploadBase64, handleMulterError } = require('../middleware/uploadBase64');

// @route   POST /api/admin/flowers
// @desc    Create a new flower with Base64 image
// @access  Private/Admin
router.post(
  '/',
  protect,
  authorize('admin'),
  uploadBase64.single('image'),
  handleMulterError,
  async (req, res) => {
    try {
      // Validate that file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Please upload an image'
        });
      }

      // Extract form data
      const { name, price, description, category, collection } = req.body;

      // Validate required fields
      if (!name || !price || !description || !category || !collection) {
        return res.status(400).json({
          success: false,
          error: 'Please provide all required fields: name, price, description, category, collection'
        });
      }

      // Convert uploaded file buffer to Base64 string
      const base64Image = req.file.buffer.toString('base64');

      // Create new flower document
      const flower = await Flower.create({
        name,
        price: parseFloat(price),
        description,
        category,
        collection,
        image: base64Image
      });

      res.status(201).json({
        success: true,
        message: 'Flower created successfully',
        data: flower
      });

    } catch (error) {
      console.error('Error creating flower:', error);
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: messages.join(', ')
        });
      }

      res.status(500).json({
        success: false,
        error: 'Server error while creating flower'
      });
    }
  }
);

// @route   GET /api/admin/flowers
// @desc    Get all flowers (admin view)
// @access  Private/Admin
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const flowers = await Flower.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flowers.length,
      data: flowers
    });
  } catch (error) {
    console.error('Error fetching flowers:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching flowers'
    });
  }
});

// @route   GET /api/admin/flowers/:id
// @desc    Get single flower by ID
// @access  Private/Admin
router.get('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);

    if (!flower) {
      return res.status(404).json({
        success: false,
        error: 'Flower not found'
      });
    }

    res.status(200).json({
      success: true,
      data: flower
    });
  } catch (error) {
    console.error('Error fetching flower:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching flower'
    });
  }
});

// @route   PUT /api/admin/flowers/:id
// @desc    Update a flower
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  authorize('admin'),
  uploadBase64.single('image'),
  handleMulterError,
  async (req, res) => {
    try {
      const { name, price, description, category, collection } = req.body;

      // Find flower
      let flower = await Flower.findById(req.params.id);

      if (!flower) {
        return res.status(404).json({
          success: false,
          error: 'Flower not found'
        });
      }

      // Prepare update data
      const updateData = {
        name: name || flower.name,
        price: price ? parseFloat(price) : flower.price,
        description: description || flower.description,
        category: category || flower.category,
        collection: collection || flower.collection
      };

      // If new image uploaded, convert to Base64
      if (req.file) {
        updateData.image = req.file.buffer.toString('base64');
      }

      // Update flower
      flower = await Flower.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'Flower updated successfully',
        data: flower
      });

    } catch (error) {
      console.error('Error updating flower:', error);
      
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
          success: false,
          error: messages.join(', ')
        });
      }

      res.status(500).json({
        success: false,
        error: 'Server error while updating flower'
      });
    }
  }
);

// @route   DELETE /api/admin/flowers/:id
// @desc    Delete a flower
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const flower = await Flower.findById(req.params.id);

    if (!flower) {
      return res.status(404).json({
        success: false,
        error: 'Flower not found'
      });
    }

    await Flower.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Flower deleted successfully',
      data: {}
    });
  } catch (error) {
    console.error('Error deleting flower:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while deleting flower'
    });
  }
});

module.exports = router;
