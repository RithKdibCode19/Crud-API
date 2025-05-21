import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {updateUser} from "../services/userService.js";

const EditUser = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            const user = await (id);
            setFormData({
                name: user.name,
                price: user.email,
                qty: user.password,
            });
        };
        fetchUser();
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
        const status = await updateUser(id, formData);
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
                    <label htmlFor="inputName" className="form-label">Name</label>
                    <input type="text" className="form-control" id="inputName" name="name" onChange={handleChange} value={formData.name} />
                </div>
                <div className="col-md-6">
                    <label htmlFor="inputPrice" className="form-label">Email</label>
                    <input type="email" className="form-control" id="inputPrice" name="email" onChange={handleChange} value={formData.email} />
                </div>
                <div className="col-12">
                    <label htmlFor="inputQty" className="form-label">Password</label>
                    <input type="password" className="form-control" id="inputQty" name="password" placeholder="Enter quantity" onChange={handleChange} value={formData.password} />
                </div>
                {/*<select className="form-select" aria-label="Default select example" name="status" onChange={handleChange} value={formData.status}>*/}
                {/*    <option value="active">Active</option>*/}
                {/*    <option value="inactive">Inactive</option>*/}
                {/*</select>*/}
                <div className="col-12">
                    <button type="submit" className="btn btn-primary">Edit</button>
                </div>
            </form>
        </div>
    );
};

export default EditUser;
