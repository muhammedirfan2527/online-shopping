import React, {useState, useEffect} from 'react'
import './AddCategory.css'
import { useNavigate, useParams } from 'react-router-dom'


const UpdateCategory = () => {
  const [category, setCategory] = useState([])
  const navigate = useNavigate()
  const {id} = useParams()

  
  // Fetch product by ID
    const fetchInfo = async () => {
      try {
        const res = await fetch(`https://online-shopping-lmg9.onrender.com/category/${id}`);
        const data = await res.json();
        setCategory(data);
      } catch (error) {
        alert("Unable to fetch product");
      }
    };
  
    useEffect(() => {
      fetchInfo();
    }, []);


  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`https://online-shopping-lmg9.onrender.com/category/${id}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(category)
      })

      const json = await response.json()

      if (response.ok) {
        alert("Category updated successfully")
        navigate("/list_category")
      } else if (response.status === 400) {
        alert("Validation error")
      } else {
        alert("Unable to add category")
      }
    } catch (error) {
      alert("Server error")
    }
  }

  return (
    <div className="add-category">
      <form onSubmit={handleSubmit} className="add-category-form">
      <h2>Update Category</h2>
        <input type="text" value={category.name} onChange={handleChange} name="name" />
        <button type="submit">Update category</button>
      </form>

      <div>
        
      </div>
    </div>
  )
}

export default UpdateCategory
