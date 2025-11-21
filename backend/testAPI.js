const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

async function testAPI() {
  console.log('🧪 Testing API endpoints...\n');
  console.log(`API URL: ${API_URL}\n`);

  try {
    // Test 1: Get all products
    console.log('1️⃣  Testing GET /products');
    const productsRes = await axios.get(`${API_URL}/products`);
    console.log(`   ✅ Response: ${productsRes.status} ${productsRes.statusText}`);
    console.log(`   📦 Total Products: ${productsRes.data.count || productsRes.data.data?.length || 0}\n`);

    // Test 2: Get bestsellers
    console.log('2️⃣  Testing GET /products/bestsellers/list');
    const bestsellersRes = await axios.get(`${API_URL}/products/bestsellers/list`);
    console.log(`   ✅ Response: ${bestsellersRes.status} ${bestsellersRes.statusText}`);
    console.log(`   ⭐ Bestsellers Count: ${bestsellersRes.data.count}\n`);

    if (bestsellersRes.data.count === 0) {
      console.log('⚠️  WARNING: No bestsellers found!');
      console.log('💡 Solution: Run the seed script:');
      console.log('   cd backend');
      console.log('   node seedProducts.js\n');
    } else {
      console.log('📋 Bestseller Products:');
      bestsellersRes.data.products.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.name} - LKR ${p.price} (Stock: ${p.stock})`);
      });
      console.log('\n✨ Everything looks good! Cards should appear on home page.\n');
    }

    // Test 3: Get categories
    console.log('3️⃣  Testing GET /products/categories/list');
    try {
      const categoriesRes = await axios.get(`${API_URL}/products/categories/list`);
      console.log(`   ✅ Response: ${categoriesRes.status} ${categoriesRes.statusText}`);
      console.log(`   📂 Categories: ${categoriesRes.data.categories?.join(', ') || 'None'}\n`);
    } catch (err) {
      console.log(`   ⚠️  Categories endpoint not responding\n`);
    }

    // Test 4: Get collections
    console.log('4️⃣  Testing GET /products/collections/list');
    try {
      const collectionsRes = await axios.get(`${API_URL}/products/collections/list`);
      console.log(`   ✅ Response: ${collectionsRes.status} ${collectionsRes.statusText}`);
      console.log(`   🗂️  Collections: ${collectionsRes.data.collections?.join(', ') || 'None'}\n`);
    } catch (err) {
      console.log(`   ⚠️  Collections endpoint not responding\n`);
    }

    console.log('═══════════════════════════════════════');
    console.log('✅ API TESTS COMPLETED SUCCESSFULLY');
    console.log('═══════════════════════════════════════\n');

  } catch (error) {
    console.log('═══════════════════════════════════════');
    console.log('❌ API TEST FAILED');
    console.log('═══════════════════════════════════════\n');

    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Error: Cannot connect to backend server\n');
      console.log('💡 Solutions:');
      console.log('   1. Make sure backend is running:');
      console.log('      cd backend');
      console.log('      npm start');
      console.log('   2. Check if backend is on port 5000');
      console.log('   3. Verify MongoDB is running\n');
    } else if (error.response) {
      console.error(`❌ Error: ${error.response.status} ${error.response.statusText}`);
      console.error(`   Message: ${error.response.data?.message || error.message}\n`);
    } else {
      console.error(`❌ Error: ${error.message}\n`);
    }

    process.exit(1);
  }
}

// Run the test
console.log('═══════════════════════════════════════');
console.log('🌸 DINUJAYA FLORA - API TEST');
console.log('═══════════════════════════════════════\n');

testAPI();
