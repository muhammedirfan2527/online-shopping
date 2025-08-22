import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateOffer = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [offer, setOffer] = useState({
    id: "",
    name: "",
    offer: ""
  });

  const [nameProduct, setNameProduct] = useState([]);

  // Fetch products
  useEffect(() => {
    const fetchNameProduct = async () => {
      try {
        const response = await fetch("http://localhost:5000/products");
        const data = await response.json();
        setNameProduct(data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };
    fetchNameProduct();
  }, []);

  // Fetch offer by ID
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`http://localhost:5000/offer/${id}`);
        const data = await res.json();
        setOffer(data);
      } catch (error) {
        alert("Unable to fetch offer");
      }
    };
    console.log(id)
    fetchInfo();
  }, [id]);

  // Handle input change
  const handleChange = (e) => {
    setOffer({ ...offer, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`http://localhost:5000/offer/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(offer) // send updated offer object
      });

      if (response.ok) {
        alert("Offer updated successfully");
        navigate("/list_offer");
      } else {
        alert("Unable to update offer");
      }
    } catch (error) {
      alert("Server error while updating offer");
    }
  };

  return (
    <div className="add-offer">
      <h2>Edit Offer</h2>
      <form onSubmit={handleSubmit}>
        <div className='form-div'>
          <label>Product Name</label>
          <select
            name="name"
            value={offer.name}
            onChange={handleChange}
            required
          >
            <option value="">--- Select Product ---</option>
            {nameProduct.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div className="percent-wrapper">
          <div>

          <label>Discount : </label>
          </div>
          <div>

          <input
            type="number"
            name="offer"
            onChange={handleChange}
            value={offer.offer}
            max={99}
            min={0}
            required
            />
            </div>
         <div>

          <span>%</span>
          </div>
        </div>
        <div>
          <button type="submit">Update Offer</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateOffer;
