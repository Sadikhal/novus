import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  addToWishlist, 
  removeFromWishlist 
} from '../redux/wishlistSlice';
import { 
  addToCart, 
  setTempOrder,
} from '../redux/cartSlice';
import { apiRequest } from '../lib/apiRequest';
import { toast } from '../redux/useToast';

export const useUserActions = (product = null) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const wishlist = useSelector((state) => state.wishlist.items);
  
  const isInWishlist = wishlist.some(item => item._id === product?._id);

  const requireAuth = (action) => {
    if (!currentUser) {
      navigate('/login', { state: { from: location }, replace: true });
      return false;
    }
    return action();
  };

  const handleAddToCart = (selectedSize) => {
    if (!product) return;
    
    const action = () => {
      dispatch(addToCart({
        id: product._id,
        name: product.name,
        price: product.sellingPrice || product.actualPrice,
        actualPrice: product.actualPrice,
        offer: product.discount,
        image: product.image[0],
        deliveryDays: product.deliveryDays,
        quantity: 1,
        size: selectedSize
      }));
      toast({
        variant: "secondary",
        title: "Added to cart",
        description: "Item added to your cart!",
      });
    };
    
    return requireAuth(action);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    const action = () => {
      if (isInWishlist) {
        dispatch(removeFromWishlist(product._id));
      } else {
        dispatch(addToWishlist(product));
      }
      toast({
        variant: "secondary",
        title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        description: isInWishlist ? "Item removed from your wishlist." : "Item added to your wishlist.",
      });
    };
    
    return requireAuth(action);
  };

  const handleBuyNow = (selectedSize) => {
    if (!product) return;
    
    const action = () => {
      dispatch(setTempOrder({
        id: product._id,
        name: product.name,
        price: product.sellingPrice || product.actualPrice,
        actualPrice: product.actualPrice,
        offer: product.discount,
        image: product.image[0],
        deliveryDays: product.deliveryDays,
        quantity: 1,
        size: selectedSize
      }));
      navigate(`/dashboard/checkout/${product._id}`);
    };
    
    return requireAuth(action);
  };

 const handleMessageSubmit = (receiverId, url = 'chat') => {
    if (!receiverId) return;
    const action = async () => {
      try {
        const response = await apiRequest.post("/conversation", { receiverId });
        const convId = response.data?.conversation?._id;
        navigate(`/dashboard/${url}/${convId}`);
      } catch (error) {
        console.error("Error creating conversation:", error);
        toast({
          variant: "destructive",
          title: "Failed to start conversation",
          description: error.response?.data?.message || error.message || "Please try again later.",
        });
      }
    };

    return requireAuth(action);
  };

  return {
    isInWishlist,
    handleAddToCart,
    handleWishlist,
    handleBuyNow,
    handleMessageSubmit
  };
};