import React from 'react';
import { FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';

const Reports = () => {
  return (
    <div>
      <h2 className="mb-4">Reports & Analytics</h2>

      {/* Date Range Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-4">
              <label className="form-label">Start Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">End Date</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Report Type</label>
              <select className="form-select">
                <option value="daily">Daily Sales</option>
                <option value="weekly">Weekly Sales</option>
                <option value="monthly">Monthly Sales</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Revenue</h6>
                  <h3 className="mb-0">$12,345</h3>
                </div>
                <FaChartLine size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Total Orders</h6>
                  <h3 className="mb-0">234</h3>
                </div>
                <FaChartBar size={30} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-info text-white">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="card-title">Average Order Value</h6>
                  <h3 className="mb-0">$52.76</h3>
                </div>
                <FaChartPie size={30} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Table */}
      <div className="card">
        <div className="card-header">
          <h5 className="mb-0">Sales Details</h5>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>2024-02-20</td>
                  <td>#12345</td>
                  <td>John Doe</td>
                  <td>3 items</td>
                  <td>$45.00</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
                <tr>
                  <td>2024-02-20</td>
                  <td>#12344</td>
                  <td>Jane Smith</td>
                  <td>2 items</td>
                  <td>$32.50</td>
                  <td><span className="badge bg-success">Completed</span></td>
                </tr>
                <tr>
                  <td>2024-02-19</td>
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

export default Reports; 