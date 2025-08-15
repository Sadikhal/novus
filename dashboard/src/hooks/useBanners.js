// hooks/useBanners.js
import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';
import { toast } from '../redux/useToast';

export const useBanners = () => {
  const [state, setState] = useState({
    categories: [],
    products: [],
    loading: true,
    error: null,
    toggleLoading: false,
    deleteStates: {}
  });

  const fetchData = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      const [productsBanner, categoryBanner] = await Promise.all([
        apiRequest.get('/banner/product'),
        apiRequest.get('/banner/category')
      ]);
      setState(prev => ({
        ...prev,
        products: productsBanner.data || [],
        categories: categoryBanner.data || [],
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error?.message || "Error fetching data"
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  };

  const handleDeleteBanner = async (id, type) => {
    try {
      setState(prev => ({
        ...prev,
        deleteStates: { ...prev.deleteStates, [id]: true }
      }));
      
      await apiRequest.delete(`/banner/${type}/${id}`);
      
      setState(prev => ({
        ...prev,
        products: type === 'product' 
          ? prev.products.filter(banner => banner._id !== id)
          : prev.products,
        categories: type === 'category'
          ? prev.categories.filter(banner => banner._id !== id)
          : prev.categories
      }));
      
      toast({
        variant : "success",
        title : "Success",
       description : `${type} banner deleted successfully!`});
    } catch (error) {
      toast.error(`Failed to delete ${type} banner`);
      throw error;
    } finally {
      setState(prev => ({
        ...prev,
        deleteStates: { ...prev.deleteStates, [id]: false }
      }));
    }
  };

  const handleToggleActive = async (id, type, currentStatus) => {
    try {
      setState(prev => ({ ...prev, toggleLoading: true }));
      const response = await apiRequest.put(`/banner/${type}/${id}`, {
        isActive: !currentStatus
      });
      
      const updateBanner = (banners) => banners.map(banner => 
        banner._id === id ? response.data : banner
      );
      
      setState(prev => ({
        ...prev,
        products: type === 'product' ? updateBanner(prev.products) : prev.products,
        categories: type === 'category' ? updateBanner(prev.categories) : prev.categories
      }));
      toast({
        variant : "success",
       description : `Banner ${!currentStatus ? 'activated' : 'deactivated'} successfully!`});
    } catch (error) {
      toast(`Failed to update banner status`);
      throw error;
    } finally {
      setState(prev => ({ ...prev, toggleLoading: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    ...state,
    refetch: fetchData,
    handleDeleteBanner,
    handleToggleActive
  };
};