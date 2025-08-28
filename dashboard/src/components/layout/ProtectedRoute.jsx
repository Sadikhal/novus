import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { loginSuccess } from "../../redux/userSlice";
import { toast } from "../../redux/useToast";
import { Loader } from "../../components/ui/Loaders";
import { apiRequest } from "../../lib/apiRequest";

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { currentUser } = useSelector((state) => state.user);
  const location = useLocation();
  const dispatch = useDispatch();

  // Local state for session check
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await apiRequest.get("/users/profile");
        if (res.data) {
          dispatch(loginSuccess(res.data));
        }
      } catch (error) {
        // clear user if session expired
        toast({
          variant: "destructive",
          title: "Session expired",
          description: "Please login again",
        });
      } finally {
        setCheckingSession(false);
      }
    };

    if (!currentUser) {
      checkSession();
    } else {
      setCheckingSession(false);
    }
  }, [currentUser, dispatch]);

  // Show loader until session check is complete
  if (checkingSession) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User exists but not verified
  if (!currentUser.isVerified) {
    return <Navigate to="/verify-email" state={{ from: location }} replace />;
  }

  // Role restriction
  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Special case: sellers must create a brand
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
