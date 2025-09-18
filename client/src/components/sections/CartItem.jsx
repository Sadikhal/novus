import { RiDeleteBin6Fill } from 'react-icons/ri';
import { useDispatch } from 'react-redux';
import { decreaseQuantity, increaseQuantity } from '../../redux/cartSlice';
import { Link } from 'react-router-dom';


const CartItem = ({ item, onRemove, showQuantity = true }) => {
  const dispatch = useDispatch();

  return (
    <div className="border border-gray-300 rounded-md mb-3 p-4">
      <div className="flex gap-4">
        <div className="flex-[0.3]">
          <Link to={`/product/${item.id}`}>
            <img 
              src={item.image} 
              alt={item.name}
              className="object-cover rounded-md h-28 w-28"
            />
          </Link>
          
          {showQuantity && (
            <div className="flex items-center gap-1 mt-2 text-[#171212]">
              <button
                onClick={() => dispatch(decreaseQuantity(item.id))}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="w-10 flex items-center justify-center h-6 border border-gray-300 rounded-md">
                {item.quantity}
              </span>
              <button
                onClick={() => dispatch(increaseQuantity(item.id))}
                className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-end">
            <button 
              onClick={onRemove}
              className="text-teal-700"
              aria-label="Remove item"
            >
              <RiDeleteBin6Fill />
            </button>
          </div>
          
          <div className="flex flex-col gap-2 mt-1">
            <Link to={`/product/${item.id}`}>
              <h3 className="sm:font-bold font-semibold text-gray-900 truncate text-wrap text-sm md:text-base">
                {item.name}
              </h3>
            </Link>
             {item.size && (
              <div className="text-xs text-gray-700">
                <span className="font-semibold ">Size : </span>{item.size}
              </div>
            )}
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-800 text-xs sm:text-sm">
                ₹{item.price.toFixed(2)}
              </span>
              
              {item.price < item.actualPrice && (
                <>
                  <span className="text-red-600 line-through text-[10px] sm:text-xs">
                    ₹{item.actualPrice.toFixed(2)}
                  </span>
                  <span className="text-[#c75b30] text-xs sm:text-sm">
                    {item.offer}% off
                  </span>
                </>
              )}
            </div>
            
            <div className="text-xs sm:text-sm text-gray-700">
              <span className="font-bold text-teal-800">14 days</span> return available
            </div>
            
            <div className="text-xs sm:text-sm text-gray-700">
              Delivery in <span className="font-bold text-teal-800">{item.deliveryDays} days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;