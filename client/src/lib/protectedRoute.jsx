import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { apiRequest } from './apiRequest';
import { loginSuccess } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { Loader } from '../components/ui/Loaders';
import { toast } from '../redux/useToast';

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiRequest.get('/users/profile');
        if (res.data) {
          dispatch(loginSuccess(res.data));
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Session check failed",
          description: "Please login again"
        });
      }
    };

    if (!currentUser) {
      checkSession();
    }
  }, [currentUser, dispatch]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader/></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;



// Custom hook for imperative authentication checks



// // src/components/auth/ProtectedRoute.jsx
// import { Navigate, useLocation } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { useEffect, useState } from 'react';
// import { apiRequest } from './apiRequest';
// import { loginSuccess,logout } from '../redux/userSlice';

// const ProtectedRoute = ({ children }) => {
//   const { currentUser } = useSelector((state) => state.user);
//   const [isSessionValid, setIsSessionValid] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const location = useLocation();
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const checkSession = async () => {
//       try {
//         const res = await apiRequest.get('/users/profile');
//         console.log(res.data.user)
//         dispatch(loginSuccess(res.data.user));
//         setIsSessionValid(true);
//       } catch (error) {
//         console.log(error)

//         // dispatch(logout());
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkSession();
//   }, [dispatch]);

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading...</div>;
//   }

//   if (!isSessionValid || !currentUser) {
//     return <Navigate to="/login" state={{ from: location }} replace />;
//   }

//   if (!currentUser.isVerified) {
//     return <Navigate to="/verify-email" state={{ from: location }} replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;