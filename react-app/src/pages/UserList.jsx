import React, {useEffect, useState} from 'react';
import {FaEdit, FaPlus, FaTrash} from "react-icons/fa";
import {getUser} from "../services/userService.js";
import {Link} from "react-router";

const UserList = () => {
    const [users,setUser] = useState([]);
    useEffect(() => {
        // request api from db
        // const fetchUser = async () =>{
        //     let data = await getUser();
        //     setUser(data);
        // }
        // fetchUser();

        // api fake data
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .then(data => setUser(data));
    }, []);
    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Customers</h2>
                <button className="btn btn-primary">
                    <FaPlus className="me-2" /> Add Customer
                </button>
            </div>

            <div className="card">
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Total Orders</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.password}</td>
                                    <td>
                                        <Link to={`/edituser/${user.id}`} className="btn btn-sm btn-outline-primary me-2">
                                            <FaEdit />
                                        </Link>
                                        <button className="btn btn-sm btn-outline-danger">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            ))
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default UserList;