import {Link} from "react-router";
import {useRef} from "react";
import axiosClient from "../../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Signup () {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const {setUser,setToken} = useStateContext();
  function submit(e) {
    e.preventDefault();
    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }
    console.log(payload);
    axiosClient.post('/signup',payload).then(({data}) => {
      setUser(data.user)
      setToken(data.token)
    }).catch(error => {
      console.log(error);
      const response = error.response;
      if (response && response.status === 422) {
        console.log(response.data.errors);
      }
    })
  }
    return (
      <>
        <h3 className="text-center mb-4">Create Account</h3>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              ref={nameRef}
              type="text"
              className="form-control"
              id="name"
              placeholder="Your full name"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email address</label>
            <input
              ref={emailRef}
              type="email"
              className="form-control"
              id="email"
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              ref={passwordRef}
              type="password"
              className="form-control"
              id="password"
              placeholder="Enter password"
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              ref={passwordConfirmationRef}
              type="password"
              className="form-control"
              id="confirmPassword"
              placeholder="Re-enter password"
              required
            />
          </div>
          <div className="d-grid mb-3">
            <button type="submit" className="btn btn-primary">Register</button>
          </div>
          <div className="text-center">
            <Link to="/login">Already have an account? Login</Link>
          </div>
        </form>
      </>
    );
}
