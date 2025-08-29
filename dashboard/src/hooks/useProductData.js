import { useState, useEffect, useCallback } from "react";
import { apiRequest } from "../lib/apiRequest";
import { filteredItems } from "../lib/utils";
import { toast } from "../redux/useToast";
import { useSelector } from "react-redux";


const formatProductData = (product) => {
  if (!product) return null;
  
  return {
    ...product,
    brandId: product.brandId?._id || product.brandId || '',
    category: product.category?.map(c => c._id || c) || [],
    color: product.color || [],
    image: product.image || [],
    features: product.features || [],
    desc: product.desc || '',
    size: product.size || '',
    isAvailable: product.isAvailable !== undefined ? product.isAvailable : true
  };
};

export default function useProductData(role) {
  const [productData, setProductData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("newest");
  const [singleProduct, setSingleProduct] = useState(null);
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState(null);
    const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const fetchAllProducts = useCallback(async () => {
    setLoading(true);
    try {
      const url = currentUser?.isAdmin? '/product' : '/product/seller';
      const res = await apiRequest.get(url, { 
        params: { sort: sortOrder } 
      });
      
      const formattedProducts = res.data.products?.map(formatProductData) || [];
      setProductData(formattedProducts);
      setFilteredData(formattedProducts);
    } catch (err) {
      setError(err.message || "Error fetching product data");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products"
      });
    } finally {
      setLoading(false);
    }
  }, [sortOrder, role, toast]);

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const fetchProduct = useCallback(async (id) => {
    setSingleLoading(true);
    try {
      const res = await apiRequest.get(`/product/${id}`);
      const formattedProduct = formatProductData(res.data.product);
      setSingleProduct(formattedProduct);
      return formattedProduct;
    } catch (err) {
      setSingleError(err.message || "Error fetching product");
      throw err;
    } finally {
      setSingleLoading(false);
    }
  }, []);


    const fetchProductData = useCallback(async (id) => {
    setLoading(true);
    try {
      const [productRes, statsRes] = await Promise.all([
        apiRequest.get(`/product/seller/${id}`, { params: { sort: sortOrder } }),
        apiRequest.get(`/stats/product-stats/${id}`)
      ]);
      
      setProduct(productRes.data?.product || null);
      setBrand(productRes.data?.brand || null);
      setOrders(productRes.data?.orders || []);
      setFilteredOrders(productRes.data?.orders || []);
      setStats(statsRes.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error fetching product data");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || err.message
      });
    } finally {
      setLoading(false);
    }
  }, [sortOrder]);

  const handleSearchOrders = useCallback((term) => {
    const filtered = orders.filter(order => 
      order._id.toLowerCase().includes(term.toLowerCase()) ||
      order.status.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredOrders(filtered);
  }, [orders]);

  const updateLocalOrder = useCallback((orderId, updatedData) => {
    setOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
    setFilteredOrders(prev => 
      prev.map(order => order._id === orderId ? { ...order, ...updatedData } : order)
    );
  }, []);

  const deleteLocalOrder = useCallback((orderId) => {
    setOrders(prev => prev.filter(order => order._id !== orderId));
    setFilteredOrders(prev => prev.filter(order => order._id !== orderId));
  }, []);



  const handleSearch = useCallback((term) => {
    const filtered = filteredItems(productData, term);
    setFilteredData(filtered);
  }, [productData]);

  const handleSort = useCallback(() => {
    setSortOrder(prev => prev === "newest" ? "oldest" : "newest");
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await apiRequest.delete(`/product/${id}`);
      setProductData(prev => prev.filter(item => item._id !== id));
      setFilteredData(prev => prev.filter(item => item._id !== id));
      
      toast({
        variant: "success",
        title: "Success",
        description: "Product deleted successfully"
      });
      return true;
    } catch (err) {
      setError(err.message || "Delete failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete product"
      });
      return false;
    }
  }, [toast]);

  const createProduct = useCallback(async (productData) => {
    try {
      setLoading(true);
      const res = await apiRequest.post('/product', productData);
      const formattedProduct = formatProductData(res.data);
      
      setProductData(prev => [formattedProduct, ...prev]);
      setFilteredData(prev => [formattedProduct, ...prev]);
      
      toast({
        variant: "success",
        title: "Success",
        description: "Product created successfully"
      });
      return formattedProduct;
    } catch (err) {
      setError(err.message || "Create failed");
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.message || "Failed to create product"
      });
      throw err;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateProduct = useCallback(async (id, productData) => {
    try {
      setLoading(true);
      const res = await apiRequest.put(`/product/${id}`, productData);
      const formattedProduct = formatProductData(res.data);
      
      setProductData(prev => 
        prev.map(item => item._id === id ? formattedProduct : item)
      );
      setFilteredData(prev => 
        prev.map(item => item._id === id ? formattedProduct : item)
      );
      
      if (singleProduct?._id === id) {
        setSingleProduct(formattedProduct);
      }
      return formattedProduct;
    } catch (err) {
      setError(err.message || "Update failed");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [singleProduct, toast]);

  return {
    productData,
    filteredData,
    error,
    loading,
     product,
    brand,
    orders,
    filteredOrders,
    stats,
    sortOrder,
    setSortOrder,
    fetchProductData,
    handleSearchOrders,
    updateLocalOrder,
    deleteLocalOrder,
    singleProduct,
    singleLoading,
    singleError,
    fetchProduct,
    handleSearch,
    handleSort,
    handleDelete,
    createProduct,
    updateProduct,
    fetchProducts: fetchAllProducts
  };
}