import React, { useEffect, useState } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaFileExcel, FaFileCsv, FaFileCode } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import axiosClient from '../axios-client';

const Reports = () => {
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({ revenue: 0, totalOrders: 0, avgOrder: 0 });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportType, setReportType] = useState('daily');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line
  }, [startDate, endDate, reportType]);

  const fetchOrders = () => {
    setLoading(true);
    axiosClient
      .get('/orders', {
        params: {
          start_date: startDate,
          end_date: endDate,
          report_type: reportType,
        },
      })
      .then(({ data }) => {
        setOrders(data.orders || []);
        // Calculate summary
        const totalOrders = data.orders.length;
        const revenue = data.orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
        const avgOrder = totalOrders ? revenue / totalOrders : 0;
        setSummary({
          revenue,
          totalOrders,
          avgOrder,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // Export Functions
  
    const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        Date: order.created_at?.slice(0, 10),
        'Order ID': order.id,
        Customer: order.customer?.name || '',
        Items: `${order.items?.length || 0} items`,
        Amount: Number(order.total_amount).toFixed(2),
        Status: order.status,
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sales');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'sales_report.xlsx');
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Order ID', 'Customer', 'Items', 'Amount', 'Status'];
    const rows = orders.map((order) => [
      order.created_at?.slice(0, 10),
      order.id,
      order.customer?.name || '',
      `${order.items?.length || 0} items`,
      Number(order.total_amount).toFixed(2),
      order.status,
    ]);
    let csvContent = headers.join(',') + '\n' + rows.map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'sales_report.csv');
  };

  const handleExportXML = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?><orders>';
    orders.forEach((order) => {
      xml += `<order>
        <date>${order.created_at?.slice(0, 10)}</date>
        <id>${order.id}</id>
        <customer>${order.customer?.name || ''}</customer>
        <items>${order.items?.length || 0}</items>
        <amount>${Number(order.total_amount).toFixed(2)}</amount>
        <status>${order.status}</status>
      </order>`;
    });
    xml += '</orders>';
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'sales_report.xml');
  };

  return (
    <div>
      <h2 className="mb-4">Reports & Analytics</h2>

      {/* Date Range Filter */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-md-3">
              <label className="form-label">Start Date</label>
              <input
                type="date"
                className="form-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">End Date</label>
              <input
                type="date"
                className="form-control"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Report Type</label>
              <select
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="daily">Daily Sales</option>
                <option value="weekly">Weekly Sales</option>
                <option value="monthly">Monthly Sales</option>
              </select>
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <button className="btn btn-outline-success me-2" onClick={handleExportExcel}>
                <FaFileExcel /> Excel
              </button>
              <button className="btn btn-outline-primary me-2" onClick={handleExportCSV}>
                <FaFileCsv /> CSV
              </button>
              <button className="btn btn-outline-info" onClick={handleExportXML}>
                <FaFileCode /> XML
              </button>
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
                  <h3 className="mb-0">${summary.revenue.toLocaleString()}</h3>
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
                  <h3 className="mb-0">{summary.totalOrders}</h3>
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
                  <h3 className="mb-0">${summary.avgOrder.toFixed(2)}</h3>
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
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center">Loading...</td>
                  </tr>
                ) : orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.created_at?.slice(0, 10)}</td>
                      <td>#{order.id}</td>
                      <td>{order.customer?.name || ''}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>${Number(order.total_amount).toFixed(2)}</td>
                      <td>
                        <span className={`badge bg-${order.status === 'completed' ? 'success' : order.status === 'pending' ? 'warning' : 'danger'}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center">No data found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;