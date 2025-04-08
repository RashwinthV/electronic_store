import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Products/Home";
import Login from "../pages/Login&register/Login";
import ForgotPassowrd from "../pages/Login&register/ForgotPassowrd";
import SignUp from "../pages/Login&register/SignUp";
import AdminPanel from "../pages/Admin/AdminPanel";
import AllUsers from "../pages/Admin/AllUsers";
import AllProducts from "../pages/Admin/AllProducts";
import CategoryProduct from "../pages/Products/CategoryProduct";
import ProductDetails from "../pages/Products/ProductDetails";
import Cart from "../pages/Products/Cart";
import SearchProduct from "../pages/Products/SearchProduct";
import Privacy from "../pages/Footer/privacy";
import Terms from "../pages/Footer/Terms";
import Faq from "../pages/Footer/Faq";
import Profile from "../pages/profile";
import PaymentMethod from "../pages/Products/PayementMethod";
import AboutUs from "../pages/Footer/About";
import Contact from "../pages/Footer/Contact";
import OrdersPage from "../pages/Products/Orders";
import OrderDetailsPage from "../pages/Products/orderDetails";
import AdminOrders from "../pages/Admin/allOrders";
import AdminDashboard from "../pages/Admin/adminDashboard";
import UpdateStock from "../pages/Admin/UpdateStock";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassowrd />,
      },
      {
        path: "sign-up",
        element: <SignUp />,
      },
      {
        path: "product-category",
        element: <CategoryProduct />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart/product/:id",
        element: <ProductDetails />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      {
        path: "search",
        element: <SearchProduct />,
      },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "Dashboard",
            element: <AdminDashboard />,
          },
          {
            path: "all-users",
            element: <AllUsers />,
          },
          {
            path: "all-products",
            element: <AllProducts />,
          },
          {
            path: "orders",
            element: <AdminOrders />,
          },
          {
            path: "inventory",
            element: <UpdateStock />,
          },
        ],
      },
      {
        path: "/about",
        element: <AboutUs />,
      },
      {
        path: "/contact",
        element: <Contact />,
      },
      {
        path: "privacy&policy",
        element: <Privacy />,
      },
      {
        path: "/terms",
        element: <Terms />,
      },{
        path:"/faq",
        element:<Faq/>
      },
      {
        path:"/profile",
        element:<Profile/>
      },
      {
        path:"/paymentMethod",
        element:<PaymentMethod/>
      },
      {
        path:"/orders",
        element:<OrdersPage/>
      },
      {
        path:"/orders-details/:orderId",
        element:<OrderDetailsPage/>
      },
    ],
  },
]);

export default router;
