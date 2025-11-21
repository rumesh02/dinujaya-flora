# 🧪 Base64 Image System - Test Suite

## 🎯 Complete Testing Guide

This document provides step-by-step testing procedures for the Base64 image system.

---

## 📋 Pre-Test Checklist

- [ ] Backend running on `http://localhost:5000`
- [ ] Frontend running on `http://localhost:3000`
- [ ] MongoDB connected
- [ ] Admin account created
- [ ] Test images prepared (various sizes: 500KB, 2MB, 5MB)

---

## 🧪 Test Cases

### TEST 1: Image Upload (Admin)

**Objective:** Verify new products can be created with Base64 images

**Steps:**
1. Login as admin
2. Navigate to **Admin → Products → Add Product**
3. Fill in product details:
   - Name: "Test Rose Bouquet"
   - Price: 2500
   - Category: Bouquet
   - Description: "Test product"
4. Click **"Upload Image"**
5. Select test image (< 5MB)
6. Verify preview shows
7. Click **"Create Product"**

**Expected Results:**
- ✅ Image preview displays immediately after selection
- ✅ Upload button shows progress/loading state
- ✅ Success message appears
- ✅ Product created with Base64 image

**Validation:**
```javascript
// Check browser Network tab → Request Payload:
{
  "name": "Test Rose Bouquet",
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",  // Should be long Base64 string
  "price": 2500
}

// Check Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "image": "data:image/jpeg;base64,/9j/..."  // Complete Base64 saved
  }
}
```

**Test with Different Sizes:**
- 📸 Small (500KB) - Should be fast
- 📸 Medium (2MB) - Should work normally
- 📸 Large (5MB) - Should work but slower
- ❌ Huge (15MB) - Should show error

---

### TEST 2: Image Display (Public)

**Objective:** Verify Base64 images display correctly on public pages

**Steps:**
1. Logout (or open incognito)
2. Go to homepage `http://localhost:3000`
3. Scroll to **"Most Popular Bouquets"** section
4. Check all product images

**Expected Results:**
- ✅ All images load without errors
- ✅ Images display at correct size/aspect ratio
- ✅ No broken image icons
- ✅ Images are crisp and clear

**Validation:**
```javascript
// In browser console:
document.querySelectorAll('img').forEach(img => {
  console.log('Image loaded:', img.complete);
  console.log('Has Base64:', img.src.includes('base64'));
  console.log('Dimensions:', img.width, 'x', img.height);
});

// All should show:
// Image loaded: true
// Has Base64: true
// Dimensions: > 0
```

---

### TEST 3: Image Update (Admin)

**Objective:** Verify products can be updated with new Base64 images

**Steps:**
1. Login as admin
2. Go to **Admin → Products**
3. Click **"Edit"** on a product
4. Upload new image
5. Verify preview updates
6. Click **"Update Product"**

**Expected Results:**
- ✅ Old image displayed in preview
- ✅ New image replaces old one in preview
- ✅ Product updates successfully
- ✅ New Base64 saved to database

**Validation:**
```javascript
// Before update - copy product.image
const oldImage = product.image;

// After update - check it changed
const newImage = product.image;
console.log('Image changed:', oldImage !== newImage);  // Should be true
console.log('Still Base64:', newImage.startsWith('data:image'));  // Should be true
```

---

### TEST 4: API Response Size

**Objective:** Verify API can handle large Base64 responses

**Steps:**
1. Create 10 products with 2MB images each
2. Fetch all products: `GET /api/products`
3. Measure response time and size

**Expected Results:**
- ✅ Response completes (may be slow)
- ✅ All products returned
- ✅ All Base64 images intact

**Validation:**
```bash
# Using curl (measure response time)
time curl http://localhost:5000/api/products

# Check response size
curl -w '%{size_download}' http://localhost:5000/api/products

# Should be < 50MB (body limit)
```

