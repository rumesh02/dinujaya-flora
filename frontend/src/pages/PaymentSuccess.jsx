import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Home, Package } from 'lucide-react';

const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 md:p-12 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your order. Your flowers will be delivered soon!
          </p>

          {/* Order Details */}
          <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 mb-8">
            <p className="text-gray-700 mb-2">
              We've sent a confirmation email with your order details.
            </p>
            <p className="text-gray-700">
              You can track your order status from your profile.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              Back to Home
            </button>
            <button
              onClick={() => navigate('/profile')}
              className="flex items-center justify-center gap-2 bg-white text-pink-600 border-2 border-pink-500 px-8 py-3 rounded-lg font-semibold hover:bg-pink-50 transition-all"
            >
              <Package className="w-5 h-5" />
              View Orders
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact us at{' '}
              <a href="mailto:support@dinujayaflora.com" className="text-pink-600 hover:underline">
                support@dinujayaflora.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
