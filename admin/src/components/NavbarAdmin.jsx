import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './NavbarAdmin.css';

const NavbarAdmin = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <nav className="admin-navbar">
      <h2 className="logo">Admin Panel</h2>
      <div className="nav-links">
        <NavLink to="/add_product" className={({ isActive }) => isActive ? "active" : ""}>Add Product</NavLink>
        <NavLink to="/list_product" className={({ isActive }) => isActive ? "active" : ""}>List Product</NavLink>
        <NavLink to="/add_category" className={({ isActive }) => isActive ? "active" : ""}>Add Category</NavLink>
        <NavLink to="/list_category" className={({ isActive }) => isActive ? "active" : ""}>List Category</NavLink>
        <NavLink to="/add_offer" className={({ isActive }) => isActive ? "active" : ""}>Add Offer</NavLink>
        <NavLink to="/list_offer" className={({ isActive }) => isActive ? "active" : ""}>List Offer</NavLink>
        <NavLink to="/order_admin" className={({ isActive }) => isActive ? "active" : ""}>List Order</NavLink>

        <div className="navbar-login">
              <button onClick={logout} className="navbar-link logout-btn">Logout</button>
            
        </div>
      </div>
    </nav>
  );
};

export default NavbarAdmin;
