import {Link} from "react-router";

export default function Login (){
  function submit(e){
    e.preventDefault();
  }
  return (
    <>
      <h3 className="text-center mb-4">Login</h3>
      <form onSubmit={submit}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email address</label>
          <input
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
            type="password"
            className="form-control"
            id="password"
            placeholder="Enter password"
            required
          />
        </div>
        <div className="d-grid mb-3">
          <button type="submit" className="btn btn-primary">Login</button>
        </div>
        <div className="text-center">
          <Link to="/signup">Create account?</Link>
        </div>
      </form>
    </>
  );
}
