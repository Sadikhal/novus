import { useState, useEffect } from 'react';
import { apiRequest } from '../lib/apiRequest';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../redux/userSlice';
import { toast } from '../redux/useToast';

export const useAddresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAddresses = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await apiRequest.get("/users/profile");
        const userData = res.data; 
        setAddresses(userData.addresses || []);
        dispatch(updateUser(userData)); 
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Failed to fetch addresses";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Failed to Load Addresses",
          description: errorMessage
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAddresses();
  }, [dispatch]);

  const updateDefaultAddress = async (addressId) => {
    if (!addressId) return false;
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest.put(`/users/update/${currentUser._id}`, {
        defaultAddress: addressId
      });
      
      dispatch(updateUser(res.data));
      
      toast({
        variant: "tertiary",
        title: "Delivery Address Updated",
        description: "Your default delivery address has been successfully set"
      });
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to update address";
      setError(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Address Update Failed",
        description: `Could not update delivery address: ${errorMessage}`
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const defaultAddress = addresses.find(
    addr => addr?._id === currentUser?.defaultAddress
  );

  return { 
    addresses, 
    defaultAddress,
    loading, 
    error, 
    updateDefaultAddress 
  };
};