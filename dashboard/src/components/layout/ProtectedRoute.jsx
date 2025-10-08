import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loginSuccess } from "../../redux/userSlice";
import { toast } from "../../redux/useToast";
import { Loader } from "../../components/ui/Loaders";
import { apiRequest } from "../../lib/apiRequest";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser, loading } = useSelector((state) => state.user); 
   const location = useLocation();
   const dispatch = useDispatch();
   const [isChecking, setIsChecking] = useState(!currentUser);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      dispatch(loginStart()); 
      setIsChecking(true);
      try {
        const res = await apiRequest.get("/users/profile");
        if (mounted && res?.data) {
          dispatch(loginSuccess(res.data));
        }
      } catch (err) {
        if (mounted) {
          dispatch(loginFailure("Session check failed. Please login again.")); 
          toast({
            variant: "destructive",
            title: "Session expired",
            description: "Please login again",
          });
        }
      } finally {
        if (mounted) setIsChecking(false);
      }
    };

    if (!currentUser && isChecking) checkSession(); 

    return () => {
      mounted = false;
    };
  }, [currentUser, dispatch, isChecking]);

  if (isChecking || loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <Loader />
        </div>
      );
    }
  
    if (!currentUser) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  
    if (!currentUser.isVerified) {
      return <Navigate to="/verify-email" state={{ from: location }} replace />;
    }

  // Role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (
    currentUser.isSeller &&
    !currentUser.brand &&
    location.pathname !== "/create-brand"
  ) {
    return <Navigate to="/create-brand" state={{ from: location }} replace />;
  }

 
  return <Outlet />;
};

export default ProtectedRoute;
