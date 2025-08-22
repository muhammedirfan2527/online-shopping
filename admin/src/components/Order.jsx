import React, { useEffect, useState } from 'react';
import './Order.css';

const Order = () => {
  const [userOrder, setUserOrder] = useState([]);

  const getUserOrder = () => {
    fetch("http://localhost:5000/order")
      .then(response => response.json())
      .then(data => setUserOrder(data))
      .catch(() => alert("Unable to fetch orders"));
  };

  useEffect(getUserOrder, []);

  const statusHandler = async (event, orderId) => {
    try {
      const newStatus = event.target.value;

      const response = await fetch(`http://localhost:5000/order/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Status: newStatus }),
      });

      if (response.ok) {
        getUserOrder(); // refresh orders
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.log(error);
      alert("Server error");
    }
  };

  return (
    <div className="order-container">
      <h2>User Orders</h2>

      {userOrder.length === 0 ? (
        <p>No orders found</p>
      ) : (
        userOrder.map((order, idx) => (
          <div key={idx} className="order-card">
            <div className="order-header">
              <p><strong>Name:</strong> {order.address.firstName} {order.address.lastName}</p>
              <p><strong>Email:</strong> {order.email}</p>
              <p><strong>Phone:</strong> {order.address.phone}</p>
              <p><strong>Address:</strong> {order.address.address}</p>
              <p><strong>Pin:</strong> {order.address.pin}</p>
            </div>

            <div className="order-items-grid">
              <div className="grid-header">Item</div>
              <div className="grid-header">Price</div>
              <div className="grid-header">Qty</div>

              {order.items.map((product, i) => (
                <React.Fragment key={i}>
                  <div>{product.name}</div>
                  <div>₹{product.price}</div>
                  <div>{product.quantity}</div>
                </React.Fragment>
              ))}
            </div>

            {/* ✅ Show total */}
            <div className="order-total">
  <p>
    <strong>Total:</strong> ₹
    {order.items.reduce((sum, product) => sum + product.price * product.quantity, 0)}
  </p>
</div>


            <div className="order-status">
              <label>Status: </label>
              <select
                onChange={(event) => statusHandler(event, order.id)}
                value={order.Status || "Pending"}
              >
                <option value="Processing">Processing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Order;
