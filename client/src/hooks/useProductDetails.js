import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';

export const useProductDetails = (productId) => {
  const [productDetails, setProductDetails] = useState({
    product: null,
    similarProducts: [],
    brand : null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiRequest.get(`/product/${productId}`);
        setProductDetails({
          product: response.data.product,
          similarProducts: response.data.similarProducts,
          brand: response.data.brand,
          loading: false,
          error: null
        });
      } catch (error) {
        setProductDetails(prev => ({
          ...prev,
          loading: false,
          error: "Something went wrong while fetching the product."
        }));
      }
    };
    
    fetchData();
  }, [productId]);

  return productDetails;
};
