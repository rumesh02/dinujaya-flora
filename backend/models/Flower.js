const mongoose = require('mongoose');

const FlowerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a flower name'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: [
      'Roses',
      'Tulips',
      'Lilies',
      'Orchids',
      'Carnations',
      'Sunflowers',
      'Daisies',
      'Chrysanthemums',
      'Gerberas',
      'Peonies',
      'Hydrangeas',
      'Other'
    ]
  },
  collection: {
    type: String,
    required: [true, 'Please provide a collection'],
    enum: [
      'Bouquets',
      'Indoor Plants',
      'Wedding Décor',
      'Gift Bundles',
      'Other'
    ]
  },
  image: {
    type: String,
    required: [true, 'Please provide an image'],
    // Will store Base64 encoded image string
    // Format: base64 string (without data:image/jpeg;base64, prefix)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add index for better query performance
FlowerSchema.index({ category: 1, collection: 1 });
FlowerSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Flower', FlowerSchema);
