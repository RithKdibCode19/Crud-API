import React, { useState } from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Products = () => {
  const [products] = useState([
    { id: 1, name: 'Espresso', price: 2.50, category: 'coffee', stock: 100 },
    { id: 2, name: 'Cappuccino', price: 3.50, category: 'coffee', stock: 85 },
    { id: 3, name: 'Latte', price: 3.75, category: 'coffee', stock: 90 },
    { id: 4, name: 'Croissant', price: 2.25, category: 'food', stock: 50 },
    { id: 5, name: 'Muffin', price: 2.75, category: 'food', stock: 45 },
    { id: 6, name: 'Sandwich', price: 4.50, category: 'food', stock: 30 },
  ]);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <button className="btn btn-primary">Add New Product</button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(product => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.stock}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2">
                        <FaEdit />
                      </button>
                      <button className="btn btn-sm btn-outline-danger">
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products; 