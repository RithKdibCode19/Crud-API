import React from 'react';
import { FaShoppingCart, FaUsers, FaBox, FaMoneyBillWave } from 'react-icons/fa';

const Dashboard = () => {
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
                  <h3 className="mb-0" id='totalsale'>$1,234</h3>
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
                  <h3 className="mb-0">45</h3>
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
                  <h3 className="mb-0">120</h3>
                </div>
                <FaBox size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Category</h6>
                  <h3 className="mb-0">120</h3>
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
                  <h3 className="mb-0">89</h3>
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
                <tr>
                  <td>#12345</td>
                  <td>John Doe</td>
                  <td>3 items</td>
                  <td>$45.00</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
                <tr>
                  <td>#12344</td>
                  <td>Jane Smith</td>
                  <td>2 items</td>
                  <td>$32.50</td>
                  <td><span className="badge bg-warning">Pending</span></td>
                </tr>
                <tr>
                  <td>#12343</td>
                  <td>Mike Johnson</td>
                  <td>5 items</td>
                  <td>$78.25</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 