import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../axios-client";

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    id: null,
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);

  // Fetch customer if editing
  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient
        .get(`/customers/${id}`)
        .then(({ data }) => {
          setCustomer(data.customer);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors(null);

    const request = customer.id
      ? axiosClient.put(`/customers/${customer.id}`, customer)
      : axiosClient.post("/customers", customer);

    request
      .then(() => {
        navigate("/customers");
      })
      .catch((err) => {
        setLoading(false);
        if (err.response && err.response.status === 422) {
          setErrors(err.response.data.errors);
        }
      });
  };

  return (
    <div className="row justify-content-center">
      <div className="card col-md-6">
        <div className="card-body">
          <h3>{customer.id ? "Edit Customer" : "New Customer"}</h3>
          {errors && (
            <div className="alert alert-danger">
              {Object.keys(errors).map((key) => (
                <div key={key}>{errors[key][0]}</div>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                name="name"
                type="text"
                className="form-control"
                value={customer.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                value={customer.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input
                name="phone"
                type="text"
                className="form-control"
                value={customer.phone}
                onChange={handleChange}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => navigate("/customers")}
            >
              Cancel
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
