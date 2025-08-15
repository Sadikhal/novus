
import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";
import { useSelector } from "react-redux";

export default function useSellerData() {
  // State for brand list
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [brand, setBrand] = useState(null);
  const [sellerBrand, setSellerBrand] = useState(null);
  
  // State for single brand
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [rating, setRating] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // Common state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const {currentUser} = useSelector((state) => state.user)


   useEffect(() => {
  const fetchBrands = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await apiRequest.get("/brand", { 
        params: { sort: sortOrder } 
      });
      setBrands(res.data?.brands || []);
      setFilteredBrands(res.data?.brands || []);
      console.log(res.data.brands)
    } catch (err) {
      setError("Error fetching brands data");
    } finally {
      setLoading(false);
    }
  };
   fetchBrands();
  }, [sortOrder]);
 

  const fetchBrand = async (id) => {
    setLoading(true);
    try {
      const [brandRes, statsRes] = await Promise.all([
        apiRequest.get(`/brand/${id}`, { params: { sort: sortOrder } }),
        apiRequest.get(`/stats/brand-dashboard/${id}`)
      ]);
      setBrand(brandRes.data?.brand || null);
      setProducts(brandRes.data?.products || []);
      setFilteredProducts(brandRes.data?.products || []);
      setOrders(brandRes.data?.orders || []);
      setFilteredOrders(brandRes.data?.orders || []);
      setRating(brandRes.data?.performance || null);
      console.log("brand details",brandRes.data.brand)
      setStats(statsRes.data || null);
    } catch (err) {
      setError("Failed to load brand stats");
    } finally {
      setLoading(false);
    }
  };



  useEffect(() => {
      const fetchSellerBrand = async () => {
        setLoading(true)
        try {
          const response = await apiRequest.get('/brand/seller');
          setSellerBrand(response.data.brand);
          console.log('brand',response.data.brand)
        } catch (err) {
          setError(err.message);
          console.error("Failed to load brand stats");
        }finally{
          setLoading(false)
        }
      };
  
      fetchSellerBrand();
    }, [currentUser._id]);


  const handleSearchBrands = (term) => {
    const filtered = filteredItems(brands, term);
    setFilteredBrands(filtered);
  };

  const handleSearchProducts = (term) => {
    const filtered = filteredItems(products, term);
    setFilteredProducts(filtered);
  };

  const handleSearchOrders = (term) => {
    const filtered = filteredItems(orders, term);
    setFilteredOrders(filtered);
  };

  const handleSort = () => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  };


  
  const updateLocalOrder = (orderId, updatedData) => {
    setOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
    setFilteredOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
  };

  const deleteLocalOrder = (orderId) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
    setFilteredOrders(prev => prev.filter(order => order._id !== orderId));
  };

  const createBrand = async (brandData) => {
    try {
      setLoading(true);
      const res = await apiRequest.post("/brand", brandData);
      setBrands(prev => [res.data?.brand, ...prev]);
      setFilteredBrands(prev => [res.data?.brand, ...prev]);
      
      toast({
        variant: "success",
        title: "Brand created successfully",
        description: "New brand has been added"
      });
      
      return res.data?.brand;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
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

  const updateBrand = async (id, updatedData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/brand/${id}`, updatedData);
      
      // Update in brands list if needed
      setBrands(prev => 
        prev.map(brand => brand._id === id ? res.data?.brand : brand)
      );
      setFilteredBrands(prev => 
        prev.map(brand => brand._id === id ? res.data?.brand : brand)
      );
      if (brand?._id === id) {
        setBrand(res.data?.brand);
      }
      
      toast({
        variant: "success",
        title: "Brand updated successfully",
        description: "Your changes have been saved"
      });
      
      return res.data?.brand;
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

  const deleteBrand = async (id) => {
    try {
      setLoading(true);
      await apiRequest.delete(`/brand/${id}`);
      
      setBrands(prev => prev.filter(brand => brand._id !== id));
      setFilteredBrands(prev => prev.filter(brand => brand._id !== id));
      
     
      if (brand?._id === id) {
        setBrand(null);
      }
      
      toast({
        variant: "success",
        title: "Brand deleted successfully",
        description: "Brand has been removed"
      });
      
      return true;
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    brands,
    filteredBrands,
    
    //
    brand,
    products,
    orders,
    stats,
    rating,
    filteredProducts,
    filteredOrders,
    
    error,
    loading,
    sortOrder,
    
   
    fetchBrand,
    
    handleSearchBrands,
    handleSearchProducts,
    handleSearchOrders,
    
    handleSort,
    setSortOrder,
    
    createBrand,
    updateBrand,
    deleteBrand,
    
    updateLocalOrder,
    deleteLocalOrder
  };
}