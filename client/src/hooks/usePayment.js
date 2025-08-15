import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { apiRequest } from '../lib/apiRequest';
import { clearTempOrder } from '../redux/cartSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from '../redux/useToast';

export const usePayment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { tempOrder } = useSelector((state) => state.cart);

  const handlePayment = async (orderProducts, address) => {
    if (!address) {
      toast({
        variant: "destructive",
        title: "Address Required",
        description: "Please select a delivery address to continue"
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest.post('/orders/create-payment-intent', {
        products: orderProducts,
        address
      });

      toast({
        variant: "tertiary",
        title: "Order Confirmed",
        description: "Your order is ready for payment processing"
      });
      
      if (tempOrder) dispatch(clearTempOrder());

      navigate('/dashboard/pay', {
        state: {
          products: orderProducts,
          clientSecret: res.data.clientSecret,
          address
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || "Payment error. Please try again.");
      console.log(err.response?.data?.message)
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: err.response?.data?.message || "We couldn't process your payment. Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  return { handlePayment, loading, error };
};