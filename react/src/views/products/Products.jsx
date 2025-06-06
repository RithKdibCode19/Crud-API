import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import axiosClient from "../../axios-client";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button as MuiButton,
  Slide,
} from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const Products = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/products");
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
  };

  const handleDelete = async () => {
    console.log(deleteId);
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await axiosClient.delete(`/products/${deleteId}`);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Failed to delete product.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontWeight: 700, color: "#512da8", letterSpacing: 1 }}>
          Products
        </h2>
        <Link
          to="/products/new"
          className="btn"
          style={{
            background: "linear-gradient(135deg, #512da8 0%, #1976d2 100%)",
            color: "#fff",
            fontWeight: 600,
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(80,40,180,0.10)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 18px",
            fontSize: 16,
            border: "none",
          }}
        >
          <FaPlus style={{ marginRight: 6 }} /> Add New Product
        </Link>
      </div>

      <div
        className="card"
        style={{ borderRadius: 16, boxShadow: "0 2px 12px #e3e3f3" }}
      >
        <div className="card-body">
          {error && (
            <div className="alert alert-danger" style={{ borderRadius: 8 }}>
              {error}
            </div>
          )}
          <div className="table-responsive">
            <table
              className="table table-hover align-middle"
              style={{ fontSize: 15 }}
            >
              <thead
                style={{
                  background:
                    "linear-gradient(90deg, #512da8 0%, #1976d2 100%)",
                  color: "#fff",
                }}
              >
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ fontWeight: 600 }}>{product.id}</td>
                      <td>
                        {product.image ? (
                          <img
                            src={`${import.meta.env.VITE_API_BASE_URL}/${
                              product.image
                            }`}
                            alt={product.name}
                            style={{
                              width: 48,
                              height: 48,
                              objectFit: "cover",
                              borderRadius: 8,
                              border: "1px solid #e0e0e0",
                              background: "#fff",
                            }}
                          />
                        ) : (
                          <span style={{ color: "#aaa" }}>No Image</span>
                        )}
                      </td>
                      <td style={{ fontWeight: 600, color: "#222" }}>
                        {product.name}
                      </td>
                      <td>
                        <span
                          style={{
                            background: "#ede7f6",
                            color: "#512da8",
                            borderRadius: 6,
                            padding: "2px 10px",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {categories.find((c) => c.id == product.category_id)
                            ?.name || "-"}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            color: "#388e3c",
                            fontWeight: 700,
                            fontSize: 16,
                          }}
                        >
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            background: "#e3f2fd",
                            color: "#1976d2",
                            borderRadius: 6,
                            padding: "2px 10px",
                            fontWeight: 600,
                            fontSize: 14,
                          }}
                        >
                          {product.stock ?? product.qty}
                        </span>
                      </td>
                      <td style={{ textAlign: "center" }}>
                        <Link
                          to={`/products/${product.id}`}
                          className="btn btn-sm"
                          style={{
                            background: "#fff",
                            color: "#1976d2",
                            border: "1px solid #1976d2",
                            borderRadius: 6,
                            marginRight: 8,
                            fontWeight: 600,
                            boxShadow: "0 1px 4px #e3e3f3",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          title="Edit"
                        >
                          <FaEdit />
                        </Link>
                        <button
                          className="btn btn-sm"
                          style={{
                            background: "#fff",
                            color: "#d32f2f",
                            border: "1px solid #d32f2f",
                            borderRadius: 6,
                            fontWeight: 600,
                            boxShadow: "0 1px 4px #fbe9e7",
                            transition: "background 0.2s, color 0.2s",
                          }}
                          title="Delete"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center"
                      style={{ color: "#aaa", fontWeight: 600 }}
                    >
                      {loading ? "Loading..." : "No products found."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(deleteId)}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setDeleteId(null)}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle sx={{ fontWeight: 700, color: "#d32f2f" }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Are you sure you want to delete this product? This action cannot be
            undone. {deleteId}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => setDeleteId(null)}
            variant="outlined"
            color="primary"
            sx={{ borderRadius: 2 }}
            disabled={deleteLoading}
          >
            Cancel
          </MuiButton>
          <MuiButton
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={{ borderRadius: 2 }}
            disabled={deleteLoading}
          >
            {deleteLoading ? "Deleting..." : "Delete"}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Products;
