import React, { useEffect } from 'react';

import { apiRequest } from '../lib/apiRequest';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const useOrdersData = (userId) => {
  const [data, setData] =useState({ metrics: {}, orders: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   

  useEffect(() => {
    const fetchOrders = async () => {
    setLoading(true);
      try {
        const res = await apiRequest.get(`/orders/user/${userId}`);
        setData({
          orders: res.data.orders || [],
          metrics: res.data.metrics || {}
        });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return { data, loading, error };
};
