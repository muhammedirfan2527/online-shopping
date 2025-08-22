import React, { useContext, useState, useEffect } from 'react';
import './Cart.css';
import { StoreContext } from '../context/StoreContext';
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, decreaseQuantity, increaseQuantity, email, totalOffer} = useContext(StoreContext);

  const [offer, setOffer] = useState([]);
  const [dataCart, setDataCart] = useState([])
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    pin: "",
    phone: ""
  });
  console.log(totalOffer)
  // Fetch offers
  const getOffer = () => {
    fetch("https://online-shopping-lmg9.onrender.com/offer")
      .then((response) => response.json())
      .then((data) => setOffer(data))
      .catch(() => {
        alert("Unable to fetch offers");
      });
  };

  useEffect(getOffer, []);

const getDataCart = () => {
  if (!email) return;
  fetch(`https://online-shopping-lmg9.onrender.com/cart?userEmail=${email}`)
    .then((response) => response.json())
    .then((data) => setDataCart(data.length ? data[0] : null))
    .catch(() => {
      alert("Unable to fetch cart");
    });
};

useEffect(getDataCart, [email]);

  // console.log(dataCart.total)
  // Helper: get offer by product name
  const getProductOffer = (productName) => {
    const productOffer = offer.find((o) => o.name === productName);
    return productOffer ? productOffer.offer : 0;
  };

  // Handle input change
  const handlerChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // Place order
  const placeOrder = async (e) => {
    e.preventDefault();

    if (!address.firstName.trim() || !address.address.trim()) {
      window.alert("First Name and Address are required!");
      return;
    }
    if (address.pin.length !== 6) {
      alert("Please enter a valid 6-digit pin number");
      return;
    }
    if (address.phone.length !== 10) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    let orderData = {
      email: cart.userEmail || "guest@shop.com", // fallback
      address,
      items: cart.items,
      amount: totalOffer
    };


    try {
      let response = await fetch("https://online-shopping-lmg9.onrender.com/order", {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        // Clear cart after successful order
        await fetch(`https://online-shopping-lmg9.onrender.com/cart/${cart.id}`, {
          method: 'DELETE'
        });

        window.alert("Order placed successfully!");
        navigate('/');
      } else {
        const errorText = await response.text();
        alert("Error placing order: " + errorText);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      alert("Network error while placing order!");
    }
  };

  if (!cart || !cart.items.length) return <p>Cart is empty</p>;

  return (
    <div className="cart">
      <div className="cart-header">
        <p>Items</p>
        <p>Price</p>
        <p>Offer</p>
        <p>Quantity</p>
        <p></p>
        <p></p>
      </div>

      <div className="cart-items">
        {cart.items.map(item => {
          const productOffer = getProductOffer(item.name);
          const discountedPrice = productOffer > 0
            ? Math.round(item.price - item.price * (productOffer / 100))
            : item.price;

          return (
            <div key={item.productId} className="cart-item">
              <p className="cart-item-name">{item.name}</p>

              {/* Original Price × Qty */}
              <p className="cart-item-price">₹{item.price * item.quantity}</p>

              {/* Discounted Price × Qty */}
              <p className="cart-item-offer">
                {productOffer > 0 ? (
                  <span className="new-price">
                    ₹{discountedPrice * item.quantity} (-{productOffer}%)
                  </span>
                ) : (
                  <p className='cart-on-offer'>-</p>
                )}
              </p>

              {/* Quantity Controls */}
              <p className="cart-item-qty">Qty: {item.quantity}</p>
              <div className="cart-item-controls">
                <button className="decreaseQuantity" onClick={() => decreaseQuantity(item.productId)}>-</button>
                <button className="increaseQuantity" onClick={() => increaseQuantity(item.productId)}>+</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Form */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input type="text" name='firstName' onChange={handlerChange} value={address.firstName} placeholder="First name" required />
          <input type="text" name="lastName" onChange={handlerChange} value={address.lastName} placeholder="Last name" required />
        </div>
        <div className="multi-fields">
          <input required type="text" name="address" onChange={handlerChange} value={address.address} placeholder="Address" />
        </div>
        <div className="multi-fields">
          <input required type="text" name="pin" onChange={handlerChange} value={address.pin} placeholder="Pin" />
        </div>
        <input required type="text" name="phone" className='phone' onChange={handlerChange} value={address.phone} placeholder="Phone" />
      </div>

      <div className="cart-summary">
        <p className="subtotal">Subtotal: ₹{totalOffer}</p>
        {cart.total === 0
          ? <button >Proceed to Order</button>
          : <button onClick={placeOrder}>Proceed to Order</button>}
      </div>
    </div>
  );
};

export default Cart;
