import React from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../services/productServices";

const AddProduct = () => {
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    const status = await createProduct(data);
    if (status) {
      navigate("/");
    }
  };

  return (
    <div>
      <div className="d-flex justify-between align-middle mb-3">
        <h3>Add Product</h3>
        <a className="btn btn-danger" href="/">Back</a>
      </div>
      <form className="row g-3" onSubmit={handleCreate}>
        <div className="col-md-6">
          <label htmlFor="inputName" className="form-label">Product Name</label>
          <input type="text" className="form-control" id="inputName" name="name" />
        </div>
        <div className="col-md-6">
          <label htmlFor="inputPrice" className="form-label">Price</label>
          <input type="text" className="form-control" id="inputPrice" name="price" />
        </div>
        <div className="col-12">
          <label htmlFor="inputQty" className="form-label">Quantity</label>
          <input type="text" className="form-control" id="inputQty" name="qty" placeholder="Enter quantity" />
        </div>
        <select className="form-select" aria-label="Default select example" name="status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div className="col-12">
          <button type="submit" className="btn btn-primary">Add</button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
