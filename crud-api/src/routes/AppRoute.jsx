import React from 'react'
import { Route, Routes } from 'react-router'
import Master from '../layout/Master'
import ProductList from '../pages/ProductList'
import AddProduct from '../pages/AddProduct'

const AppRoute = () => {
  return (
    <Routes>
      <Route path='/' element={<Master/>}>
        <Route index element={<ProductList/>}/>
        <Route path='create' element={<AddProduct/>}/>
        <Route path='edit' element={<AddProduct/>}/>
      </Route>
    </Routes> 
  )
}
export default AppRoute