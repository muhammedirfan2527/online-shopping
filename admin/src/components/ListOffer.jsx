import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ListOffer.css';

const ListOffer = () => {
  const [offer, setOffer] = useState([]);

  const getOffer = async () => {
    try {
      const response = await fetch("https://online-shopping-lmg9.onrender.com/offer");
      const data = await response.json();
      setOffer(data);
    } catch (error) {
      alert("Unable to fetch offers");
    }
  };

  useEffect(() => {
    getOffer();
  }, []);

  const deleteOffer = async (id) => {
    const res = await fetch(`https://online-shopping-lmg9.onrender.com/offer/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setOffer(prev => prev.filter((o) => o.id !== id));
      console.log("Deleted successfully");
    } else {
      console.log("Delete failed");
    }
  };

  return (
    <div className="list-offer">
      {offer.length === 0 ? (
        <p>No offers found.</p>
      ) : (
        offer.map((item) => (
          <div className="offer-card" key={item.id}>
            <div className="offer-info">
              <p><strong>Product:</strong> {item.name}</p>
              <p><strong>Offer:</strong> {item.offer}%</p>
            </div>
            <div className="offer-actions">
              <Link to={`/update_offer/${item.id}`}>
                <button className="edit-btn">Edit</button>
              </Link>
              <button className="delete-btn" onClick={() => deleteOffer(item.id)}>Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ListOffer;
