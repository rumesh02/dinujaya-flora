import React, { useState } from 'react';
import axios from 'axios';
import { Upload, X, CheckCircle, AlertCircle, Loader } from 'lucide-react';

const AdminAddFlower = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    collection: ''
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
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
  ];

  const collections = [
    'Bouquets',
    'Indoor Plants',
    'Wedding Décor',
    'Gift Bundles',
    'Other'
  ];

  // Handle input changes
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle file selection with Base64 conversion
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) {
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Invalid file type. Only JPG, JPEG, PNG, and WEBP images are allowed.');
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setError('File size too large. Maximum size is 2MB.');
      return;
    }

    setImageFile(file);
    setError('');

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Remove selected image
  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.name || !formData.price || !formData.description || !formData.category || !formData.collection) {
      setError('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      setError('Please select an image');
      return;
    }

    try {
      setLoading(true);

      // Read file as Base64 using FileReader
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          // Extract Base64 string (remove data:image/...;base64, prefix)
          const base64String = reader.result.split(',')[1];

          // Create FormData
          const submitData = new FormData();
          submitData.append('name', formData.name);
          submitData.append('price', parseFloat(formData.price));
          submitData.append('description', formData.description);
          submitData.append('category', formData.category);
          submitData.append('collection', formData.collection);
          submitData.append('image', imageFile);

          // Get auth token
          const token = localStorage.getItem('token');

          // Send to backend
          const response = await axios.post(
            'http://localhost:5000/api/admin/flowers',
            submitData,
            {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'multipart/form-data'
              }
            }
          );

          setSuccess('Flower added successfully!');
          
          // Reset form
          setFormData({
            name: '',
            price: '',
            description: '',
            category: '',
            collection: ''
          });
          setImageFile(null);
          setImagePreview(null);

          // Call onSuccess callback
          if (onSuccess) {
            setTimeout(() => {
              onSuccess(response.data.data);
            }, 1500);
          }

        } catch (err) {
          console.error('Error submitting flower:', err);
          setError(err.response?.data?.error || 'Failed to add flower');
        } finally {
          setLoading(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file');
        setLoading(false);
      };

      reader.readAsDataURL(imageFile);

    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Add New Flower</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Flower Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., Red Rose Bouquet"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Price (LKR) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            step="0.01"
            min="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="e.g., 1500.00"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Describe the flower..."
            required
          />
        </div>

        {/* Category and Collection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Collection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Collection <span className="text-red-500">*</span>
            </label>
            <select
              name="collection"
              value={formData.collection}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            >
              <option value="">Select Collection</option>
              {collections.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Image <span className="text-red-500">*</span>
          </label>
          
          {!imagePreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-pink-500 transition-colors">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
                id="imageUpload"
              />
              <label htmlFor="imageUpload" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600 mb-1">Click to upload image</p>
                <p className="text-xs text-gray-500">JPG, JPEG, PNG, WEBP (Max 2MB)</p>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-3 pt-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Adding Flower...
              </>
            ) : (
              'Add Flower'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminAddFlower;
