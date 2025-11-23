const express = require('express');
const router = express.Router();
const md5 = require('md5');
const { protect } = require('../middleware/auth');

// @desc    Generate PayHere payment hash
// @route   POST /api/payment/generate-hash
// @access  Private
router.post('/generate-hash', protect, async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

    // Validate required fields
    if (!orderId || !amount || !currency) {
      return res.status(400).json({
        success: false,
        message: 'Order ID, amount, and currency are required'
      });
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID;
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Format amount to 2 decimal places - CRITICAL: must be string with 2 decimals
    const formattedAmount = parseFloat(amount).toFixed(2);

    // Generate hash according to PayHere documentation
    // hash = UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))))
    // IMPORTANT: merchant_secret should be the RAW secret, not decoded
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const hashInput = merchantId + orderId + formattedAmount + currency + hashedSecret;
    const hash = md5(hashInput).toUpperCase();

    console.log('\n========== PayHere Hash Generation ==========');
    console.log('Merchant ID:', merchantId);
    console.log('Order ID:', orderId);
    console.log('Amount:', formattedAmount);
    console.log('Currency:', currency);
    console.log('Secret (Base64):', merchantSecret);
    console.log('MD5(Secret):', hashedSecret);
    console.log('Hash Input:', hashInput);
    console.log('Generated Hash:', hash);
    console.log('============================================\n');

    res.json({
      success: true,
      hash: hash,
      merchantId: merchantId
    });
  } catch (error) {
    console.error('Error generating PayHere hash:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating payment hash'
    });
  }
});

// @desc    Handle PayHere payment notification
// @route   POST /api/payment/notify
// @access  Public (PayHere callback)
router.post('/notify', express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const {
      merchant_id,
      order_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig,
      payment_id,
      method,
      card_holder_name,
      card_no
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET;

    // Verify the payment notification
    // md5sig = UPPERCASE(MD5(merchant_id + order_id + payhere_amount + payhere_currency + status_code + UPPERCASE(MD5(merchant_secret))))
    const hashedSecret = md5(merchantSecret).toUpperCase();
    const localMd5sig = md5(
      merchant_id + 
      order_id + 
      payhere_amount + 
      payhere_currency + 
      status_code + 
      hashedSecret
    ).toUpperCase();

    if (localMd5sig === md5sig) {
      // Payment is verified
      if (status_code === '2') {
        // Payment successful
        console.log('Payment successful for order:', order_id);
        console.log('Payment ID:', payment_id);
        console.log('Amount:', payhere_amount, payhere_currency);
        
        // TODO: Update order status in database
        // You can import Order model and update the order here
        // const Order = require('../models/Order');
        // await Order.findOneAndUpdate(
        //   { orderId: order_id },
        //   { 
        //     status: 'paid',
        //     paymentId: payment_id,
        //     paymentMethod: method,
        //     paidAt: new Date()
        //   }
        // );

        res.status(200).send('OK');
      } else if (status_code === '0') {
        // Payment pending
        console.log('Payment pending for order:', order_id);
        res.status(200).send('OK');
      } else {
        // Payment failed, canceled, or chargedback
        console.log('Payment failed for order:', order_id, 'Status:', status_code);
        res.status(200).send('OK');
      }
    } else {
      // Invalid notification
      console.error('Invalid payment notification signature');
      res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('Error processing payment notification:', error);
    res.status(500).send('Error processing notification');
  }
});

// @desc    Get payment status
// @route   GET /api/payment/status/:orderId
// @access  Private
router.get('/status/:orderId', protect, async (req, res) => {
  try {
    const { orderId } = req.params;
    
    // TODO: Fetch order status from database
    // const Order = require('../models/Order');
    // const order = await Order.findOne({ orderId });
    
    res.json({
      success: true,
      message: 'Payment status endpoint',
      orderId: orderId
      // status: order?.status
    });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching payment status'
    });
  }
});

module.exports = router;
