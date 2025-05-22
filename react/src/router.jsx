import {createBrowserRouter} from "react-router";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import NotFound from "./pages/NotFound.jsx";
import Master from "./layout/Master.jsx";
import POS from "./pages/POS.jsx";
import GuestLayout from "./layout/GuestLayout.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Master/>,
    children: [
      {
        path: "pos",
        element: <POS/>
      },
    ]
  },
  {
    path: "/",
    element: <GuestLayout/>,
    children: [
      {
        path: "login",
        element: <Login/>
      },
      {
        path: "signup",
        element: <Signup/>
      },
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

export default router;
