import React, { useEffect, useState } from 'react'
import { deleteProduct, getProducts } from '../services/productServices';
import axiosClient from '../axios-client';
import { Link } from 'react-router';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect( () => {
    const fetchProducts = async () => {
      let data = await getProducts();
      setProducts(data);
      
    }
    fetchProducts();
  },[]);


  return (
    <div>
      <div className="d-flex justify-between align-middle mb-3">
            <h3>Add Producct</h3>
            <a className="btn btn-success" href="/create">Add More</a>
        </div>
      <table className='table table-bordered table-hover text-center'>
        <thead className='table-dark'>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {
            products.map( (product) => (
              product.status == "active" &&
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.qty}</td>
                <td>
                  <Link to={`/edit/${product.id}`} className='btn btn-primary me-2'>Edit</Link>
                  <button onClick={() => deleteProduct(product.id)} className='btn btn-danger'>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default ProductList