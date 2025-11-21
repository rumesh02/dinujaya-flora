/**
 * Migration Script: Convert Image File Paths to Base64
 * 
 * This script reads products with old file paths (e.g., product-123.jpg)
 * and converts them to Base64 strings stored directly in MongoDB.
 * 
 * USAGE:
 *   node scripts/migrateImagesToBase64.js
 * 
 * REQUIREMENTS:
 *   - MongoDB connection
 *   - Image files exist in uploads/products/
 *   - Enough memory for Base64 conversion
 */

const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

// Define Product schema (minimal version for migration)
const productSchema = new mongoose.Schema({
  name: String,
  image: String,
  imageBase64: String,
}, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

/**
 * Convert image file to Base64 data URI
 * @param {string} filePath - Path to image file
 * @returns {string} - Complete Base64 data URI
 */
const fileToBase64 = (filePath) => {
  try {
    // Read file as buffer
    const fileBuffer = fs.readFileSync(filePath);
    
    // Detect MIME type from extension
    const ext = path.extname(filePath).toLowerCase();
    let mimeType = 'image/jpeg';
    
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
    else if (ext === '.webp') mimeType = 'image/webp';
    else if (ext === '.gif') mimeType = 'image/gif';
    
    // Convert to Base64
    const base64String = fileBuffer.toString('base64');
    
    // Create complete data URI
    return `data:${mimeType};base64,${base64String}`;
  } catch (error) {
    throw new Error(`Failed to convert file: ${error.message}`);
  }
};

/**
 * Check if image string is already Base64
 * @param {string} image - Image string to check
 * @returns {boolean}
 */
const isBase64Image = (image) => {
  if (!image) return false;
  return image.startsWith('data:image') || (image.length > 200 && /^[A-Za-z0-9+/=]+$/.test(image));
};

/**
 * Migrate products from file paths to Base64
 */
const migrateProducts = async () => {
  try {
    console.log('\n🔄 Starting migration...\n');

    // Get all products
    const products = await Product.find({});
    console.log(`📦 Found ${products.length} products\n`);

    let migratedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        // Skip if already Base64
        if (isBase64Image(product.image)) {
          console.log(`⏭️  Skipped: ${product.name} - Already Base64`);
          skippedCount++;
          continue;
        }

        // Skip if imageBase64 already exists
        if (product.imageBase64 && isBase64Image(product.imageBase64)) {
          console.log(`⏭️  Skipped: ${product.name} - Has imageBase64`);
          skippedCount++;
          continue;
        }

        // Skip external URLs (Cloudinary, Unsplash, etc.)
        if (product.image.startsWith('http://') || product.image.startsWith('https://')) {
          console.log(`🌐 Skipped: ${product.name} - External URL`);
          skippedCount++;
          continue;
        }

        // Build file path
        let imagePath;
        if (product.image.startsWith('/uploads/')) {
          imagePath = path.join(__dirname, '..', product.image);
        } else if (product.image.startsWith('uploads/')) {
          imagePath = path.join(__dirname, '..', product.image);
        } else {
          imagePath = path.join(__dirname, '..', 'uploads', 'products', product.image);
        }

        // Check if file exists
        if (!fs.existsSync(imagePath)) {
          console.log(`⚠️  Warning: ${product.name} - File not found: ${imagePath}`);
          errorCount++;
          continue;
        }

        // Get file size
        const stats = fs.statSync(imagePath);
        const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

        // Warn if file is large (MongoDB doc limit is 16MB)
        if (stats.size > 10 * 1024 * 1024) {
          console.log(`⚠️  Warning: ${product.name} - Large file (${fileSizeMB}MB), might exceed MongoDB limit`);
        }

        // Convert to Base64
        console.log(`🔄 Converting: ${product.name} (${fileSizeMB}MB)`);
        const base64Image = fileToBase64(imagePath);

        // Update product in database
        product.image = base64Image;
        await product.save();

        console.log(`✅ Migrated: ${product.name}\n`);
        migratedCount++;

      } catch (error) {
        console.error(`❌ Error: ${product.name} - ${error.message}\n`);
        errorCount++;
      }
    }

    // Print summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 MIGRATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Migrated:  ${migratedCount} products`);
    console.log(`⏭️  Skipped:   ${skippedCount} products (already Base64 or external URL)`);
    console.log(`❌ Errors:    ${errorCount} products`);
    console.log(`📦 Total:     ${products.length} products`);
    console.log('='.repeat(50) + '\n');

    if (migratedCount > 0) {
      console.log('🎉 Migration completed successfully!');
      console.log('💡 Next steps:');
      console.log('   1. Test your application to verify images display correctly');
      console.log('   2. Backup your database before deleting old image files');
      console.log('   3. Once verified, you can delete the uploads/products/ directory');
      console.log('   4. Remove file upload middleware if no longer needed\n');
    }

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  }
};

