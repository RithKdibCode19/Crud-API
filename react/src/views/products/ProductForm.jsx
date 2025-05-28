import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";
import { useStateContext } from "../../context/ContextProvider";

const ProductForm = () => {
  let { id } = useParams();
  const [products, setProducts] = useState({
    id: null,
    name: "",
    price: null,
    qty: null,
    status: "active",
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const { setNotification } = useStateContext();

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProducts(data.product);
          console.log(products);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (products.id) {
      axiosClient
        .put(`/products/${products.id}`, products)
        .then(() => {
          setNotification("User was successfully updated");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      axiosClient
        .post("/products", products)
        .then(() => {
          setNotification("User was successfully created");
          navigate("/products");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };
  return (
    <div className="row justify-content-center">

      <div className="card animated fadeInDown col-md-7 me-2">
        {products.id && (
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3>Update Product: {products.name}</h3>
          </div>
        )}
        {!products.id && <h3>New Product</h3>}

        <div className="card-body">
          {!loading && (
            <form className="row g-3" method="POST" onSubmit={handleSubmit}>
              <div className="col-md-6">
                <label htmlFor="inputName" className="form-label">
                  Product Name
                </label>
                <input
                  type="text"
                  value={products.name}
                  className="form-control"
                  id="inputName"
                  onChange={(e) =>
                    setProducts({ ...products, name: e.target.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="inputPrice" className="form-label">
                  Price
                </label>
                <input
                  type="text"
                  value={products.price}
                  className="form-control"
                  id="inputPrice"
                  onChange={(e) =>
                    setProducts({ ...products, price: e.target.value })
                  }
                />
              </div>
              <div className="col-12">
                <label htmlFor="inputQty" className="form-label">
                  Quantity
                </label>
                <input
                  type="text"
                  value={products.qty}
                  className="form-control"
                  id="inputQty"
                  onChange={(e) =>
                    setProducts({ ...products, qty: e.target.value })
                  }
                />
              </div>
              <select
                className="form-select"
                onChange={(e) =>
                  setProducts({ ...products, status: e.target.value })
                }
                value={products.status}
              >
                <option value="" disabled>
                  Select Status
                </option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
                <div className="col-12 form-check form-switch form-switch-sm mb-3 justify-content-center">
                    <label className="form-check-label" htmlFor="flexSwitchCheckDefault">
                    Insert Image?
                    </label>
                    <input
                    className="form-check-input form-check-input-sm"
                    type="checkbox"
                    id="flexSwitchCheckDefault"
                    checked={isToggled}
                    onChange={() => setIsToggled(!isToggled)}
                    />
                </div>
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  save
                </button>
              </div>
            </form>
          )}
          {loading && (
            //   <div className="text-center">
            //     Loading...
            //   </div>
            <div className="d-flex justify-content-center align-items-center">
              <div class="spinner-grow text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
      {isToggled && (
      <div className="card animated fadeInDown col-md-4 ">
ff
      </div>)}
    </div>
  );
};

export default ProductForm;
