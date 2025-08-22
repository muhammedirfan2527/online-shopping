import React, { useEffect, useState } from "react";
import "./UpdateProduct.css";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [product, setProduct] = useState({
    id: "",
    name: "",
    brand: "",
    category: "",
    price: "",
    description: "",
    image: ""
  });
  const [image, setImage] = useState(null);
const [categories, setCategories] = useState([])

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://online-shopping-lmg9.onrender.com/category")
        const data = await res.json()
        setCategories(data)
      } catch (error) {
        alert("Unable to fetch categories")
      }
    }
    fetchCategories()
  }, [])
  // Fetch product by ID
  const fetchInfo = async () => {
    try {
      const res = await fetch(`https://online-shopping-lmg9.onrender.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      alert("Unable to fetch product");
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Handle text input changes
  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  // Handle update submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("brand", product.brand);
    formData.append("category", product.category);
    formData.append("price", product.price);
    // formData.append("description", product.description);

    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", product.image);
    }

    try {
      const response = await fetch(`https://online-shopping-lmg9.onrender.com/products/${id}`, {
        method: "PATCH",
        body: formData
      });

      if (response.ok) {
        alert("Product updated successfully");
        navigate("/list_product");
      } else {
        alert("Unable to update product");
      }
    } catch (error) {
      alert("Server error while updating product");
    }
  };

  return (
    <div className="update-product">
      <h2>Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input type="text" name="name" value={product.name} onChange={handleChange} />
        </div>

        <div>
          <label>Brand</label>
          <input type="text" name="brand" value={product.brand} onChange={handleChange} />
        </div>

        <div>
          <label>Category</label>
          <select name="category" value={product.category}>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Price</label>
          <input type="number" name="price" value={product.price} onChange={handleChange} />
        </div>

        {/* <div>
          <label>Description</label>
          <input type="text" name="description" value={product.description} onChange={handleChange} />
        </div> */}

        <div>
          <label>Image</label>
          <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
        </div>

        <div>
          {image ? (
            <img src={URL.createObjectURL(image)} alt="preview" width="120" />
          ) : product.image ? (
            <img src={`https://online-shopping-lmg9.onrender.com/images/${product.image}`} alt="current" width="120" />
          ) : null}
        </div>

        <div className="update-form-buttons">
          <button type="submit">Update</button>
          <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProduct;
