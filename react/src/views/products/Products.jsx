import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/products");
        console.log(response.data.products);
        setProducts(response.data.products);
      } catch (error) {
        setError("Error fetching products");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
    getCategoies();
  }, []);

  const getCategoies = async () => {
    const res = await axiosClient.get("/categories");
    setCategories(res.data.categories);
    console.log(res.data.categories);
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Products</h2>
        <Link to="/products/new" className="btn btn-primary">
          Add New Product
        </Link>
      </div>

      <div className="card">
        <div className="card-body">
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th> {/* Add this line */}
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${product.image}`}
                            alt={product.name}
                            style={{
                              width: 50,
                              height: 50,
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </td>
                      <td>{product.name}</td>
                      <td>
                        {
                          categories.find((c) => c.id == product.category_id)
                            ?.name
                        }
                      </td>
                      <td>${Number(product.price).toFixed(2)}</td>
                      <td>{product.stock ?? product.qty}</td>
                      <td>
                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn-sm btn-outline-primary me-2"
                        >
                          <FaEdit />
                        </Link>
                        <button className="btn btn-sm btn-outline-danger">
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
