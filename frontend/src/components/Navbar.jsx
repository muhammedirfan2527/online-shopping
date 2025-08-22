import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";

const Navbar = () => {
  const { user, logout,searchFunction } = useContext(StoreContext);
  const [products, setProducts] = useState([]);
  // const [filteredData, setFilteredData] = useState([]);
  
  
      const getproducts=() => {
          fetch("http://localhost:5000/products")
          .then(response => response.json())
          .then(data => setProducts(data))
          .catch(error => {
              alert("unable")
          })
      }
  
      useEffect(getproducts, [])

  //     const searchFunction = () => {
  //   // console.log("Search Query:", query);
  //   // if (!query) {
  //   //   setFilteredData(allproduct);
  //   // } else {
  //     const filtered = products.filter((item) =>
  //       item.name.toLowerCase().includes(query.toLowerCase())
  //     );
  //     setFilteredData(filtered);
  //   // }
  // };

const handleSearch = (event) => {
        searchFunction(event.target.value);
    };

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <Link to="/" className="navbar-link">Online Shopping</Link>
      </div>

      <div className="navbar-search">
        <input type="text" placeholder="Search products..." onChange={handleSearch}/>
      </div>

      <div className="navbar-left">
        <Link to="/wishlist" className="navbar-link">Wishlist</Link>
        <Link to="/userorder" className="navbar-link">Order</Link>
        <Link to="/cart" className="navbar-link">Cart</Link>

        <div className="navbar-login">
          {user ? (
            <>
              <span className="navbar-link">{user.username}</span>
              <button onClick={logout} className="navbar-link logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="navbar-link">Login</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
