import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loginSuccess } from '../../redux/userSlice';
import { toast } from '../../redux/useToast';
import { Loader } from '../../components/ui/Loaders';
import { apiRequest } from '../../lib/apiRequest';

const ProtectedRoute = ({ allowedRoles = [] }) => {
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
    return <div className="flex justify-center items-center h-screen"><Loader /></div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!currentUser.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;