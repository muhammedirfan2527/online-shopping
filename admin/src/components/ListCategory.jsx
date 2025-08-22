import React,{useState,useEffect} from 'react'
import {Link} from 'react-router-dom'
import './ListCategory.css'

const ListCategory = () => {
    const [menu,setMenu] = useState([])
    
        const getmenu= () =>{
            fetch("http://localhost:5000/category")
            .then(response => response.json())
            .then(data => setMenu(data))
            .catch(error => {
                alert("unable")
            })
        }
        useEffect(getmenu, [])

        const deleteProduct = async (id) =>{
            const deletee = await fetch(`http://localhost:5000/category/${id}`,{
                method:'DELETE'
            })
            if(deletee.ok){
                setMenu((prev)=> prev.filter((menu)=>menu.id !== id))
                console.log("deleted")
            }else{
                console.log("fail")
            }
        }
  return (
    <div className="list-category">
  {menu.map((item) => (
    <div className="category-card" key={item.id}>
      <div className="category-info">
        <p><strong>Name:</strong> {item.name}</p>
        {/* <p><strong>ID:</strong> {item.id}</p> */}
      </div>
      <div className="category-actions">
        <Link to={`/update_category/${item.id}`}>
          <button className="edit-btn">Edit</button>
        </Link>
        <button className="delete-btn" onClick={() => deleteProduct(item.id)}>Delete</button>
      </div>
    </div>
  ))}
</div>

  )
}

export default ListCategory