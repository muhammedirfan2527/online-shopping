import { useState, useEffect } from "react";
import React from "react";
import "./AddProduct.css";
import { useNavigate } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:5000/category");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        alert("Unable to fetch categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    if (
      !formData.get("name") ||
      !formData.get("brand") ||
      !formData.get("category") ||
      !formData.get("price") ||
      
      !formData.get("image")
    ) {
      alert("Please fill all the fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/products", {
        method: "POST",
        body: formData, // ✅ send as multipart/form-data
      });

      if (response.ok) {
        alert("Product added successfully!");
        navigate("/list_product");
      } else if (response.status === 400) {
        alert("Validation error");
      } else {
        alert("Unable to add product");
      }
    } catch (error) {
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="add-product">
      <h2>Add Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Category */}
        <div>
          <label>Category</label>
          <select name="category" required>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Type field */}
        {/* <div>
          <label>Type</label>
          <input type="text" name="type" placeholder="e.g., Electronics" required />
        </div> */}

        {/* Product Name */}
        <div>
          <label>Name</label>
          <input type="text" name="name" required />
        </div>

        {/* Brand */}
        <div>
          <label>Brand</label>
          <input type="text" name="brand" required />
        </div>

        {/* Price */}
        <div>
          <label>Price</label>
          <input type="number" name="price" required />
        </div>

        {/* Description */}
        {/* <div>
          <label>Description</label>
          <textarea name="description" rows="3" required />
        </div> */}

        {/* Image */}
        <div>
          <label>Image</label>
          <input type="file" name="image" accept="image/*" required />
        </div>

        {/* Buttons */}
        <div className="form-buttons">
          <button type="submit">Submit</button>
          {/* <button type="button" onClick={() => navigate(-1)}>
            Cancel
          </button> */}
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
