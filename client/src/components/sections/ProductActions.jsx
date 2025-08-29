import { TiShoppingCart } from "react-icons/ti";
import { MdSell } from 'react-icons/md';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';


export const SecondaryProductActions = ({ isInWishlist, onWishlist, onMessage }) => (
  <div className='pt-7 flex flex-col sm:flex-row gap-5 items-center w-full'>
    <button 
      onClick={onWishlist}
      className={cn(
        'btn w-full capitalize border border-gray-200 text-lg text-[#700b30] placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-robotos shadow-sm rounded-sm btn-outline font-semibold md:py-6  py-3 shadow-slate-300 flex flex-row gap-1 lg:gap-2 text-nowrap',
        isInWishlist ? 'flex-[1.2] lg:gap-1' : 'flex-1'
      )}
    >
      <div>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</div>
    </button>
    
    <button 
      onClick={onMessage}
      className='btn w-full capitalize flex-1 border border-gray-200 text-lg font-semibold text-[#700b30] placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 md:py-6 py-3 shadow-sm shadow-slate-300 rounded-sm btn-outline flex flex-row gap-1 lg:gap-2 items-center font-robotos '
    >
      <span>chat to seller</span>
    </button>
  </div>
);

export const PrimaryProductActions = ({ onAddToCart, onBuyNow }) => (
  <div className='pt-2 sm:pt-4 md:pt-8 lg:pt-0 xl:pt-12 flex sm:flex-row lg:flex-col xl:flex-row sm:gap-5 gap-2 flex-col items-center w-full'>
    <Button 
     variant = "ghost"
      onClick={onAddToCart} 
      className='bg-[#ffff] border-2  realtive border-[#066144] sm:flex-1 lg:w-full xl:w-auto sm:w-auto w-full uppercase text-[#066144] md:text-[18px] text-base font-[700] cursor-pointer tracking-wide  hover:border-none font-helvetica flex flex-row gap-2 hover:bg-[#077572] hover:text-lamaWhite h-auto min-h-12'
    >
      <span><TiShoppingCart /></span>
      <span>add to bag</span>
    </Button>
    <Button 
      variant = "ghost"
      onClick={onBuyNow}
      className='sm:flex-1 sm:w-auto w-full lg:w-full xl:w-auto uppercase text-[18px] text-base font-[700] h-auto min-h-12 font-helvetica flex flex-row gap-2 cursor-pointer'
    >
      <span><MdSell /></span>
      <span>Buy Now</span>
    </Button>
  </div>
);