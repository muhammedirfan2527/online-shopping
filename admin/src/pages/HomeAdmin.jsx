import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import NavbarAdmin from '../components/NavbarAdmin';
import AddProduct from '../components/AddProduct';
import UpdateProduct from '../components/UpdateProduct';
import List_product from '../components/List_product';
import AddCategory from '../components/AddCategory';
import ListCategory from '../components/ListCategory';
import UpdateCategory from '../components/UpdateCategory';
import Order from '../components/Order';
import AddOffer from '../components/AddOffer';
import ListOffer from '../components/ListOffer';
import UpdateOffer from '../components/UpdateOffer';
import AdminLogin from '../components/AdminLogin';

const NavbarAdminLayout = () => (
  <>
    <NavbarAdmin />
    <Outlet />
  </>
);

const HomeAdmin = () => {
  return (
    <Routes>
      {/* Login Page */}
      <Route path="/" element={<AdminLogin />} />

      {/* Protected Admin Panel Layout */}
      <Route element={<NavbarAdminLayout />}>
        <Route path="/add_product" element={<AddProduct />} />
        <Route path="/list_product" element={<List_product />} />
        <Route path="/update_product/:id" element={<UpdateProduct />} />
        <Route path="/add_category" element={<AddCategory />} />
        <Route path="/list_category" element={<ListCategory />} />
        <Route path="/update_category/:id" element={<UpdateCategory />} />
        <Route path="/add_offer" element={<AddOffer />} />
        <Route path="/list_offer" element={<ListOffer />} />
        <Route path="/order_admin" element={<Order />} />
        <Route path="/update_offer/:id" element={<UpdateOffer />} />
      </Route>
    </Routes>
  );
};

export default HomeAdmin;
