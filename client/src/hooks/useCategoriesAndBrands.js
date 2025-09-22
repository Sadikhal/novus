import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';

export const useFetchCategoriesAndBrands = () => {
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [brandResponse, categoryResponse] = await Promise.all([
          apiRequest.get('/brand'),
          apiRequest.get('/category')
        ]);

        setBrands(brandResponse.data.brands || []);
        setCategories(categoryResponse.data.categories || []);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || "Error fetching data");
        console.log(err)
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, brands, isLoading, error };
};
