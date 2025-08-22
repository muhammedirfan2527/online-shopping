import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './AddCategory.css'

const AddCategory = () => {
  const [addCategory, setAddCategory] = useState({ name: "" })
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate()
console.log(categories)
  useEffect(() => {
  const fetchCategories = async () => {
    try {
      const res = await fetch("http://localhost:5000/category");
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.log("Failed to fetch categories:", err);
    }
  };
  fetchCategories();
}, []);


  const handleChange = (e) => {
    setAddCategory({ ...addCategory, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  const name = addCategory.name.trim().toLowerCase();

  // Check if category already exists
  if (categories.some(cat => cat.name.toLowerCase() === name)) {
    alert("Category already exists");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/category", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    });

    if (response.ok) {
      alert("Category added successfully");
      navigate("/list_category");
    } else {
      alert("Unable to add category");
    }
  } catch (error) {
    alert("Server error");
  }
};

  return (
    <div className="add-category">
      <form onSubmit={handleSubmit} className="add-category-form">
        <h2>Add Category</h2>
        <input
          type="text"
          placeholder="Category name"
          onChange={handleChange}
          name="name"
          value={addCategory.name}
          required
        />
        <button type="submit">Add Category</button>
      </form>
    </div>
  )
}

export default AddCategory
