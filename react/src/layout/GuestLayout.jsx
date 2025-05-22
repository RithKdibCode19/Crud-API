import {Navigate, Outlet} from "react-router-dom";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function GuestLayout (){
  const {token} = useStateContext();
  if(token){
    return <Navigate to="/"/>
  }
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow-sm">
          <Outlet/>
          </div>
        </div>
      </div>
    </div>
  );
}