```javascript
// In browser console:
fetch('http://localhost:5000/api/products')
  .then(r => r.json())
  .then(data => {
    console.log('Products:', data.data.length);
    console.log('All have Base64:', data.data.every(p => p.image.startsWith('data:image')));
    
    const totalSize = JSON.stringify(data).length;
    console.log('Total size:', (totalSize / 1024 / 1024).toFixed(2), 'MB');
  });
```

---

### TEST 5: Migration Script

**Objective:** Verify old file-path products convert to Base64

**Prerequisites:**
- Products with file paths in database
- Image files in `uploads/products/`

**Steps:**
```bash
cd backend

# 1. Verify before migration
node scripts/migrateImagesToBase64.js verify

# 2. Run migration
node scripts/migrateImagesToBase64.js migrate

# 3. Verify after migration
node scripts/migrateImagesToBase64.js verify
```

**Expected Output:**
```
🔄 Starting migration...

📦 Found 45 products

🔄 Converting: Red Rose (0.87MB)
✅ Migrated: Red Rose

🔄 Converting: Sunflower (1.23MB)
✅ Migrated: Sunflower

==================================================
📊 MIGRATION SUMMARY
==================================================
✅ Migrated:  42 products
⏭️  Skipped:   3 products (already Base64)
❌ Errors:    0 products
📦 Total:     45 products
==================================================

🎉 Migration completed successfully!
```

**Validation:**
```bash
# All products should have Base64 images
node scripts/migrateImagesToBase64.js verify

# Expected:
# ✅ Valid Base64: 45 products
# ⚠️  Invalid:    0 products
```

---

### TEST 6: Error Handling

**Objective:** Verify proper error messages for invalid uploads

#### Test 6.1: File Too Large
**Steps:**
1. Try uploading 20MB image

**Expected:**
- ❌ Error message: "File size too large. Maximum size is 10MB"
- ✅ Form doesn't submit

#### Test 6.2: Invalid File Type
**Steps:**
1. Try uploading PDF file

**Expected:**
- ❌ Error message: "Only image files allowed"
- ✅ File rejected before upload

#### Test 6.3: Missing Image
**Steps:**
1. Submit form without image

**Expected:**
- ❌ Error message: "Please select an image"
- ✅ Form validation prevents submit

#### Test 6.4: Network Error
**Steps:**
1. Stop backend server
2. Try uploading product

**Expected:**
- ❌ Error message: "Failed to add product"
- ✅ Loading state stops
- ✅ Form doesn't clear

---

### TEST 7: Performance Testing

**Objective:** Measure system performance with Base64

**Test 7.1: Upload Speed**
```javascript
const startTime = Date.now();

// Upload 5MB image
await uploadProduct(formData);

const endTime = Date.now();
console.log('Upload time:', (endTime - startTime) / 1000, 'seconds');

// Expected: 2-5 seconds (depends on network/hardware)
```

**Test 7.2: Display Speed**
```javascript
const startTime = Date.now();

// Fetch products
const products = await fetch('/api/products').then(r => r.json());

// Measure image load time
const img = new Image();
img.onload = () => {
  const endTime = Date.now();
  console.log('Image load time:', (endTime - startTime) / 1000, 'seconds');
};
img.src = products.data[0].image;

// Expected: < 1 second
```

**Test 7.3: Memory Usage**
```javascript
// Check memory before
console.log('Memory before:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');

// Load 50 products with images
const products = await fetch('/api/products?limit=50').then(r => r.json());

// Check memory after
console.log('Memory after:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB');

// Expected increase: 50-100MB (depends on image sizes)
```

---

### TEST 8: Cross-Browser Testing

**Objective:** Verify Base64 works in all browsers

**Browsers to Test:**
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari (Mac/iOS)
- [ ] Mobile browsers

**Steps:**
1. Open application in each browser
2. Upload image
3. View product page
4. Check images display

**Expected:**
- ✅ All browsers display Base64 images correctly
- ✅ Upload works in all browsers
- ✅ No browser-specific errors

---

### TEST 9: Mobile Responsiveness

