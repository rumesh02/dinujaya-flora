const express = require('express');
const router = express.Router();
const Flower = require('../models/Flower');

// @route   GET /api/flowers
// @desc    Get all flowers for public homepage
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, collection } = req.query;

    // Build query filter
    const filter = {};
    if (category) filter.category = category;
    if (collection) filter.collection = collection;

    // Fetch flowers with optional filtering
    const flowers = await Flower.find(filter)
      .select('_id name price description category collection image createdAt')
      .sort({ createdAt: -1 });

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

// @route   GET /api/flowers/:id
// @desc    Get single flower by ID (public)
// @access  Public
router.get('/:id', async (req, res) => {
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

// @route   GET /api/flowers/category/:category
// @desc    Get flowers by category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const flowers = await Flower.find({ category: req.params.category })
      .select('_id name price description category collection image createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flowers.length,
      data: flowers
    });
  } catch (error) {
    console.error('Error fetching flowers by category:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching flowers'
    });
  }
});

// @route   GET /api/flowers/collection/:collection
// @desc    Get flowers by collection
// @access  Public
router.get('/collection/:collection', async (req, res) => {
  try {
    const flowers = await Flower.find({ collection: req.params.collection })
      .select('_id name price description category collection image createdAt')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: flowers.length,
      data: flowers
    });
  } catch (error) {
    console.error('Error fetching flowers by collection:', error);
    res.status(500).json({
      success: false,
      error: 'Server error while fetching flowers'
    });
  }
});

module.exports = router;
