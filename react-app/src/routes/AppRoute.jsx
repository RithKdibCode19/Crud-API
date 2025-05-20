import React from 'react'
import { Route, Routes } from 'react-router'
import Master from '../layout/Master'
import Dashboard from '../pages/Dashboard'
import POS from '../pages/POS'
import ProductList from '../pages/ProductList'
import AddProduct from '../pages/AddProduct'
import EditProduct from '../pages/EditProduct'
import Customers from '../pages/Customers'
import Reports from '../pages/Reports'
import Settings from '../pages/Settings'
import UserList from "../pages/UserList.jsx";
import EditUser from "../pages/EditUser.jsx";

const AppRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<Master/>}>
        <Route index element={<Dashboard/>}/>
        <Route path='pos' element={<POS/>}/>
        
        {/* Product Management Routes */}
        <Route path='products' element={<ProductList/>}/>
        <Route path='create' element={<AddProduct/>}/>
        <Route path='edit/:id' element={<EditProduct/>}/>

        {/*User Management Route*/}
        <Route path='user' element={<UserList/>}/>
        <Route path='edituser/:id' element={<EditUser/>}/>

        {/* Additional POS System Routes */}
        <Route path='customers' element={<Customers/>}/>
        <Route path='reports' element={<Reports/>}/>
        <Route path='settings' element={<Settings/>}/>
      </Route>
    </Routes> 
  )
}

export default AppRoute