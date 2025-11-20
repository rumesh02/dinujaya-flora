/**
 * Complete Base64 Image Test Script
 * Tests all aspects of the Base64 image fix
 * Run: node testBase64Complete.js
 */

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

function header(text) {
  console.log('\n' + colors.bright + colors.cyan + '═'.repeat(70) + colors.reset);
  console.log(colors.bright + colors.cyan + text.padStart((70 + text.length) / 2).padEnd(70) + colors.reset);
  console.log(colors.bright + colors.cyan + '═'.repeat(70) + colors.reset + '\n');
}

async function test1_ServerConfiguration() {
  header('TEST 1: Server Configuration');
  
  try {
    log('Checking if server is running...', 'yellow');
    const response = await axios.get(API_URL.replace('/api', ''));
    
    if (response.status === 200) {
      log('✅ Server is running on ' + API_URL.replace('/api', ''), 'green');
      log('   Version: ' + (response.data.version || 'N/A'));
      return true;
    }
  } catch (error) {
    log('❌ Server is NOT running or unreachable', 'red');
    log('   Error: ' + error.message, 'red');
    log('\n💡 Solution: Start backend with: cd backend && npm start\n', 'yellow');
    return false;
  }
}

async function test2_BodySizeLimit() {
  header('TEST 2: Body Size Limit (50MB for Base64)');
  
  try {
    // Check if server.js has correct configuration
    const serverPath = path.join(__dirname, 'server.js');
    
    if (!fs.existsSync(serverPath)) {
      log('⚠️  Cannot find server.js in current directory', 'yellow');
      log('   Make sure you run this from backend folder', 'yellow');
      return false;
    }
    
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes("limit: '50mb'") || serverContent.includes('limit: "50mb"')) {
      log('✅ Body size limit is set to 50MB', 'green');
      log('   This allows large Base64 images', 'green');
      return true;
    } else if (serverContent.includes('express.json()')) {
      log('❌ Body size limit is NOT configured', 'red');
      log('   Found: express.json() without limit', 'red');
      log('\n💡 Solution: Add limit option:', 'yellow');
      log("   app.use(express.json({ limit: '50mb' }));", 'cyan');
      return false;
    } else {
      log('⚠️  Cannot determine body size configuration', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Error reading server.js: ' + error.message, 'red');
    return false;
  }
}

async function test3_CORSConfiguration() {
  header('TEST 3: CORS Configuration');
  
  try {
    const serverPath = path.join(__dirname, 'server.js');
    const serverContent = fs.readFileSync(serverPath, 'utf8');
    
    if (serverContent.includes('allowedOrigins') || serverContent.includes('cors({')) {
      log('✅ CORS is configured', 'green');
      
      if (serverContent.includes('allowedOrigins')) {
        log('   Multiple origins support: YES', 'green');
      } else {
        log('   Multiple origins support: Maybe', 'yellow');
      }
      
      return true;
    } else {
      log('❌ CORS configuration not found', 'red');
      log('\n💡 Solution: Add CORS middleware in server.js', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Error checking CORS: ' + error.message, 'red');
    return false;
  }
}

async function test4_ProductsEndpoint() {
  header('TEST 4: Products API Endpoint');
  
  try {
    log('Fetching products from API...', 'yellow');
    const response = await axios.get(`${API_URL}/products`);
    
    if (response.data && response.data.data) {
      const products = response.data.data;
      log(`✅ Products endpoint working`, 'green');
      log(`   Total products: ${products.length}`, 'green');
      
      if (products.length === 0) {
        log('\n⚠️  Database is empty - no products found', 'yellow');
        log('💡 Solution: Run seed script: node seedProducts.js\n', 'yellow');
        return false;
      }
      
      return products;
    } else {
      log('❌ Unexpected response format', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Failed to fetch products', 'red');
    log('   Error: ' + error.message, 'red');
    return false;
  }
}

async function test5_Base64Images(products) {
  header('TEST 5: Base64 Image Fields');
  
  if (!products || products.length === 0) {
    log('⚠️  Skipping - no products available', 'yellow');
    return false;
  }
  
  let hasImageBase64Field = false;
  let hasBase64Data = false;
  let totalBase64Size = 0;
  let productsWithBase64 = 0;
  
  for (const product of products) {
    if ('imageBase64' in product) {
      hasImageBase64Field = true;
      
      if (product.imageBase64 && product.imageBase64.length > 0) {
        hasBase64Data = true;
        totalBase64Size += product.imageBase64.length;
        productsWithBase64++;
        
        log(`✅ Product "${product.name}" has Base64 image`, 'green');
        log(`   Size: ${(product.imageBase64.length / 1024).toFixed(2)} KB`, 'cyan');
        
        // Check if it has proper format
        if (product.imageBase64.startsWith('data:image')) {
          log('   ⚠️  Has data URI prefix (should be removed before storing)', 'yellow');
        } else {
          log('   ✅ Pure Base64 format (correct)', 'green');
        }
      }
    }
  }
  
  console.log('');
  
  if (hasImageBase64Field) {
    log('✅ Product model has imageBase64 field', 'green');
  } else {
    log('❌ Product model missing imageBase64 field', 'red');
    log('\n💡 Solution: Add to Product.js schema:', 'yellow');
    log('   imageBase64: { type: String, default: null }', 'cyan');
    return false;
  }
  
  if (hasBase64Data) {
    log(`✅ Found ${productsWithBase64} products with Base64 images`, 'green');
    log(`   Total Base64 data: ${(totalBase64Size / 1024 / 1024).toFixed(2)} MB`, 'cyan');
  } else {
    log('⚠️  No products have Base64 image data', 'yellow');
    log('   Products may be using file uploads instead', 'yellow');
  }
  
  return hasBase64Data;
}

async function test6_BestsellersEndpoint() {
  header('TEST 6: Bestsellers Endpoint (Used by Homepage)');
  
  try {
    log('Fetching bestsellers...', 'yellow');
    const response = await axios.get(`${API_URL}/products/bestsellers/list`);
    
    if (response.data && response.data.products) {
      const bestsellers = response.data.products;
      log(`✅ Bestsellers endpoint working`, 'green');
      log(`   Count: ${bestsellers.length}`, 'green');
      
      if (bestsellers.length === 0) {
        log('\n⚠️  No bestsellers found', 'yellow');
        log('💡 Products need isBestseller: true flag', 'yellow');
        log('💡 Or run: node seedProducts.js to add sample data\n', 'yellow');
        return false;
      }
      
      // Check first bestseller for images
      const first = bestsellers[0];
      console.log('');
      log('First bestseller:', 'cyan');
      log('   Name: ' + first.name, 'cyan');
      log('   Has image field: ' + (first.image ? 'YES' : 'NO'), first.image ? 'green' : 'red');
      log('   Has imageBase64 field: ' + (first.imageBase64 ? 'YES' : 'NO'), first.imageBase64 ? 'green' : 'yellow');
      
      if (first.imageBase64) {
        log('   ImageBase64 length: ' + first.imageBase64.length + ' chars', 'green');
      }
      
      return true;
    }
  } catch (error) {
    log('❌ Failed to fetch bestsellers', 'red');
    log('   Error: ' + error.message, 'red');
    return false;
  }
}

async function test7_FrontendConfig() {
  header('TEST 7: Frontend Configuration');
  
  try {
    const frontendPath = path.join(__dirname, '..', 'frontend', '.env');
    const examplePath = path.join(__dirname, '..', 'frontend', '.env.example');
    
    if (fs.existsSync(frontendPath)) {
      const envContent = fs.readFileSync(frontendPath, 'utf8');
      
      if (envContent.includes('REACT_APP_API_URL') || envContent.includes('REACT_APP_API')) {
        log('✅ Frontend .env file exists', 'green');
        
        const match = envContent.match(/REACT_APP_API[_URL]*=(.*)/);
        if (match) {
          log('   API URL: ' + match[1].trim(), 'cyan');
        }
        
        return true;
      }
    } else if (fs.existsSync(examplePath)) {
      log('⚠️  Frontend .env file missing', 'yellow');
      log('   Found .env.example', 'yellow');
      log('\n💡 Solution: Copy example file:', 'yellow');
      log('   cp frontend/.env.example frontend/.env', 'cyan');
      return false;
    } else {
      log('❌ No frontend .env configuration found', 'red');
      return false;
    }
  } catch (error) {
    log('⚠️  Cannot check frontend config: ' + error.message, 'yellow');
    return false;
  }
}

async function test8_ImageHelper() {
  header('TEST 8: Image Helper Utility');
  
  try {
    const helperPath = path.join(__dirname, '..', 'frontend', 'src', 'utils', 'imageHelper.js');
    
    if (fs.existsSync(helperPath)) {
      const helperContent = fs.readFileSync(helperPath, 'utf8');
      
      const hasGetImageSource = helperContent.includes('getImageSource');
      const hasBase64Detection = helperContent.includes('base64') || helperContent.includes('Base64');
      const hasFallback = helperContent.includes('fallback');
      
      if (hasGetImageSource && hasBase64Detection) {
        log('✅ Image helper utility exists', 'green');
        log('   Has getImageSource: YES', 'green');
        log('   Has Base64 detection: YES', 'green');
        log('   Has fallback: ' + (hasFallback ? 'YES' : 'NO'), hasFallback ? 'green' : 'yellow');
        return true;
      } else {
        log('❌ Image helper is incomplete', 'red');
        return false;
      }
    } else {
      log('❌ Image helper utility not found', 'red');
      log('   Expected: frontend/src/utils/imageHelper.js', 'red');
      log('\n💡 Solution: Create imageHelper.js with getImageSource function', 'yellow');
      return false;
    }
  } catch (error) {
    log('❌ Error checking image helper: ' + error.message, 'red');
    return false;
  }
}

async function generateReport(results) {
  header('FINAL REPORT');
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  const percentage = ((passed / total) * 100).toFixed(0);
  
  log(`Tests Passed: ${passed}/${total} (${percentage}%)`, passed === total ? 'green' : 'yellow');
  console.log('');
  
  results.forEach(result => {
    const icon = result.passed ? '✅' : '❌';
    const color = result.passed ? 'green' : 'red';
    log(`${icon} ${result.name}`, color);
  });
  
  console.log('');
  
  if (passed === total) {
    log('🎉 ALL TESTS PASSED! Base64 images should work correctly!', 'green');
    log('', 'reset');
    log('Next steps:', 'cyan');
    log('1. Start frontend: cd frontend && npm start', 'cyan');
    log('2. Open http://localhost:3000', 'cyan');
    log('3. Check if images display on home page', 'cyan');
  } else {
    log('⚠️  SOME TESTS FAILED - Fix the issues above', 'yellow');
    log('', 'reset');
    log('Check the documentation:', 'cyan');
    log('- BASE64_IMAGE_FIX_COMPLETE_GUIDE.md', 'cyan');
    log('- BASE64_QUICK_REFERENCE.md', 'cyan');
  }
  
  console.log('');
}

async function runAllTests() {
  console.clear();
  log(colors.bright + colors.magenta + '\n🌸 DINUJAYA FLORA - BASE64 IMAGE TEST SUITE 🌸\n' + colors.reset, 'reset');
  
  const results = [];
  
  // Test 1
  const test1 = await test1_ServerConfiguration();
  results.push({ name: 'Server Running', passed: test1 });
  
  if (!test1) {
    log('\n⛔ Cannot continue - server must be running\n', 'red');
    await generateReport(results);
    process.exit(1);
  }
  
  // Test 2
  const test2 = await test2_BodySizeLimit();
  results.push({ name: 'Body Size Limit (50MB)', passed: test2 });
  
  // Test 3
  const test3 = await test3_CORSConfiguration();
  results.push({ name: 'CORS Configuration', passed: test3 });
  
  // Test 4
  const products = await test4_ProductsEndpoint();
  results.push({ name: 'Products API Endpoint', passed: !!products });
  
  // Test 5
  const test5 = await test5_Base64Images(products);
  results.push({ name: 'Base64 Image Support', passed: !!test5 });
  
  // Test 6
  const test6 = await test6_BestsellersEndpoint();
  results.push({ name: 'Bestsellers Endpoint', passed: test6 });
  
  // Test 7
  const test7 = await test7_FrontendConfig();
  results.push({ name: 'Frontend Configuration', passed: test7 });
  
  // Test 8
  const test8 = await test8_ImageHelper();
  results.push({ name: 'Image Helper Utility', passed: test8 });
  
  // Generate report
  await generateReport(results);
}

// Run all tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
