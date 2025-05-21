import React, { useState } from 'react';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
const POS = () => {
  const [cart, setCart] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sample products data
  const products = [
    { id: 1, name: 'Espresso', price: 2.50, category: 'coffee' },
    { id: 2, name: 'Cappuccino', price: 3.50, category: 'coffee' },
    { id: 3, name: 'Latte', price: 3.75, category: 'coffee' },
    { id: 4, name: 'Croissant', price: 2.25, category: 'food' },
    { id: 5, name: 'Muffin', price: 2.75, category: 'food' },
    { id: 6, name: 'Sandwich', price: 4.50, category: 'food' },
  ];

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'coffee', name: 'Coffee' },
    { id: 'food', name: 'Food' },
  ];

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, change) => {
    setCart(cart.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="row">
      {/* Products Grid */}
      <div className="col-md-8">
        <div className="mb-3">
          <div className="btn-group">
            {categories.map(category => (
              <button
                key={category.id}
                className={`btn ${selectedCategory === category.id ? 'btn-primary' : 'btn-outline-primary'}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="row row-cols-2 row-cols-md-3 g-3">
          {filteredProducts.map(product => (
            <div key={product.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">${product.price.toFixed(2)}</p>
                  <button
                    className="btn btn-primary w-100"
                    onClick={() => addToCart(product)}
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
            {cart.length === 0 ? (
              <p className="text-center">No items in cart</p>
            ) : (
              <>
                <div className="list-group mb-3">
                  {cart.map(item => (
                    <div key={item.id} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{item.name}</h6>
                          <small className="text-muted">${item.price.toFixed(2)}</small>
                        </div>
                        <div className="d-flex align-items-center">
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <FaMinus size={12} />
                          </button>
                          <span className="mx-2">{item.quantity}</span>
                          <button
                            className="btn btn-sm btn-outline-secondary me-2"
                            onClick={() => updateQuantity(item.id, 1)}
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
                <button className="btn btn-success w-100">
                  Process Payment
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS; 