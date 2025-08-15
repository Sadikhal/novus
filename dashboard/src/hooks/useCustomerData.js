import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";

export default function useCustomerData() {
  // State for customer data
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  
  // Common state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");

 useEffect(() => {
  const fetchCustomers = async () => {
      setLoading(true);
      try {
        const res = await apiRequest.get("/users", { 
          params: { sort: sortOrder } 
        });
        setCustomers(res.data || []);
        setFilteredCustomers(res.data || []);
      } catch (err) {
        setError(err.message || "Error fetching customer data");
      } finally {
        setLoading(false);
      }
    };
  fetchCustomers();
  }, [sortOrder]);





  // Fetch single customer with all related data
  const fetchCustomer = async (id) => {
    setLoading(true);
    try {
      const [customerRes, statsRes] = await Promise.all([
        apiRequest.get(`/users/${id}`, { params: { sort: sortOrder } }),
        apiRequest.get(`/stats/customer-stats/${id}`)
      ]);
      
      setCustomer(customerRes.data?.user || null);
      const ordersData = customerRes.data?.orders || [];
      setOrders(ordersData);
      setFilteredOrders(ordersData);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error fetching customer data");
    } finally {
      setLoading(false);
    }
  };

  // Search handler
  const handleSearchOrders = (term) => {
    const filtered = filteredItems(orders, term);
    setFilteredOrders(filtered);
  };

  const handleSearchCustomers = (term) => {
    const filtered = filteredItems(customers, term);
    setFilteredCustomers(filtered);
  };
  // Sort handler
  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };


  
  
  // Update order in local state
  const updateLocalOrder = (orderId, updatedData) => {
    setOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
    setFilteredOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
  };

  // Delete order from local state
  const deleteLocalOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
    setFilteredOrders(prev => prev.filter(order => order._id !== orderId));
  };




  // Update customer
  const updateCustomer = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/users/update/${id}`, updatedData);
      
      setCustomer(prev => ({ ...prev, ...res.data }));
      
      toast({
        variant: "success",
        title: "Customer updated successfully",
        description: "Your changes have been saved"
      });
      
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Update failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    filteredCustomers,
    customer,
    orders,
    stats,
    filteredOrders,
    error,
    loading,
    sortOrder,
    fetchCustomer,
    handleSearchOrders,
    handleSearchCustomers,
    handleSort,
    setSortOrder,
    updateCustomer,
    updateLocalOrder,
    deleteLocalOrder
  };
}