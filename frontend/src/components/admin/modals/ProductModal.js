import React, { useState, useEffect } from 'react';
import { productService } from '../../../services';

const ProductModal = ({ product, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Bouquet',
    price: '',
    description: '',
    stock: '',
    supplier: '',
    colors: [],
    occasion: [],
    isAvailable: true,
    isBestseller: false,
    collection: 'Other',
    productType: 'flowers'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || 'Bouquet',
        price: product.price || '',
        description: product.description || '',
        stock: product.stock || '',
        supplier: product.supplier?._id || '',
        colors: product.colors || [],
        occasion: product.occasion || [],
        isAvailable: product.isAvailable !== undefined ? product.isAvailable : true,
        isBestseller: product.isBestseller || false,
        collection: product.collection || 'Other',
        productType: product.productType || 'flowers'
      });
      if (product.image) {
        setImagePreview(`http://localhost:5000/uploads/${product.image}`);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (e, field) => {
    const value = e.target.value;
    const currentArray = formData[field];
    
    if (e.target.checked) {
      setFormData({
        ...formData,
        [field]: [...currentArray, value]
      });
    } else {
      setFormData({
        ...formData,
        [field]: currentArray.filter(item => item !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('category', formData.category);
      submitData.append('price', formData.price);
      submitData.append('description', formData.description);
      submitData.append('stock', formData.stock);
      submitData.append('isAvailable', formData.isAvailable);
      submitData.append('isBestseller', formData.isBestseller);
      submitData.append('collection', formData.collection);
      submitData.append('productType', formData.productType);
      if (formData.supplier) submitData.append('supplier', formData.supplier);
      submitData.append('colors', JSON.stringify(formData.colors));
      submitData.append('occasion', JSON.stringify(formData.occasion));
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      if (product) {
        await productService.update(product._id, submitData);
      } else {
        await productService.create(submitData);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const colorOptions = ['Red', 'Pink', 'White', 'Yellow', 'Orange', 'Purple', 'Blue', 'Mixed'];
  const occasionOptions = ['Wedding', 'Birthday', 'Anniversary', 'Sympathy', 'Love', 'Congratulations', 'Get Well', 'Thank You', 'Other'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg max-w-3xl w-full my-8">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button
              onClick={() => onClose(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Collection <span className="text-red-500">*</span>
                </label>
                <select
                  name="collection"
                  required
                  value={formData.collection}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="Bouquets">Bouquets</option>
                  <option value="Indoor Plants">Indoor Plants</option>
                  <option value="Wedding Décor">Wedding Décor</option>
                  <option value="Gift Bundles">Gift Bundles</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Type <span className="text-red-500">*</span>
              </label>
              <select
                name="productType"
                required
                value={formData.productType}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="flowers">Individual Flowers (For Custom Box)</option>
                <option value="bouquet">Pre-made Bouquet</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price ($) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="stock"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                placeholder="Product description"
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              {imagePreview && (
                <div className="mt-2">
                  <img src={imagePreview} alt="Preview" className="h-32 w-32 object-cover rounded-lg" />
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Colors</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {colorOptions.map(color => (
                  <label key={color} className="flex items-center">
                    <input
                      type="checkbox"
                      value={color}
                      checked={formData.colors.includes(color)}
                      onChange={(e) => handleArrayChange(e, 'colors')}
                      className="mr-2"
                    />
                    <span className="text-sm">{color}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Occasions</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {occasionOptions.map(occ => (
                  <label key={occ} className="flex items-center">
                    <input
                      type="checkbox"
                      value={occ}
                      checked={formData.occasion.includes(occ)}
                      onChange={(e) => handleArrayChange(e, 'occasion')}
                      className="mr-2"
                    />
                    <span className="text-sm">{occ}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={formData.isAvailable}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Available for purchase</span>
                </label>
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isBestseller"
                    checked={formData.isBestseller}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Mark as Bestseller</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={() => onClose(false)}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : product ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
