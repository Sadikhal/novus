import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';

export default function useBanners() {
  const [banners, setBanners] = useState({ 
    categories: [], 
    products: [], 
    error: null, 
    loading: true 
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [products, categories] = await Promise.all([
          apiRequest.get('/banner/product'),
          apiRequest.get('/banner/category')
        ]);

        setBanners({
          categories: categories.data || [],
          products: products.data || [],
          loading: false,
          error: null
        });
      } catch (error) {
        setBanners(prev => ({
          ...prev,
          error: error?.message || "Error fetching data",
          loading: false
        }));
        console.log(error)
      }
    };

    fetchData();
  }, []);

  return banners;
}