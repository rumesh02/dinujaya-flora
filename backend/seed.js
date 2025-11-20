const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Supplier = require('./models/Supplier');
const Product = require('./models/Product');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Supplier.deleteMany();
    await Product.deleteMany();

    console.log('Existing data cleared');

    // Create main admin user
    const mainAdmin = await User.create({
      name: 'Admin User',
      email: 'admin@dinujayaflora.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567890'
    });

    console.log('Main Admin user created');
    console.log('Email: admin@dinujayaflora.com');
    console.log('Password: admin123');

    // Create second admin user
    const admin = await User.create({
      name: 'Dulara Mihiran',
      email: 'dularamihiran@gmail.com',
      password: 'admin123',
      role: 'admin',
      phone: '+1234567891'
    });

    console.log('Second Admin user created');
    console.log('Email: dularamihiran@gmail.com');
    console.log('Password: admin123');

    // Create test user
    const testUser = await User.create({
      name: 'John Doe',
      email: 'user@test.com',
      password: 'user123',
      role: 'user',
      phone: '+1234567892'
    });

    console.log('Test user created');
    console.log('Email: user@test.com');
    console.log('Password: user123');

    // Create sample suppliers
    const suppliers = await Supplier.insertMany([
      {
        name: 'Rose Garden Suppliers',
        email: 'contact@rosegarden.com',
        phone: '+1234567893',
        address: '123 Garden Street, Flower City, FC 12345',
        companyName: 'Rose Garden Ltd.'
      },
      {
        name: 'Lily Valley Wholesale',
        email: 'info@lilyvalley.com',
        phone: '+1234567894',
        address: '456 Valley Road, Bloom Town, BT 67890',
        companyName: 'Lily Valley Inc.'
      }
    ]);

    console.log('Sample suppliers created');

    // Create sample products
    const products = await Product.insertMany([
      {
        name: 'Red Rose Bouquet',
        category: 'Bouquet',
        price: 49.99,
        description: 'Beautiful arrangement of 12 fresh red roses',
        stock: 25,
        supplier: suppliers[0]._id,
        colors: ['Red'],
        occasion: ['Love', 'Anniversary'],
        image: 'default-flower.jpg'
      },
      {
        name: 'White Lily Arrangement',
        category: 'Arrangement',
        price: 65.00,
        description: 'Elegant white lilies in a ceramic vase',
        stock: 15,
        supplier: suppliers[1]._id,
        colors: ['White'],
        occasion: ['Sympathy', 'Wedding'],
        image: 'default-flower.jpg'
      },
      {
        name: 'Mixed Wildflower Bouquet',
        category: 'Bouquet',
        price: 39.99,
        description: 'Colorful assortment of seasonal wildflowers',
        stock: 30,
        supplier: suppliers[0]._id,
        colors: ['Mixed'],
        occasion: ['Birthday', 'Thank You'],
        image: 'default-flower.jpg'
      }
    ]);

    console.log('Sample products created');

    console.log('\n✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
