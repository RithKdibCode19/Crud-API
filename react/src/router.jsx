import {createBrowserRouter, Navigate} from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import DefaultLayout from "./components/DefaultLayout";
import GuestLayout from "./components/GuestLayout";
import Login from "./views/Login";
import NotFound from "./views/NotFound";
import Signup from "./views/Signup";
import Users from "./views/users/Users.jsx";
import UserForm from "./views/users/UserForm.jsx";
import Products from "./views/products/Products.jsx";
// import ProductList from "./views/ProductList";
import POS from "./views/POS.jsx";
import Customers from "./views/customers/Customers.jsx";
import Reports from "./views/Reports.jsx";
import ProductForm from "./views/products/ProductForm.jsx";
import Category from "./views/categories/Category.jsx";
import CategoryForm from "./views/categories/CategoryForm.jsx";
import CustomerForm from "./views/customers/CustomerForm.jsx";

const router = createBrowserRouter([
  {
    path: '/',
    element: <DefaultLayout/>,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard"/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/user',
        element: <Users/>
      },
      {
        path: '/users/new',
        element: <UserForm key="userCreate" />
      },
      {
        path: '/users/:id',
        element: <UserForm key="userUpdate" />
      },
      {
        path: '/products',
        element: <Products/>
      },
      {
        path: '/products/:id',
        element: <ProductForm key="productUpdate"/>
      },
      {
        path: '/products/new',
        element: <ProductForm key="productCreate"/>
      },
      {
        path: '/categories',
        element: <Category/>
      },
      {
        path: '/categories/:id',
        element: <CategoryForm key="categoryUpdate"/>
      },
      {
        path: '/categories/new',
        element: <CategoryForm key="categoryCreate"/>
      },
      {
        path: '/customers/new',
        element: <CustomerForm key="createCustomer"/>
      },
      {
        path: '/customers/:id',
        element: <CustomerForm key="updateCustomer"/>
      },
      {
        path: '/pos',
        element: <POS/>
      },
      {
        path: '/customers',
        element: <Customers/>
      },
      {
        path: '/reports',
        element: <Reports/>
      }
    ]
  },
  {
    path: '/',
    element: <GuestLayout/>,
    children: [
      {
        path: '/login',
        element: <Login/>
      },
      {
        path: '/signup',
        element: <Signup/>
      }
    ]
  },
  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;
