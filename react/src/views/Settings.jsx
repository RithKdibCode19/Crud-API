import React from 'react';
import { FaStore, FaUser, FaBell, FaLock } from 'react-icons/fa';

const Settings = () => {
  return (
    <div>
      <h2 className="mb-4">Settings</h2>

      <div className="row">
        {/* Store Settings */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaStore className="me-2" />
                Store Settings
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Store Name</label>
                  <input type="text" className="form-control" defaultValue="My Cafe" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea className="form-control" rows="3" defaultValue="123 Cafe Street, City, Country" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Phone</label>
                  <input type="tel" className="form-control" defaultValue="+1 234 567 890" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="contact@mycafe.com" />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
              </form>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaUser className="me-2" />
                User Profile
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input type="text" className="form-control" defaultValue="Admin User" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-control" defaultValue="admin@mycafe.com" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input type="text" className="form-control" defaultValue="Administrator" disabled />
                </div>
                <button type="submit" className="btn btn-primary">Update Profile</button>
              </form>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaBell className="me-2" />
                Notifications
              </h5>
            </div>
            <div className="card-body">
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="emailNotif" defaultChecked />
                <label className="form-check-label" htmlFor="emailNotif">
                  Email Notifications
                </label>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="lowStock" defaultChecked />
                <label className="form-check-label" htmlFor="lowStock">
                  Low Stock Alerts
                </label>
              </div>
              <div className="form-check mb-3">
                <input className="form-check-input" type="checkbox" id="dailyReport" />
                <label className="form-check-label" htmlFor="dailyReport">
                  Daily Sales Report
                </label>
              </div>
              <button type="submit" className="btn btn-primary">Save Preferences</button>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <FaLock className="me-2" />
                Security
              </h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-control" />
                </div>
                <button type="submit" className="btn btn-primary">Change Password</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings; 