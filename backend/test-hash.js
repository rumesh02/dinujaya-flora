const md5 = require('md5');

// Your PayHere credentials
const merchantId = '1230340';
const merchantSecret = 'MTY0MDExMjQzMzM5NTM2MzA4NjAxMDE1OTAyNjcxMzIzMjAwNTA0NA==';

console.log('=== PayHere Hash Generation Test ===\n');
console.log('Merchant ID:', merchantId);
console.log('Merchant Secret:', merchantSecret);
console.log('\n');

// Test payment details
const orderId = 'TEST12345';
const amount = '1000.00';
const currency = 'LKR';

console.log('Test Payment Details:');
console.log('Order ID:', orderId);
console.log('Amount:', amount);
console.log('Currency:', currency);
console.log('\n');

// Generate hash according to PayHere official documentation
// hash = UPPERCASE(MD5(merchant_id + order_id + amount + currency + UPPERCASE(MD5(merchant_secret))))
const hashedSecret = md5(merchantSecret).toUpperCase();
const hash = md5(merchantId + orderId + amount + currency + hashedSecret).toUpperCase();

console.log('Hash Generation (Official PayHere Method):');
console.log('Step 1 - MD5(merchant_secret).toUpperCase():', hashedSecret);
console.log('Step 2 - Concatenate:', merchantId + orderId + amount + currency + hashedSecret);
console.log('Step 3 - Final Hash:', hash);
console.log('\n');

console.log('=== Use this hash for testing ===');
console.log('Hash:', hash);
console.log('\nIf you still get "Unauthorized payment request":');
console.log('1. Verify your domain is approved in PayHere dashboard');
console.log('2. Check if Merchant ID 1230340 is correct');
console.log('3. Make sure you copied the Merchant Secret correctly');
console.log('4. Ensure sandbox mode is enabled in your PayHere account');
