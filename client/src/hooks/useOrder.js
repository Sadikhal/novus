import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';


export const useOrderDetails = (orderId) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get(`/orders/${orderId}`);
        setOrder(res.data.order);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load order details');
      } finally {
        setLoading(false);
      }
    };
    
    if (orderId) fetchOrderDetails();
  }, [orderId]);

  return { order, loading, error };
};