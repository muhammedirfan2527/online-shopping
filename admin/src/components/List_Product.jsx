import React, { useState, useEffect } from "react";
import "./List_Product.css";
import { Link } from "react-router-dom";

const List_product = () => {
  const [products, setProducts] = useState([]);
  const [offer, setOffer] = useState([]);

  // Fetch products
  const getProducts = () => {
    fetch("https://online-shopping-lmg9.onrender.com/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => {
        alert("Unable to fetch products");
      });
  };

  useEffect(getProducts, []);

  // Fetch offers
  const getOffer = () => {
    fetch("https://online-shopping-lmg9.onrender.com/offer")
      .then((response) => response.json())
      .then((data) => setOffer(data))
      .catch((error) => {
        alert("Unable to fetch offers");
      });
  };

  useEffect(getOffer, []);

  // Delete product
  const deleteProduct = async (id) => {
    try {
      const res = await fetch(`https://online-shopping-lmg9.onrender.com/products/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((product) => product.id !== id));
        console.log("Deleted");
      } else {
        console.log("Delete failed");
      }
    } catch (error) {
      console.log("Server error while deleting");
    }
  };

  // Helper: get offer by product name
  const getProductOffer = (productName) => {
    const productOffer = offer.find((o) => o.name === productName);
    return productOffer ? productOffer.offer : 0; // default 0 if no offer
  };

  return (
    <div className="list-product">
  <table>
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Brand</th>
        <th>Category</th>
        <th>Price</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {products.map((item) => {
        const productOffer = getProductOffer(item.name);
        const discountedPrice =
          productOffer > 0
            ? (item.price - item.price * (productOffer / 100)).toFixed(2)
            : item.price;

        return (
          <tr key={item.id}>
            <td>
              <img
                src={`https://online-shopping-lmg9.onrender.com/images/${item.image}`}
                alt={item.name}
                className="product-image"
              />
            </td>
            <td>{item.name}</td>
            <td>{item.brand}</td>
            <td>{item.category}</td>
            <td>
              {productOffer > 0 ? (
                <>
                  <span className="old-price">₹{item.price}</span>
                  <span className="new-price">₹{discountedPrice}</span> (-{productOffer}%)
                </>
              ) : (
                <>₹{item.price}</>
              )}
            </td>
            <td>
              <Link to={`/update_product/${item.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button
                className="delete-btn"
                onClick={() => deleteProduct(item.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

  );
};

export default List_product;
