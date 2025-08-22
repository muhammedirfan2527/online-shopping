import React, { useEffect, useState } from 'react';
import './AddOffer.css';
import { useNavigate } from "react-router-dom";

const AddOffer = () => {
  const navigate = useNavigate();
  const [nameProduct, setNameProduct] = useState([]);
  const [offer, setOffer] = useState([]);

  useEffect(() => {
    const fetchNameProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setNameProduct(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchNameProduct();
  }, []);

  const getOffer = async () => {
      try {
        const response = await fetch("http://localhost:5000/offer");
        const data = await response.json();
        setOffer(data);
      } catch (error) {
        alert("Unable to fetch offers");
      }
    };
  
    useEffect(() => {
      getOffer();
    }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const offerData = {
      name: formData.get("name"),
      offer: formData.get("offer"),
    };

    if (!offerData.name || !offerData.offer) {
      alert("Please fill all the fields");
      return;
    }

    const name = offerData.name.trim().toLowerCase();

// Check if offer already exists
if (offer.some(o => o.name.toLowerCase() === name)) {
  alert("Offer already exists");
  return;
}

    try {
      const response = await fetch("http://localhost:5000/offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offerData),
      });

      if (response.ok) {
        alert("Offer added!");
        navigate('/');
      } else {
        alert("Unable to add offer");
      }
    } catch (error) {
      alert(`Server error: ${error.message}`);
    }
  };

  return (
    <div className="add-offer">
      <h2>Add Offer</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-div'>
          <label htmlFor="name">Product Name</label>
          <select name="name" id="name" required>
            <option value="">--- Select Product ---</option>
            {nameProduct.map((prod) => (
              <option key={prod.id} value={prod.name}>{prod.name}</option>
            ))}
          </select>
        </div>

        <div className="percent-wrapper">
          <div>
            <label >Discount :</label>
          </div>
          <div>

          <input type="number" name="offer" id="offer" max={99} min={0} required />
          </div>
          <div>

          <span>%</span>
          </div>
        </div>

        <div>
          <button type="submit">Add Offer</button>
        </div>
      </form>
    </div>
  );
};

export default AddOffer;
