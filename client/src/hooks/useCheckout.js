import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

export const useCheckout = () => {
   const { tempOrder, products: cartProducts } = useSelector((state) => state.cart);
  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  const address = useMemo(() => 
    currentUser?.addresses?.find(addr => addr?._id === currentUser?.defaultAddress),
    [currentUser]
  );

  const orderProducts = useMemo(() => 
    id && tempOrder ? [tempOrder] : cartProducts,
    [id, tempOrder, cartProducts]
  );

  const priceDetails = useMemo(() => {
    const totalPrice = orderProducts.reduce((total, item) => total + item.price * item.quantity, 0);
    const totalActualPrice = orderProducts.reduce((total, item) => total + item.actualPrice * item.quantity, 0);
    
    return {
      totalPrice,
      totalActualPrice,
      totalDiscount: totalActualPrice - totalPrice
    };
  }, [orderProducts]);

  return {
    address,
    orderProducts,
    priceDetails
  };
};