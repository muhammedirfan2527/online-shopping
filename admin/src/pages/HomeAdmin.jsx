import React from 'react'
import {Routes, Route} from 'react-router-dom'
import NavbarAdmin from '../components/NavbarAdmin'
import AddProduct from '../components/AddProduct'
import UpdateProduct from '../components/UpdateProduct'
import ListProduct from '../components/ListProduct'
import AddCategory from '../components/AddCategory'
import ListCategory from '../components/ListCategory'
import UpdateCategory from '../components/UpdateCategory'
import Order from '../components/Order'
import AddOffer from '../components/AddOffer'
import ListOffer from '../components/ListOffer'
import UpdateOffer from '../components/UpdateOffer'

const HomeAdmin = () => {
  return (
    <div>
      <div>
        <NavbarAdmin />
        <Routes>
          <Route path='/' element={<ListProduct/>}/>
          <Route path='/add_product' element={<AddProduct/>}/>
          <Route path='/list_product' element={<ListProduct/>}/>
          <Route path='/update_product/:id' element={<UpdateProduct/>} />
          <Route path='/add_category' element={<AddCategory/>} />
          <Route path='/list_category' element={<ListCategory/>} />
          <Route path='/update_category/:id' element={<UpdateCategory/>} />
          <Route path='/add_offer' element={<AddOffer/>}/>
          <Route path='/list_offer' element={<ListOffer/>} />
          <Route path='/order_admin' element={<Order />} />
          <Route path='/update_offer/:id' element={<UpdateOffer/>} />
        </Routes>
      </div>

    </div>
  )
}

export default HomeAdmin
