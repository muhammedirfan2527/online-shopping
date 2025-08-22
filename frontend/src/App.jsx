import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './components/Login'
import Cart from './pages/Cart'
import Wishlist from './pages/Wishlist'
import UserOrder from './pages/UserOrder'

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login/>} />
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/wishlist' element={<Wishlist/>}/>
        <Route path='/userorder' element={<UserOrder/>}/>
      </Routes>
    </div>
  )
}

export default App