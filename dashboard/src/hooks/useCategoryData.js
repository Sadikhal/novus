// hooks/useCategoryData.js
import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { toast } from "../redux/useToast";

export default function useCategoryData() {
  const [categoryData, setCategoryData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get('/category');
        setCategoryData(res.data.categories || []);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching category data");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleDelete = async (id) => {
    try {
      await apiRequest.delete(`/category/${id}`);
      setCategoryData(prev => prev.filter(item => item._id !== id));
      
      toast({
        variant: "success",
        title: "Category deleted successfully",
        description: "Category has been removed"
      });
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Delete failed");
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later"
      });
      return false;
    }
  };

  return {
    categoryData,
    error,
    loading,
    handleDelete
  };
}