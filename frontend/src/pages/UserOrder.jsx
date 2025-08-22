import React, { useContext, useEffect, useState } from 'react'
import { StoreContext } from '../context/StoreContext'
import './UserOrder.css';

const UserOrder = () => {
  const { email } = useContext(StoreContext)
  const [data, setData] = useState([])

  const fetchOrder = async () => {
    fetch(`http://localhost:5000/order?email=${email}`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(() => alert("Unable to fetch orders"));
  }

  useEffect(() => {
    fetchOrder();
  }, [email]);

  return (
    <div className='userorder'>
      <h2>Orders</h2>
      <div className='container'>
        {data.length === 0 ? (
          <p>No orders found</p>
        ) : (
          data.map((order) => (
            <div className='myorderorder' key={order.id}>
              <p>
                {order.items
                  .map(
                    (item, index) =>
                      `${item.name} x ${item.quantity}${index === order.items.length - 1 ? '' : ', '}`
                  )
                  .join('')}
              </p>
              <p>Amount: ₹{order.amount}</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.Status}</b></p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default UserOrder
