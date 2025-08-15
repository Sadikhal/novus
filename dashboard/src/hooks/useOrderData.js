
import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";
import { useSelector } from "react-redux";

export default function useOrderData(role) {
  const [orderData, setOrderData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const {currentUser} = useSelector((state) => state.user)


  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const url = role === "admin" ? '/orders' : `/orders/seller/${currentUser._id}`;
        const res = await apiRequest.get(url, { 
          params: { sort: sortOrder } 
        });
        setOrderData(res.data.orders || []);
        setFilteredData(res.data.orders || []);
      } catch (err) {
        setError(err.message || "Error fetching order data");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [sortOrder, role]);

  const handleSearch = (term) => {
    const filtered = filteredItems(orderData, term);
    setFilteredData(filtered);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };

  const updateOrder = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/orders/${id}`, updatedData);
      
      if(res.data.order){
      setOrderData(prev => 
        prev.map(order => order._id === id ? res.data.order : order)
      );
      setFilteredData(prev => 
        prev.map(order => order._id === id ? res.data.order : order)
      );
    }
      toast({
        variant: "success",
        title: "Order updated successfully",
        description: "Your changes have been saved"
      });
      
      return res.data?.order;
    } catch (err) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await apiRequest.delete(`/orders/${id}`);
      setOrderData(prev => prev.filter(item => item._id !== id));
      setFilteredData(prev => prev.filter(item => item._id !== id));
      
      toast({
        variant: "success",
        title: "Order deleted successfully",
        description: "Order has been removed"
      });
      return true;
    } catch (err) {
      setError(err.message || "Delete failed");
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Please try again later"
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    orderData,
    filteredData,
    error,
    loading,
    handleSearch,
    handleSort,
    updateOrder,
    handleDelete,
    sortOrder
  };
}