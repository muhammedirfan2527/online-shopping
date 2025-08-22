import React, { useEffect, useState } from 'react'
import './Menu.css'

const Menu = ({menuDisplay,setMenuDisplay}) => {
    const [category,setCategory] = useState("none")
    // console.log(category)
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
    // const [menu, setMenu] = useState([
    //     {
    //         category_menu:"Electronics",
    //         menu:[
    //             { name:"Mobiles & Tablets" },
    //             { name:"Laptops & Computers" },
    //             { name:"Cameras & Accessories" },
    //             { name:"Audio & Headphones" }
    //         ]
    //     },
    //     {
    //         category_menu:"Fashion",
    //         menu:[
    //             { name:"Men’s Clothing" },
    //             { name:"Women’s Clothing" },
    //             { name:"Kids’ Wear" },
    //             { name:"Footwear" }
    //         ]
    //     },
    //     {
    //         category_menu:"Home & Living",
    //         menu:[
    //             { name:"Furniture" },
    //             { name:"Kitchen & Dining" },
    //             { name:"Home Decor" },
    //             { name:"Bedding & Bath" }
    //         ]
    //     },
    //     {
    //         category_menu:"Sports & Fitness",
    //         menu:[
    //             { name:"Gym Equipment" },
    //             { name:"Outdoor Sports" },
    //             { name:"Fitness Accessories" },
    //             // { name:"Audio & Headphones" }
    //         ]
    //     },
    //     {
    //         category_menu:"Toys & Baby Products",
    //         menu:[
    //             { name:"Baby Clothing" },
    //             { name:"Diapers & Baby Care" },
    //             { name:"Toys & Games" },
    //             // { name:"Audio & Headphones" }
    //         ]
    //     },
    //     {
    //         category_menu:"Books & Stationery",
    //         menu:[
    //             { name:"Books" },
    //             { name:"Office Supplies" },
    //             { name:"Art & Craft" },
    //             // { name:"Audio & Headphones" }
    //         ]
    //     }
    // ])

    const activeCategory = menu.find(prev => prev.category_menu === category)
  return (
    <div className='menu'>
        <div className='menu-category'>
            {
                menu.map((itme)=>{
                    return (
                         <div className={`menu-item ${menuDisplay === itme.name ? "active" : ""}`}  onClick={()=> setMenuDisplay(prev => prev === itme.name?"All":itme.name)}>
                        {itme.name}
                        
                    </div>
                    )
                })
            }
        </div>
        {/* <div className='menu-category'>
            {
                menu.map((categories)=>{
                    return (
                         <div   onClick={()=> setCategory(prev => prev === categories.category_menu?"none": categories.category_menu)}>
                        {categories.category_menu}
                        
                    </div>
                    )
                })
            }
        </div> */}
        {/* <div className='submenu'>
            {
                activeCategory && (
                    <div className='submenu-name'>
                        {activeCategory.menu.map((itme)=>{
                            return(
                            <div className='zzzz' onClick={()=> setMenuDisplay(prev => prev === itme.name?"All":itme.name)}>
                                {itme.name}
                            </div>
                            )
                        })}
                    </div>
                )
            }
        </div> */}
    </div>
  )
}

export default Menu