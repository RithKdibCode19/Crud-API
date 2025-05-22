import {Outlet, Link, Navigate} from 'react-router-dom';
import { FaHome, FaShoppingCart, FaBox, FaUsers, FaChartBar, FaCog } from 'react-icons/fa';
import {useStateContext} from "../contexts/ContextProvider.jsx";

const Master = () => {
  const {user,token} = useStateContext();

  if(!token){
    return <Navigate to="/login" />
  }


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3 border-bottom border-secondary">
          <h4 className="mb-0">Cafe POS</h4>
        </div>
        <nav className="nav flex-column p-3">
          <Link to="/" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaHome className="me-2" /> Dashboard
          </Link>
          <Link to="/pos" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaShoppingCart className="me-2" /> POS
          </Link>
          <Link to="/products" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaBox className="me-2" /> Products
          </Link>
          <Link to="/customers" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaUsers className="me-2" /> Customers
          </Link>
          <Link to="/reports" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaChartBar className="me-2" /> Reports
          </Link>
          <Link to="/user" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaChartBar className="me-2" /> User
          </Link>
          <Link to="/settings" className="nav-link text-white mb-2 d-flex align-items-center">
            <FaCog className="me-2" /> Settings
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h5 className="mb-0">Welcome, Admin</h5>
          </div>
          <div className="d-flex align-items-center">
            <div className="me-3">
              <span className="badge bg-success">Online</span>
            </div>
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <img src="https://via.placeholder.com/32" className="rounded-circle me-2" alt="Profile" />
                Admin
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><a className="dropdown-item" href="#">Profile</a></li>
                <li><a className="dropdown-item" href="#">Settings</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a className="dropdown-item" href="#" >Logout</a></li>
              </ul>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-4 bg-light" style={{ minHeight: 'calc(100vh - 60px)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Master;
