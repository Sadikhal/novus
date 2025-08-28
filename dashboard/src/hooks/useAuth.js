// src/hooks/useAuth.js
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../lib/apiRequest';
import { loginStart, loginSuccess, loginFailure, logout, updateVerificationStatus } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from '../redux/useToast';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sellerBrand, setSellerBrand] = useState(null);
  const [BrandLoading, setBrandLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);


  
  const register = async (formData) => {
    dispatch(loginStart());
    try {
      const res = await apiRequest.post('/auth/register', formData);
      dispatch(loginSuccess(res.data.user));
      console.log(res.data);
      toast({
        variant: "secondary",
        title: "Registration Successful",
        description: "Account created! Please verify your email to continue.",
      });
      navigate('/verify-email');
      return res.data;
    } catch (err) {
      dispatch(loginFailure(err.res?.data?.message || "Registration failed"));
      toast({
      variant: "destructive",
      title: "Registration Failed",
      description: err.response?.data?.message || "Unable to register. Please try again.",
    });
    }
  };

  const login = async (formData) => {
    dispatch(loginStart());
    try {
      const res = await apiRequest.post('/auth/login', formData);
      dispatch(loginSuccess(res.data));
      console.log(res.data);
      toast({
        variant: "secondary",
        title: "Login Successful",
        description: "Welcome back! You have been logged in.",
      });
       res.data.role === 'user' ?
       navigate("/") :
       navigate(`/${res.data.role}/dashboard`);
      return res.data;
    } catch (err) {
      console.log(err);
      dispatch(loginFailure(err.response?.data?.message || "Login failed"));
      toast({
      variant: "destructive",
      title: "Login Failed",
      description: err.response?.data?.message || "Invalid credentials or server error. Please try again.",
    });
    }
  };

  const verifyEmail = async (code) => {
    setLoading(true);
    try {
      const res = await apiRequest.post('/auth/verify-email', { code });
      dispatch(updateVerificationStatus(true));
      console.log(res.data);
      toast({
        variant: "secondary",
        title: "Email Verified",
        description: "Your email has been successfully verified.",
      });
      navigate('/');
      return res.data;
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: err.response?.data?.message || "Verification failed",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const logoutUser = async () => {
    try {
      await apiRequest.post('/auth/logout');
      dispatch(logout());
       toast({
      variant: "secondary",
      title: "Logout successfully",
      description: "You Logout successfully",
    });
      navigate('/login');
    } catch (err) {
      toast({
      variant: "destructive",
      title: "Logout Failed",
      description: err.response?.data?.message || "Unable to logout. Please try again.",
    });
    }
  };
  
  
    const sendResetLink = async (email) => {
      setLoading(true);
      try {
        await apiRequest.post("/auth/forgot-password", { email });
        setIsSubmitted(true);
        toast({
          variant: "secondary",
          title: "Reset Link Sent",
          description: "Check your inbox for instructions to reset your password.",
        });
        return true;
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Failed to Send Reset Link",
          description: err.response?.data?.message || "Something went wrong. Please try again.",
        });
        return false;
      } finally {
        setLoading(false);
      }
    };
  
  
  
    const resetPassword = async (token, password) => {
      setLoading(true);
      try {
        await apiRequest.post(`/auth/reset-password/${token}`, { password });
        toast({
          variant: "secondary",
          title: "Password Reset Successful",
          description: "Your password has been updated successfully.",
        });
        navigate("/login");
        return true;
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Password Reset Failed",
          description: err.response?.data?.message || "Failed to reset password. Please try again.",
        });
        return false;
      } finally {
        setLoading(false);
      }
    };
 


  return { register, sendResetLink,isSubmitted, resetPassword, login, verifyEmail, logout: logoutUser, loading ,sellerBrand,BrandLoading};
};