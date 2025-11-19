const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Please provide category'],
    enum: ['Bouquet', 'Single Stem', 'Arrangement', 'Plant', 'Gift Set', 'Romantic', 'Birthday', 'Anniversary', 'Sympathy', 'Indoor Plants', 'Luxury Bouquets', 'Other'],
    default: 'Bouquet'
  },
  price: {
    type: Number,
    required: [true, 'Please provide price'],
    min: 0
  },
  description: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: 0,
    default: 0
  },
  image: {
    type: String,
    default: 'default-flower.jpg'
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Supplier'
  },
  colors: [{
    type: String
  }],
  occasion: [{
    type: String,
    enum: ['Wedding', 'Birthday', 'Anniversary', 'Sympathy', 'Love', 'Congratulations', 'Get Well', 'Thank You', 'Other']
  }],
  isAvailable: {
    type: Boolean,
    default: true
  },
  isBestseller: {
    type: Boolean,
    default: false
  },
  collection: {
    type: String,
    enum: ['Bouquets', 'Indoor Plants', 'Wedding Décor', 'Gift Bundles', 'Other'],
    default: 'Other'
  },
  productType: {
    type: String,
    enum: ['flowers', 'bouquet'],
    default: 'flowers',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
