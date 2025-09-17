import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AddressDetails from '../../components/sections/AddressDetails';
import CartItem from '../../components/sections/CartItem';
import PriceDetails from '../../components/sections/PriceDetails';
import { removeItem } from '../../redux/cartSlice';
import { useCheckout } from '../../hooks/useCheckout';
import { usePayment } from '../../hooks/usePayment';


const Cart = () => {
  const dispatch = useDispatch();
   const { address, orderProducts, priceDetails } = useCheckout();
   const {  loading, error } = usePayment();

  return (
    <div className="bg-[#909c80] pt-6 pb-3 font-poppins">
      <div className="mx-2 border rounded-md border-lamawhite">
        <div className="bg-lamaWhite rounded-sm w-full min-h-10 h-fit flex flex-col sm:flex-row items-center justify-between p-2 sm:p-3">
          <div className="w-full">
            <span className="text-gray-700 font-robotos font-medium text-sm sm:text-base">Deliver To: </span>
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
            <p className='text-slate-500 italic sm:text-sm text-xs '>No Address Selected</p>
            )}
          </div>
          <AddressDetails initialAddress={address} />
        </div>

        <div className="flex flex-col lg:flex-row gap-3 mt-2">
          <div className="bg-lamaWhite rounded-sm w-full p-2 shadow-lg lg:flex-1">
            {orderProducts.length > 0 ? (
              orderProducts.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  onRemove={() => dispatch(removeItem(item.id))}
                />
              ))
            ) : (
              <div className="text-center py-10">
                <p className="text-lg text-slate-700">Your cart is empty</p>
                <Link 
                  to="/products" 
                  className="text-teal-700 hover:bg-slate-100 underline mt-2 inline-block p-2 px-4 hover:rounded-md"
                >
                  Continue shopping
                </Link>
              </div>
            )}
          </div>
          
          {orderProducts.length > 0 && (
            <PriceDetails 
              loading={loading}
            error={error}
              items={orderProducts}
             totalPrice={priceDetails.totalPrice}
            totalDiscount={priceDetails.totalDiscount}
              isCheckout={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;