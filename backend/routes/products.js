const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { body, validationResult } = require('express-validator');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, isAvailable, type, productType } = req.query;
    
    let query = {};
    
    if (category) {
      query.category = category;
    }
    
    // Support both 'type' and 'productType' query params
    if (type) {
      query.productType = type;
    }
    if (productType) {
      query.productType = productType;
    }
    
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    
    if (isAvailable !== undefined) {
      query.isAvailable = isAvailable === 'true';
    }
    
    const products = await Product.find(query)
      .populate('supplier', 'name email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/bestsellers/list
// @desc    Get bestseller products
// @access  Public
router.get('/bestsellers/list', async (req, res) => {
  try {
    const bestsellers = await Product.find({ isBestseller: true, isAvailable: true })
      .populate('supplier', 'name')
      .sort({ createdAt: -1 })
      .limit(8);
    
    res.status(200).json({
      success: true,
      count: bestsellers.length,
      products: bestsellers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/categories/list
// @desc    Get all unique categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    
    res.status(200).json({
      success: true,
      count: categories.length,
      categories: categories.filter(cat => cat) // Remove any null/undefined
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/category/:categoryName
// @desc    Get products by category
// @access  Public
router.get('/category/:categoryName', async (req, res) => {
  try {
    const products = await Product.find({ 
      category: req.params.categoryName,
      isAvailable: true 
    })
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/collections/list
// @desc    Get all unique collections
// @access  Public
router.get('/collections/list', async (req, res) => {
  try {
    const collections = await Product.distinct('collection');
    
    res.status(200).json({
      success: true,
      count: collections.length,
      collections: collections.filter(col => col && col !== 'Other') // Remove null and 'Other'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/collection/:collectionName
// @desc    Get products by collection
// @access  Public
router.get('/collection/:collectionName', async (req, res) => {
  try {
    const products = await Product.find({ 
      collection: req.params.collectionName,
      isAvailable: true 
    })
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/occasion/:occasionName
// @desc    Get products by occasion
// @access  Public
router.get('/occasion/:occasionName', async (req, res) => {
  try {
    const products = await Product.find({ 
      occasion: req.params.occasionName,
      isAvailable: true 
    })
      .populate('supplier', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      products: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('supplier', 'name email phone');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   POST /api/products
// @desc    Create new product
// @access  Private/Admin
router.post('/', protect, authorize('admin'), upload.single('image'), [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('stock').isNumeric().withMessage('Stock must be a number')
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const productData = req.body;
    
    // Add image filename if uploaded
    if (req.file) {
      productData.image = req.file.filename;
    }

    // Parse arrays if they're sent as strings
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }
    if (typeof productData.occasion === 'string') {
      productData.occasion = JSON.parse(productData.occasion);
    }

    const product = await Product.create(productData);
    
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update product
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), upload.single('image'), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updateData = req.body;
    
    // Add new image filename if uploaded
    if (req.file) {
      updateData.image = req.file.filename;
    }

    // Parse arrays if they're sent as strings
    if (typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }
    if (typeof updateData.occasion === 'string') {
      updateData.occasion = JSON.parse(updateData.occasion);
    }

    product = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true
      }
    );
    
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete product
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
