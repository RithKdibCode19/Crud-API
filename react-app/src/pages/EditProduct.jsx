import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {getProductById, updateProduct } from "../services/productServices";
import { useState } from "react";

const EditProduct = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    qty: "",
    status: "active",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await getProductById(id);
      setFormData({
        name: product.name,
        price: product.price,
        qty: product.qty,
        status: product.status,
      });
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData((data) => ({
      ...data,
      [name]: value,
    }));
  }

  const handleEdit = async (e) => {
    e.preventDefault();
    const status = await updateProduct(id, formData);
    if (status) {
      navigate("/");
    }
  };

  return (
    <div>
      <div className="d-flex justify-between align-middle mb-3">
        <h3>Edit Product</h3>
        <a className="btn btn-danger" href="/">Back</a>
      </div>
      <form className="row g-3" onSubmit={handleEdit}>
        <div className="col-md-6">
          <label htmlFor="inputName" className="form-label">Product Name</label>
          <input type="text" className="form-control" id="inputName" name="name" onChange={handleChange} value={formData.name} />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPrice" className="form-label">Price</label>
          <input type="text" className="form-control" id="inputPrice" name="price" onChange={handleChange} value={formData.price} />
        </div>
        <div className="col-12">
          <label htmlFor="inputQty" className="form-label">Quantity</label>
          <input type="text" className="form-control" id="inputQty" name="qty" placeholder="Enter quantity" onChange={handleChange} value={formData.qty} />
        </div>
        <select className="form-select" aria-label="Default select example" name="status" onChange={handleChange} value={formData.status}>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Edit</button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
