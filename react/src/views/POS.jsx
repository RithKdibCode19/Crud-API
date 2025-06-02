import React, { useState, useEffect } from "react";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
import axiosClient from "../axios-client";

const POS = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [loading, setLoading] = useState(false);
  const [orderError, setOrderError] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Fetch products, categories, and customers
  useEffect(() => {
    axiosClient.get("/products").then(({ data }) => setProducts(data.products));
    axiosClient
      .get("/categories")
      .then(({ data }) =>
        setCategories([{ id: "all", name: "All" }, ...data.categories])
      );
    axiosClient
      .get("/customers")
      .then(({ data }) => setCustomers(data.customers || []));
  }, []);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    const stock = product.qty ?? product.stock;
    if (existingItem) {
      if (existingItem.quantity < stock) {
        setCart(
          cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      }
    } else if (stock > 0) {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(
      cart.map((item) => {
        if (item.id === productId) {
          const stock = item.qty ?? item.stock;
          const newQuantity = item.quantity + change;
          if (newQuantity > stock) return item;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
        }
        return item;
      })
    );
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((product) => product.category_id == selectedCategory);

  // Modal handlers
  const handleProcessPayment = () => {
    setOrderError(null);
    setOrderSuccess(null);
    setShowModal(true);
  };
  const handleCloseModal = () => setShowModal(false);

  const handleConfirmOrder = () => {
    setLoading(true);
    setOrderError(null);

    // Ensure customer_id is a number or null
    const customer_id = customerId ? Number(customerId) : null;

    // Prepare order data
    const orderData = {
      customer_id,
      payment_method: paymentMethod,
      total_amount: getTotal(),
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: Number(item.price),
      })),
    };
    console.log("Order Data:", orderData);
    axiosClient
      .post("/orders", orderData)
      .then(() => {
        setOrderSuccess("Order placed successfully!");
        setShowModal(false);
        setCart([]);
        setCustomerId("");
        setPaymentMethod("cash");
      })
      .catch((err) => {
        // Log error for debugging
        console.error(err.response?.data || err);

        // Show validation errors if present
        if (err.response?.data?.errors) {
          setOrderError(
            Object.values(err.response.data.errors).flat().join(" ")
          );
        } else {
          setOrderError(
            err.response?.data?.message ||
              "Failed to place order. Please try again."
          );
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="row">
      {/* Products Grid */}
      <div className="col-md-8">
        <div className="mb-3">
          <div className="btn-group">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`btn ${
                  selectedCategory == category.id
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        <div className="row row-cols-2 row-cols-md-3 g-3">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col">
              <div className="card h-100 shadow-sm position-relative">
                {product.image && (
                  <img
                    src={`http://localhost:8000/${product.image}`}
                    alt={product.name}
                    className="card-img-top"
                    style={{ height: 120, objectFit: "cover" }}
                  />
                )}
                <span className="badge bg-info position-absolute top-0 end-0 m-2">
                  Stock: {product.qty ?? product.stock}
                </span>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text mb-2">
                    ${Number(product.price).toFixed(2)}
                  </p>
                  <button
                    className="btn btn-success mt-auto"
                    onClick={() => addToCart(product)}
                    disabled={(product.qty ?? product.stock) <= 0}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">Order Summary</h5>
          </div>
          <div className="card-body">
            {orderSuccess && (
              <div className="alert alert-success">{orderSuccess}</div>
            )}
            {orderError && (
              <div className="alert alert-danger">{orderError}</div>
            )}
            {cart.length === 0 ? (
              <p className="text-center">No items in cart</p>
            ) : (
              <>
                <div className="list-group mb-3">
                  {cart.map((item) => (
                    <div key={item.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">
                            ${Number(item.price).toFixed(2)} |{" "}
                            <span className="badge bg-secondary">
                              In stock: {item.qty ?? item.stock}
                            </span>
                          </small>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => updateQuantity(item.id, 1)}
                            disabled={item.quantity >= (item.qty ?? item.stock)}
                          >
                            <FaPlus size={12} />
                          </button>
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaTrash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <h5>Total:</h5>
                  <h5>${getTotal().toFixed(2)}</h5>
                </div>
                <button
                  className="btn btn-success w-100"
                  onClick={handleProcessPayment}
                  disabled={cart.length === 0}
                >
                  Process Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Order Information</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Customer</label>
                  <select
                    className="form-select"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  >
                    <option value="">Select Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
                <div>
                  <strong>Total: </strong>${getTotal().toFixed(2)}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={handleCloseModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={handleConfirmOrder}
                  disabled={!customerId || loading}
                >
                  {loading ? "Processing..." : "Confirm Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POS;
