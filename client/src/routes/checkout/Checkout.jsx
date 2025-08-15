import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeItem } from '../../redux/cartSlice';
import AddressDetails from '../../components/sections/AddressDetails';
import CartItem from '../../components/sections/CartItem';
import PriceDetails from '../../components/sections/PriceDetails';
import { useCheckout } from '../../hooks/useCheckout';
import { usePayment } from '../../hooks/usePayment';

const Checkout = () => {
  const dispatch = useDispatch();
  const { address, orderProducts, priceDetails } = useCheckout();
  const { handlePayment, loading, error } = usePayment();

  return (
    <div className="bg-cartBg pt-6 pb-3 font-poppins">
      <div className="mx-2 border rounded-md border-lamaWhite">
        <div className="flex flex-col lg:flex-row gap-2">
          <div className='lg:flex-1 flex flex-col'>
            <div className="bg-lamaWhite w-full min-h-10 h-fit flex flex-col sm:flex-row items-center justify-between p-3">
              <div className="w-full sm:px-2">
                <span className="text-gray-700 font-robotos font-medium">Deliver To: </span>
                <span className="text-slate-950 text-sm font-semibold tracking-wider font-poppins capitalize">
                  {address?.name} - {address?.pincode}
                </span>
                
                {address ? (
                  <div className='flex flex-col gap-1 w-full'>
                    <p className="text-black text-xs font-normal font-poppins capitalize">
                      {address.address1}, {address.address2}, {address.state}, {address.city}-{address.pincode}
                    </p>
                    <p className="text-black text-sm font-medium tracking-wider font-poppins capitalize">
                      {address.number} 
                    </p>
                  </div>
                ) : (
                  <p className='text-slate-500 italic'>No Address Selected</p>
                )}
              </div>
              <div className='mt-2 sm:mt-0'>
                <AddressDetails initialAddress={address} />
              </div>
            </div>

            <div className="bg-lamaWhite w-full p-3 mt-2">
              {orderProducts.length > 0 ? (
                orderProducts.map((item) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    showQuantity={!item.isTemp}
                    onRemove={() => dispatch(removeItem(item.id))}
                  />
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-lg text-slate-700">Your cart is empty</p>
                  <Link 
                    to="/products" 
                    className="text-teal-700 hover:underline mt-2 inline-block"
                  >
                    Continue shopping
                  </Link>
                </div>
              )}
            </div>
          </div> 
          
          {orderProducts.length > 0 && (   
            <PriceDetails 
              loading={loading}
              error={error}
              items={orderProducts}
              totalPrice={priceDetails.totalPrice}
              totalDiscount={priceDetails.totalDiscount}
              onPlaceOrder={() => handlePayment(orderProducts, address)}
              isCheckout={true}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;