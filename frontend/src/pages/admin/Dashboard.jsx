import React, { useState, useEffect } from 'react';
import { dashboardService } from '../../services';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getStats();
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats?.overview?.totalUsers || 0,
      icon: '👥',
      color: 'bg-blue-500',
      textColor: 'text-blue-600'
    },
    {
      title: 'Total Suppliers',
      value: stats?.overview?.totalSuppliers || 0,
      icon: '🏭',
      color: 'bg-green-500',
      textColor: 'text-green-600'
    },
    {
      title: 'Total Products',
      value: stats?.overview?.totalProducts || 0,
      icon: '🌸',
      color: 'bg-purple-500',
      textColor: 'text-purple-600'
    },
    {
      title: 'Total Orders',
      value: stats?.overview?.totalOrders || 0,
      icon: '📦',
      color: 'bg-orange-500',
      textColor: 'text-orange-600'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className={`text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Card */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
        <h3 className="text-lg font-semibold mb-2">Total Revenue</h3>
        <p className="text-4xl font-bold">
          ${stats?.overview?.totalRevenue?.toFixed(2) || '0.00'}
        </p>
        <p className="text-sm mt-2 opacity-90">From all completed orders</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
          {stats?.recentOrders?.length > 0 ? (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div key={order._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.user?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">${order.totalAmount.toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          )}
        </div>

        {/* Low Stock Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Low Stock Alert</h3>
          {stats?.lowStockProducts?.length > 0 ? (
            <div className="space-y-3">
              {stats.lowStockProducts.map((product) => (
                <div key={product._id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                      {product.stock} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">All products well stocked</p>
          )}
        </div>
      </div>

      {/* Order Status Summary */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{stats?.orders?.pending || 0}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{stats?.orders?.delivered || 0}</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{stats?.orders?.cancelled || 0}</p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
