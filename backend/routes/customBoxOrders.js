const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { protect } = require('../middleware/auth');

// POST /api/orders/custom-box - Create custom flower box order
router.post('/custom-box', protect, async (req, res) => {
  try {
    const {
      boxItems,
      deliveryAddress,
      recipientName,
      recipientPhone,
      deliveryDate,
      deliveryTime,
      paymentMethod,
      specialInstructions
    } = req.body;

    // Validate box items
    if (!boxItems || boxItems.length === 0) {
      return res.status(400).json({ message: 'Box items are required' });
    }

    // Verify all flowers exist and calculate total
    let totalAmount = 0;
    const validatedBoxItems = [];

    for (const item of boxItems) {
      const flower = await Product.findById(item.flowerId);
      
      if (!flower) {
        return res.status(404).json({ message: `Flower not found: ${item.flowerId}` });
      }

      if (flower.productType !== 'flowers') {
        return res.status(400).json({ message: `Product ${flower.name} is not an individual flower` });
      }

      if (!flower.isAvailable) {
        return res.status(400).json({ message: `${flower.name} is not available` });
      }

      if (flower.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${flower.name}. Available: ${flower.stock}` });
      }

      validatedBoxItems.push({
        flower: flower._id,
        name: flower.name,
        quantity: item.quantity,
        price: flower.price
      });

      totalAmount += flower.price * item.quantity;
    }

    // Validate delivery information
    if (!deliveryAddress || !recipientName || !recipientPhone || !deliveryDate) {
      return res.status(400).json({ message: 'Delivery information is incomplete' });
    }

    // Create order
    const order = new Order({
      user: req.user._id,
      orderType: 'custom_box',
      boxItems: validatedBoxItems,
      totalAmount,
      deliveryAddress,
      recipientName,
      recipientPhone,
      deliveryDate,
      deliveryTime,
      paymentMethod: paymentMethod || 'cash',
      specialInstructions,
      status: 'pending',
      paymentStatus: 'pending'
    });

    await order.save();

    // Update stock for each flower
    for (const item of validatedBoxItems) {
      await Product.findByIdAndUpdate(
        item.flower,
        { $inc: { stock: -item.quantity } }
      );
    }

    // Populate flower details
    await order.populate('boxItems.flower', 'name image category');

    res.status(201).json({
      message: 'Custom flower box order created successfully',
      order
    });

  } catch (error) {
    console.error('Create custom box order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/custom-box - Get all custom box orders for a user
router.get('/custom-box', protect, async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
      orderType: 'custom_box'
    })
      .populate('boxItems.flower', 'name image category')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.error('Get custom box orders error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/orders/custom-box/:id - Get specific custom box order
router.get('/custom-box/:id', protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
      orderType: 'custom_box'
    }).populate('boxItems.flower', 'name image category');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get custom box order error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
