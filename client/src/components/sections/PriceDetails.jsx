import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

const PriceDetails = ({ 
  items, 
  totalPrice, 
  totalDiscount, 
  onPlaceOrder, 
  isCheckout ,
  loading
}) => {
  return (
    <div className="bg-white p-4 mt-2 rounded-md lg:sticky lg:top-0 lg:w-[400px] text-[#1e1b1b]">
      <h3 className="font-bold border-b border-[#c0c2bf] border-t py-4">
        Price Details ({items.length} items)
      </h3>
      
      <div className="space-y-3 py-4 border-[#c0c2bf] border-b text-sm sm:text-base">
        <div className="flex justify-between">
          <span>Total MRP</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Discount on MRP</span>
          <span className="text-teal-700">-₹{totalDiscount.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span>Platform Fee</span>
          <span className="text-teal-700">Free</span>
        </div>
        
        <div className="flex justify-between pb-4">
          <span>Shipping Fee</span>
          <div className="flex gap-2">
            <span className="text-teal-700 line-through">₹78.00</span>
            <span>Free</span>
          </div>
        </div>
      </div>
      
      <div className="py-4">
        <div className="flex justify-between font-bold sm:text-lg text-base">
          <span>Total Amount</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>
        
        {isCheckout ? (
          <Button
            loading={loading}
            onClick={onPlaceOrder}
            className=" bg-[#714815] hover:bg-[#5a380f] text-white w-full mt-4 py-3 rounded-full uppercase tracking-wider transition-all text-sm sm:text-base"
          >
            Place Order
          </Button>
        ) : (
          <Link to="/dashboard/checkout">
            <button className="btn bg-[#714815] hover:bg-[#5a380f] text-white w-full mt-4 py-3 rounded-full uppercase tracking-wider transition-all text-sm sm:text-base">
              Proceed to Checkout
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default PriceDetails;