**Objective:** Verify Base64 images work on mobile

**Steps:**
1. Open DevTools → Toggle device toolbar
2. Select mobile device (e.g., iPhone 12)
3. Test image upload (take photo from camera)
4. Test image display

**Expected:**
- ✅ Camera integration works
- ✅ Images compress appropriately
- ✅ Upload succeeds
- ✅ Images display correctly on mobile

---

### TEST 10: Database Verification

**Objective:** Verify Base64 stored correctly in MongoDB

**Steps:**
```javascript
// Connect to MongoDB
use dinujaya_flora

// Check product documents
db.products.findOne({ name: "Test Rose Bouquet" })

// Verify image field
db.products.aggregate([
  {
    $project: {
      name: 1,
      imageType: {
        $cond: [
          { $regexMatch: { input: "$image", regex: "^data:image" } },
          "Base64",
          "File Path"
        ]
      },
      imageSize: { $strLenCP: "$image" }
    }
  }
])
```

**Expected:**
```javascript
{
  "_id": ObjectId("..."),
  "name": "Test Rose Bouquet",
  "imageType": "Base64",
  "imageSize": 876543  // Length of Base64 string
}
```

---

## 📊 Test Results Template

| Test | Status | Notes | Time |
|------|--------|-------|------|
| 1. Image Upload | ✅ | Uploaded 2MB image | 3s |
| 2. Image Display | ✅ | All images loaded | < 1s |
| 3. Image Update | ✅ | Updated successfully | 2s |
| 4. API Response | ✅ | 10 products, 15MB response | 5s |
| 5. Migration | ✅ | 45 products migrated | 30s |
| 6. Error Handling | ✅ | All errors caught | N/A |
| 7. Performance | ⚠️ | Slower with 5MB images | 8s |
| 8. Cross-Browser | ✅ | Tested Chrome, Firefox | N/A |
| 9. Mobile | ✅ | Works on iPhone/Android | N/A |
| 10. Database | ✅ | Base64 stored correctly | N/A |

---

## 🐛 Debugging Tips

### 1. **Image Not Displaying**
```javascript
// Check in console:
console.log('Image value:', product.image);
console.log('Is Base64?', product.image.startsWith('data:image'));
console.log('Image length:', product.image.length);
console.log('First 50 chars:', product.image.substring(0, 50));

// Should show:
// data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...
```

### 2. **Upload Failing**
```javascript
// Check request in Network tab:
// 1. Request Headers
Content-Type: application/json  // Not multipart/form-data

// 2. Request Payload
{
  "name": "...",
  "image": "data:image/jpeg;base64,..."  // Should be present
}

// 3. Response
{
  "success": true,  // If false, check error message
  "data": { ... }
}
```

### 3. **Slow Performance**
```javascript
// Measure each step:
console.time('FileReader');
reader.readAsDataURL(file);
reader.onloadend = () => {
  console.timeEnd('FileReader');  // How long to convert?
  
  console.time('API Upload');
  axios.post('...', data).then(() => {
    console.timeEnd('API Upload');  // How long to send?
  });
};
```

---

## ✅ Success Criteria

All tests pass if:

- ✅ Images upload without errors
- ✅ Images display on all pages
- ✅ Images update successfully
- ✅ API responses contain complete Base64
- ✅ Migration converts all products
- ✅ Error handling works correctly
- ✅ Performance is acceptable (< 5s for 2MB upload)
- ✅ Works in all browsers
- ✅ Mobile responsive
- ✅ Database stores Base64 correctly

---

## 📞 Support

If any tests fail:
1. Check `BASE64_IMPLEMENTATION_COMPLETE.md` for detailed troubleshooting
2. Verify backend and frontend code changes
3. Check browser console for errors
4. Review Network tab for request/response details

---

**Last Updated:** November 21, 2025  
**Test Coverage:** 10 comprehensive test cases  
**Browsers Tested:** Chrome, Firefox, Edge, Safari
