import './App.css';
import AdminDashboard from './routes/AdminDashboard';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from  './components/layout/Layout'
import CustomerList from './routes/CustomerList';
import SingleCustomerPage from './routes/CustomerSinglePage';
import ProductsList from './routes/Products';
import SellerMessages from './routes/SellerMessages';
import CustomerMessages from './routes/CustomerMessage';
import Announcements from './routes/Annoucements';
import EventListPage from './routes/EventsList';
import ProductSinglePage from './routes/ProductSinglePage';
import Profile from './routes/Profile';
import Orders from './routes/Orders';
import AddProduct from './routes/AddProduct';
import CategoryList from './routes/CategoryList';
import ProtectedRoute from "./components/layout/ProtectedRoute"
import UnauthorizedPage from './routes/UnauthorizedPage';
import SellerDashbaord from './routes/SellerDashboard';
import HomeBanner from './routes/HomeBanner';
import EditBannerPage from './routes/EditBannerPage';
import CreateBannerPage from './routes/CreateBannerPage';
import Register from './routes/Register';
import EmailVerificationPage from './routes/verification';
import SingleBrandPage from './routes/SingleBrandPage';
import BrandListPage from './routes/BrandListPage';
import HelpDesk from './routes/HelpDesk';
import BrandDetails from './routes/SellerBrandDetails';
import ForgotPasswordPage from './routes/forgotPassword';
import ChangePassword from './routes/ChangePassword';
import Login from './routes/Login';
import BecomeSeller from './routes/BecomeSeller';
import CreateBrand from './routes/CreateBrand';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      children: [
         { 
          index: true, 
          element: <BecomeSeller /> 
        },
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
          path: "forgot-password",
          element: <ForgotPasswordPage />
        },
        {
          path: "reset-password/:token",
          element: <ChangePassword />
        },
        {
          path: "unauthorized",
          element: <UnauthorizedPage />,
        },
      ]
    },
   
    {
      path: "/",
      element: (
        <ProtectedRoute allowedRoles={['admin', 'seller', 'user']}>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        { 
          path: "create-brand", 
          element: <CreateBrand /> 
        }
      ]
    },

    {
      element: <ProtectedRoute allowedRoles={['admin']} />,
      children: [
        {
          path: "admin",
          element: <Layout />,
          children: [
            { path: "dashboard", element: <AdminDashboard /> },
            { path: "brands", element: <BrandListPage /> },
            { path: "brand/:id", element: <SingleBrandPage /> },
            { path: "product/:id", element: <ProductSinglePage /> },
            { path: "customers", element: <CustomerList /> },
            { path: "customer/:id", element: <SingleCustomerPage /> },
            { path: "orders", element: <Orders /> },
            { path: "add-product", element: <AddProduct /> },
            { path: "products", element: <ProductsList /> },
            {
              path: "seller-messages",
              children: [
                { index: true, element: <SellerMessages /> },
                { path: ":conversationId", element: <SellerMessages /> }
              ]
            },
            {
              path: "customer-messages",
              children: [
                { index: true, element: <CustomerMessages /> },
                { path: ":conversationId", element: <CustomerMessages /> }
              ]
            },
            { path: "banner", element: <HomeBanner /> },
            { path: "update-product/:id", element: <AddProduct /> },
            { path: "edit-product-banner/:id", element: <EditBannerPage type="product" /> },
            { path: "edit-category-banner/:id", element: <EditBannerPage type="category" /> },
            { path: "create-product-banner", element: <CreateBannerPage type="product" /> },
            { path: "create-category-banner", element: <CreateBannerPage type="category" /> },
            { path: "announcements", element: <Announcements /> },
            { path: "events", element: <EventListPage /> },
            { path: "category", element: <CategoryList /> },
            { path: "profile", element: <Profile /> },
            { path: "help-desk", element: <HelpDesk /> }
          ]
        }
      ]
    },
    {
      element: <ProtectedRoute allowedRoles={['seller']} />,
      children: [
        {
          path: "seller",
          element: <Layout />,
          children: [
            { path: "dashboard", element: <SellerDashbaord /> },
            { path: "products", element: <ProductsList /> },
            { path: "add-product", element: <AddProduct /> },
            { path: "update-product/:id", element: <AddProduct /> },
            { path: "product/:id", element: <ProductSinglePage /> },
            { path: "orders", element: <Orders /> },
            {
              path: "seller-messages",
              children: [
                { index: true, element: <SellerMessages /> },
                { path: ":conversationId", element: <SellerMessages /> }
              ]
            },
            {
              path: "customer-messages",
              children: [
                { index: true, element: <CustomerMessages /> },
                { path: ":conversationId", element: <CustomerMessages /> }
              ]
            },
            {
              path: "admin-messages",
              children: [
                { index: true, element: <HelpDesk /> },
                { path: ":conversationId", element: <HelpDesk /> }
              ]
            },
            { path: "details", element: <BrandDetails /> },
            { path: "profile", element: <Profile /> },
            { path: "announcements", element: <Announcements /> },
            { path: "events", element: <EventListPage /> }
          ]
        }
      ]
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;