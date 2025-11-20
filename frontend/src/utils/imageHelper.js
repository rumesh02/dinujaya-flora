/**
 * Unified Image Helper Utility
 * Handles ALL image types: Cloudinary URLs, Base64 strings, Local uploads
 * Works consistently across all machines
 */

/**
 * Convert an image to proper display format
 * @param {string|null} image - Image from database (URL, Base64, or path)
 * @param {string} fallbackImage - Fallback image if main image fails
 * @returns {string} - Properly formatted image source
 */
export const getImageSource = (image, fallbackImage = '/images/default-flower.jpg') => {
  // Handle null/undefined
  if (!image) {
    return fallbackImage;
  }

  // Convert to string if needed
  const imageStr = String(image).trim();

  // Handle empty strings
  if (!imageStr) {
    return fallbackImage;
  }

  // 1. Check if it's already a complete data URI (Base64 with prefix)
  if (imageStr.startsWith('data:image')) {
    return imageStr;
  }

  // 2. Check if it's a Cloudinary URL
  if (imageStr.startsWith('https://res.cloudinary.com/') || 
      imageStr.startsWith('http://res.cloudinary.com/')) {
    return imageStr;
  }

  // 3. Check if it's an external URL (http:// or https://)
  if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) {
    return imageStr;
  }

  // 4. Check if it's a Base64 string (long string without protocol)
  // Base64 strings are typically very long (>100 characters) and contain only alphanumeric + / =
  const base64Pattern = /^[A-Za-z0-9+/=]+$/;
  if (imageStr.length > 100 && base64Pattern.test(imageStr)) {
    // It's a Base64 string without prefix - add the prefix
    // Default to JPEG, but you can make this smarter if needed
    return `data:image/jpeg;base64,${imageStr}`;
  }

  // 5. Check if it looks like a partial Base64 (might be truncated)
  if (imageStr.length > 50 && base64Pattern.test(imageStr.substring(0, 50))) {
    return `data:image/jpeg;base64,${imageStr}`;
  }

  // 6. It's a local file path (e.g., "1234567890-flower.jpg")
  // Construct full URL to backend
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
  const baseUrl = API_BASE_URL.replace('/api', ''); // Remove /api if present
  
  if (imageStr.startsWith('/uploads/')) {
    return `${baseUrl}${imageStr}`;
  }
  
  return `${baseUrl}/uploads/products/${imageStr}`;
};

/**
 * Detect image type for debugging
 * @param {string} image - Image string to analyze
 * @returns {string} - Type of image
 */
export const detectImageType = (image) => {
  if (!image) return 'null/undefined';
  
  const imageStr = String(image).trim();
  
  if (imageStr.startsWith('data:image')) return 'Base64 with prefix';
  if (imageStr.startsWith('https://res.cloudinary.com/')) return 'Cloudinary URL';
  if (imageStr.startsWith('http://') || imageStr.startsWith('https://')) return 'External URL';
  if (imageStr.length > 100 && /^[A-Za-z0-9+/=]+$/.test(imageStr)) return 'Base64 without prefix';
  return 'Local file path';
};

/**
 * Validate if Base64 string is properly formatted
 * @param {string} base64String - Base64 string to validate
 * @returns {boolean} - True if valid
 */
export const isValidBase64 = (base64String) => {
  if (!base64String || typeof base64String !== 'string') return false;
  
  // Remove data URI prefix if present
  const base64Data = base64String.replace(/^data:image\/[a-z]+;base64,/, '');
  
  // Check if it's valid Base64 pattern
  const base64Pattern = /^[A-Za-z0-9+/]+={0,2}$/;
  return base64Pattern.test(base64Data) && base64Data.length > 100;
};

/**
 * Extract Base64 string from data URI
 * @param {string} dataUri - Full data URI
 * @returns {string} - Pure Base64 string
 */
export const extractBase64 = (dataUri) => {
  if (!dataUri) return '';
  return dataUri.replace(/^data:image\/[a-z]+;base64,/, '');
};

/**
 * Convert File to Base64 string
 * @param {File} file - File object from input
 * @returns {Promise<string>} - Base64 string (without prefix)
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      // Extract pure Base64 (remove data:image prefix)
      const base64String = reader.result.split(',')[1];
      resolve(base64String);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Get MIME type from Base64 data URI
 * @param {string} dataUri - Data URI string
 * @returns {string} - MIME type (e.g., 'image/jpeg')
 */
export const getMimeType = (dataUri) => {
  if (!dataUri || !dataUri.startsWith('data:')) return 'image/jpeg';
  
  const match = dataUri.match(/^data:([^;]+);/);
  return match ? match[1] : 'image/jpeg';
};

const imageHelper = {
  getImageSource,
  detectImageType,
  isValidBase64,
  extractBase64,
  fileToBase64,
  getMimeType
};

export default imageHelper;
