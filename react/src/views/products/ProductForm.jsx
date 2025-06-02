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
    image: null,
    category_id: null,
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const { setNotification } = useStateContext();
  const [categories, setCategories] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch product if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/products/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setProducts(data.product);
          // If product has image, show toggle and preview
          if (data.product.image) {
            setIsToggled(true);
            setImagePreview(`${import.meta.env.VITE_API_BASE_URL}/${data.product.image}`);
            console.log(data.product.image);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // Fetch categories
  useEffect(() => {
    setLoading(true);
    axiosClient
      .get("/categories")
      .then(({ data }) => {
        setLoading(false);
        setCategories(data.categories);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProducts({
      ...products,
      image: file,
    });
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else if (products.image && typeof products.image === "string") {
      setImagePreview(`/${products.image}`);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let submitData = products;
    let config = {};

    if (isToggled) {
      submitData = new FormData();
      Object.entries(products).forEach(([key, value]) => {
        // Only append image if it's a File (new upload)
        if (key === "image") {
          if (value instanceof File) {
            submitData.append("image", value);
          }
        } else if (value !== null && value !== undefined) {
          submitData.append(key, value);
        }
      });
      config.headers = { "Content-Type": "multipart/form-data" };
    }

    if (products.id) {
      axiosClient
        .post(`/products/${products.id}?_method=PUT`, submitData, config)
        .then(() => {
          setNotification("Product was successfully updated");
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
        .post("/products", submitData, config)
        .then(() => {
          setNotification("Product was successfully created");
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
                  setProducts({ ...products, category_id: e.target.value })
                }
                value={products.category_id || ""}
              >
                <option value="" disabled>
                  Select Category
                </option>
                {categories &&
                  categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
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
                <label
                  className="form-check-label"
                  htmlFor="flexSwitchCheckDefault"
                >
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
              {isToggled && (
                <div className="col-12">
                  <label htmlFor="inputImage" className="form-label">
                    Product Image
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="inputImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {/* Preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{
                          width: 120,
                          height: 120,
                          objectFit: "cover",
                          border: "1px solid #ddd",
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
              <div className="col-12">
                <button type="submit" className="btn btn-primary">
                  save
                </button>
              </div>
            </form>
          )}
          {loading && (
            <div className="d-flex justify-content-center align-items-center">
              <div className="spinner-grow text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
