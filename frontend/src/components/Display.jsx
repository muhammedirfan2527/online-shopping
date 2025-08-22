import React, { useContext, useState, useEffect } from "react";
import "./Display.css";
import { StoreContext } from "../context/StoreContext";
import { useNavigate } from "react-router-dom";

const Display = ({ menuDisplay }) => {
  const navigate = useNavigate();
  const {
    allproduct,
    filteredData,
    cart,
    user,
    favorite,
    addToCart,
    increaseQuantity,
    Wishlist,
  } = useContext(StoreContext);

  const [offer, setOffer] = useState([]);
  const [sortOption, setSortOption] = useState("default");

  // Fetch offers
  const getOffer = () => {
    fetch("http://localhost:5000/offer")
      .then((response) => response.json())
      .then((data) => setOffer(data))
      .catch(() => {
        alert("Unable to fetch offers");
      });
  };

  useEffect(getOffer, []);

  // Helper: get offer by product name
  const getProductOffer = (productName) => {
    const productOffer = offer.find((o) => o.name === productName);
    return productOffer ? productOffer.offer : 0; // default 0 if no offer
  };

  // Products to show
  const productsToShow = filteredData.length ? filteredData : allproduct;
  let filteredProducts = productsToShow.filter(
    (item) =>
      menuDisplay === "All" ||
      menuDisplay.toLowerCase() === item.category.toLowerCase()
  );

  // Apply sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    const offerA = getProductOffer(a.name);
    const offerB = getProductOffer(b.name);

    const priceA =
      offerA > 0 ? Math.round(a.price - a.price * (offerA / 100)) : a.price;
    const priceB =
      offerB > 0 ? Math.round(b.price - b.price * (offerB / 100)) : b.price;

    if (sortOption === "low-to-high") return priceA - priceB;
    if (sortOption === "high-to-low") return priceB - priceA;
    return 0; // default (no sort)
  });

  const getQuantity = (productId) => {
    if (!cart) return 0;
    const item = cart.items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  return (
    <div className="display-container">
      {/* Sorting Dropdown */}
      <div className="sort-bar">
        <label>Sort by: </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option className="option" value="default">Default</option>
          <option  className="option" value="low-to-high">Price: Low to High</option>
          <option className="option" value="high-to-low">Price: High to Low</option>
        </select>
      </div>

      <div className="display">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => {
            const productOffer = getProductOffer(item.name);
            const discountedPrice =
              productOffer > 0
                ? Math.round(item.price - item.price * (productOffer / 100))
                : item.price;

            return (
              <div className="product-card" key={item.id}>
                {/* Wishlist button */}
                <button
                  className="wishlist-btn"
                  onClick={() =>
                    user ? Wishlist(item) : navigate("/login")
                  }
                  style={{
                    color: favorite.some((fav) => fav.productId === item.id)
                      ? "red"
                      : "gray",
                  }}
                >
                  ♥
                </button>

                {/* Product info */}
                <img
                  src={`http://localhost:5000/images/${item.image}`}
                  alt={item.name}
                  className="product-image"
                />
                <p className="product-name">{item.name}</p>
                <p className="product-brand">{item.brand}</p>
                <p className="product-category">{item.category}</p>
                <p className="product-price">
                  {productOffer > 0 ? (
                    <>
                      <span className="old-price">₹{item.price}</span> <br />
                      <span className="new-price">₹{discountedPrice}</span> (-
                      {productOffer}%)
                    </>
                  ) : (
                    <> <span className="no-offer-price">₹{item.price}</span></>
                  )}
                </p>

                {/* Cart controls */}
                <div className="cart-controls">
                  <button
                    className="add-cart"
                    onClick={() => {
                      if (!user) return navigate("/login");
                      getQuantity(item.id) > 0
                        ? increaseQuantity(item.id)
                        : addToCart(item);
                    }}
                  >
                    Add to cart
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p>No product found</p>
        )}
      </div>
    </div>
  );
};

export default Display;
