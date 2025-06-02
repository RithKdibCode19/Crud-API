import React, { useEffect, useState } from 'react';
import { FaShoppingCart, FaUsers, FaBox, FaMoneyBillWave } from 'react-icons/fa';
import axiosClient from './axios-client';

function Dashboard() {
  const [summary, setSummary] = useState({
    totalSales: 0,
    orders: 0,
    products: 0,
    customers: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axiosClient.get('/dashboard-summary'),
      axiosClient.get('/orders', { params: { limit: 5 } }),
    ])
      .then(([summaryRes, ordersRes]) => {
        setSummary({
          totalSales: summaryRes.data.totalSales ?? 0,
          orders: summaryRes.data.orders ?? 0,
          products: summaryRes.data.products ?? 0,
          customers: summaryRes.data.customers ?? 0,
        });
        setRecentOrders(ordersRes.data.orders || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load dashboard data.');
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Sales</h6>
                  <h3 className="mb-0" id="totalsale">
                    ${summary.totalSales.toLocaleString()}
                  </h3>
                </div>
                <FaMoneyBillWave size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Orders</h6>
                  <h3 className="mb-0">{summary.orders}</h3>
                </div>
                <FaShoppingCart size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Products</h6>
                  <h3 className="mb-0">{summary.products}</h3>
                </div>
                <FaBox size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-warning text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Customers</h6>
                  <h3 className="mb-0">{summary.customers}</h3>
                </div>
                <FaUsers size={30} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Recent Transactions</h5>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-4">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Products</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center">
                        No recent transactions
                      </td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>#{order.id}</td>
                        <td>{order.customer?.name || '-'}</td>
                        <td>
                          {order.items
                            ? `${order.items.length} items`
                            : '-'}
                        </td>
                        <td>${Number(order.total_amount).toFixed(2)}</td>
                        <td>
                          <span
                            className={`badge bg-${
                              order.status === 'completed'
                                ? 'success'
                                : order.status === 'pending'
                                ? 'warning'
                                : 'danger'
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
