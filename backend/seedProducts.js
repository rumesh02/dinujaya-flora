const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const sampleProducts = [
  {
    name: 'Rose Bouquet',
    description: 'Beautiful red roses perfect for any occasion',
    price: 2500,
    category: 'Bouquets',
    collection: 'Romantic',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Tulip Arrangement',
    description: 'Fresh tulips in vibrant colors',
    price: 3000,
    category: 'Bouquets',
    collection: 'Spring',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Sunflower Delight',
    description: 'Bright sunflowers to brighten your day',
    price: 2000,
    category: 'Bouquets',
    collection: 'Summer',
    stock: 40,
    image: 'https://images.unsplash.com/photo-1597848212624-e6d2c7e0c8e0?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Orchid Elegance',
    description: 'Elegant orchids for special moments',
    price: 4500,
    category: 'Bouquets',
    collection: 'Premium',
    stock: 20,
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Lily Basket',
    description: 'Fresh lilies in a beautiful basket',
    price: 3500,
    category: 'Bouquets',
    collection: 'Classic',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Mixed Flower Bouquet',
    description: 'A colorful mix of seasonal flowers',
    price: 2800,
    category: 'Bouquets',
    collection: 'Seasonal',
    stock: 35,
    image: 'https://images.unsplash.com/photo-1560717845-968905f35b67?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Carnation Collection',
    description: 'Beautiful carnations in various colors',
    price: 1800,
    category: 'Bouquets',
    collection: 'Budget',
    stock: 60,
    image: 'https://images.unsplash.com/photo-1551016043-06d0e3d711ec?w=500',
    isBestseller: true,
    isAvailable: true
  },
  {
    name: 'Peony Paradise',
    description: 'Luxurious peonies for that special someone',
    price: 5000,
    category: 'Bouquets',
    collection: 'Premium',
    stock: 15,
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=500',
    isBestseller: true,
    isAvailable: true
  }
];

async function seedProducts() {
  try {
    console.log('🌱 Starting product seeding...\n');

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dinujaya-flora');
    console.log('✅ Connected to MongoDB');

    // Check existing products
    const existingCount = await Product.countDocuments();
    console.log(`📦 Existing products: ${existingCount}`);

    // Insert sample products
    const result = await Product.insertMany(sampleProducts);
    console.log(`✅ Added ${result.length} sample products`);

    console.log('\n📦 Sample Products Added:');
    result.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.name} - LKR ${product.price}`);
    });

    console.log('\n✨ Database seeding completed successfully!');
    console.log('🚀 You can now start your frontend and see the products.\n');

    process.exit(0);
  } catch (error) {
    if (error.code === 11000) {
      console.error('❌ Error: Some products already exist in database');
      console.log('💡 Tip: Products might already be added. Check your database or clear it first.');
    } else {
      console.error('❌ Error seeding products:', error.message);
    }
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
