import React, { useContext } from "react";
import "./Wishlist.css";
import { StoreContext } from "../context/StoreContext";

const Wishlist = () => {
  const { allproduct, addToCart, Wishlist: toggleWishlist, favorite } = useContext(StoreContext);

  // Filter wishlist items
  const wishlistItems = allproduct.filter((item) =>
  (favorite || []).some(fav => fav.productId === item.id)
);


  return (
    <div className="wishlist">
      <h2>My Wishlist </h2>
      <div className="">

      {wishlistItems.length === 0 ? (
        <p className="empty">Your wishlist is empty</p>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item.id} className="wishlist-item">
              <img
                src={`http://localhost:5000/images/${item.image}`}
                alt={item.name}
                className="product-image"
              />
              <h3 className="product-name">{item.name}</h3>
              <p className="product-brand">{item.brand}</p>
              <p className="product-category">{item.category}</p>
              <p className="product-price">₹{item.price}</p>

              <div className="wishlist-actions">
                <button onClick={() => addToCart(item)}>Add to Cart </button>
                <button onClick={() => toggleWishlist(item)}>Remove </button>
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
    </div>
  );
};

export default Wishlist;