/**
 * Cleanup: Delete old image files (USE WITH CAUTION!)
 */
const cleanupOldFiles = async () => {
  console.log('\n⚠️  WARNING: This will DELETE all files in uploads/products/');
  console.log('Make sure you have verified the migration first!');
  console.log('Press Ctrl+C to cancel, or wait 10 seconds to continue...\n');

  // Wait 10 seconds
  await new Promise(resolve => setTimeout(resolve, 10000));

  const uploadsDir = path.join(__dirname, '..', 'uploads', 'products');
  
  if (!fs.existsSync(uploadsDir)) {
    console.log('✅ No uploads directory found - already cleaned up!');
    return;
  }

  const files = fs.readdirSync(uploadsDir);
  console.log(`🗑️  Deleting ${files.length} files...\n`);

  for (const file of files) {
    try {
      fs.unlinkSync(path.join(uploadsDir, file));
      console.log(`✅ Deleted: ${file}`);
    } catch (error) {
      console.error(`❌ Failed to delete ${file}: ${error.message}`);
    }
  }

  console.log('\n🎉 Cleanup completed!');
};

/**
 * Verify migration - Check all products have Base64 images
 */
const verifyMigration = async () => {
  try {
    console.log('\n🔍 Verifying migration...\n');

    const products = await Product.find({});
    let validCount = 0;
    let invalidCount = 0;

    for (const product of products) {
      if (isBase64Image(product.image)) {
        validCount++;
      } else {
        console.log(`⚠️  Invalid: ${product.name} - Image: ${product.image.substring(0, 50)}...`);
        invalidCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ VERIFICATION RESULTS');
    console.log('='.repeat(50));
    console.log(`✅ Valid Base64:  ${validCount} products`);
    console.log(`⚠️  Invalid:      ${invalidCount} products`);
    console.log(`📦 Total:         ${products.length} products`);
    console.log('='.repeat(50) + '\n');

    if (invalidCount === 0) {
      console.log('🎉 All products have valid Base64 images!');
    } else {
      console.log('⚠️  Some products still have invalid images. Review the list above.');
    }

  } catch (error) {
    console.error('❌ Verification failed:', error.message);
  }
};

/**
 * Main execution
 */
const main = async () => {
  await connectDB();

  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'migrate':
      await migrateProducts();
      break;
    case 'verify':
      await verifyMigration();
      break;
    case 'cleanup':
      await cleanupOldFiles();
      break;
    default:
      console.log('\n📖 USAGE:');
      console.log('   node scripts/migrateImagesToBase64.js migrate   - Migrate images to Base64');
      console.log('   node scripts/migrateImagesToBase64.js verify    - Verify migration');
      console.log('   node scripts/migrateImagesToBase64.js cleanup   - Delete old image files (DANGEROUS!)');
      console.log('\n💡 TIP: Run "migrate" first, then "verify", then "cleanup"\n');
      await migrateProducts(); // Default to migrate
  }

  await mongoose.connection.close();
  console.log('\n👋 Disconnected from MongoDB\n');
  process.exit(0);
};

// Run migration
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
