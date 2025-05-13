import React, { useEffect, useState } from 'react'
import { getProducts } from '../services/productServices';

const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect( () => {
    const fetchProducts = async () => {
      await getProducts();
    }
    fetchProducts();
  },[]);
  return (
    <div>
      <div className="d-flex justify-between align-middle mb-3">
            <h3>Add Producct</h3>
            <a className="btn btn-sucess" href="/create">Add More</a>
        </div>
      <table className='table table-bordered text-center'>
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
          <tr>
            <td>1</td>
            <td>Product 1</td>
            <td>10$</td>
            <td>10</td>
            <td>
              <a href='/edit'>Edit</a>
              <button>Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default ProductList