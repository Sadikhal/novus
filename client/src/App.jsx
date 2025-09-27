import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './routes/home/home';
import Layout from './components/layout/layout';
import Products from './routes/products/Products';
import Product from './routes/product/Product';
import CustomerDashboard from './routes/customerDashboard/CustomerDashboard';
import ChangePassword from './routes/changePassword/ChangePassword';
import Chat from './routes/chat/Chat';
import Order from './routes/order/Order';
import Orders from './routes/orders/Orders';
import Wishlist from './routes/wishList/Wishlist';
import Profile from './routes/profile/Profile';
import Cart from './routes/cart/Cart';
import Login from './routes/login/Login';
import Register from './routes/register/Register';
import Pay from './routes/pay/pay';
import Checkout from './routes/checkout/Checkout';
import AddAddress from './routes/addAddress/AddAddress';
import EmailVerificationPage from './routes/verification/verification';
import ForgotPasswordPage from './routes/forgotPassword/forgotPassword';
import OrderSuccess from './routes/orderSuccessPage/OrderSuccess';
import ProtectedRoute from './lib/protectedRoute';
import HelpDesk from './routes/HelpDesk/HelpDesk';
import Terms from './routes/terms/Terms';
import Privacy from './routes/privacy/Privacy';

function App() {
  const router = createBrowserRouter([
    {
          path: "/",
          children: [
            {
              path: "login",
              element: <Login />,
            },
            {
              path: "register",
              element: <Register />,
            },
            {
              path: "verify-email",
              element: <EmailVerificationPage />,
            },
            {
              path: "/forgot-password",
              element: <ForgotPasswordPage />
            },
            {
              path: "reset-password/:token",
              element: <ChangePassword />
            },
          ]
        },
    {
      path: "/",
      element: <Layout />,
      children: [
        { index : true, element: <Home /> },
        { path: "/products", element: <Products /> },
        { path: "/product/:productId", element: <Product /> },
        { path: "/terms", element: <Terms /> },
        { path: "/privacy", element: <Privacy /> },

      ]
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { path: "", element: <CustomerDashboard /> },
        { path: "my-orders", element: <Orders /> },
        { path: "cart", element: <Cart /> },
        { path: "my-wishlist", element: <Wishlist /> },
        { path: "order/:orderId", element: <Order /> },
        { path: "profile", element: <Profile /> },
        { 
          path: "chat", 
          children: [
            { index: true, element: < Chat /> },
            { path: ":conversationId", element: <Chat /> }
          ]
        },
         { 
          path: "help-desk", 
          children: [
            { index: true, element: < HelpDesk /> },
            { path: ":conversationId", element: <HelpDesk /> }
          ]
        },
        { path: "pay/", element: <Pay /> },
        { path: "checkout", element: <Checkout /> },
        { path: "checkout/:id", element: <Checkout /> },
        { path: "order-Success", element: <OrderSuccess /> },
        { path: "address/new", element: <AddAddress /> },
        { path: "address/:addressId", element: <AddAddress /> },
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;