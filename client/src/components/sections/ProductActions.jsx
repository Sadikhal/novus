import { TiShoppingCart } from "react-icons/ti";
import { MdSell } from 'react-icons/md';
import { IoChatboxEllipsesOutline, IoHeart } from 'react-icons/io5';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';


export const SecondaryProductActions = ({ isInWishlist, onWishlist, onMessage }) => (
  <div className='xl:pt-10 pt-7 flex flex-col sm:flex-row gap-5 items-center w-full'>
    <button 
      onClick={onWishlist}
      className={cn(
        'btn w-full capitalize border border-gray-200 text-lg text-[#27647e] placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 font-helvetica shadow-sm rounded-sm btn-outline font-semibold py-2 shadow-slate-300 flex flex-row gap-1 lg:gap-2 text-nowrap',
        isInWishlist ? 'flex-[1.2] lg:gap-1' : 'flex-1'
      )}
    >
      <div className={cn('bg-transparent text-xl', isInWishlist ? 'text-[#4a4744]' : 'text-[#123046]')}>
        <IoHeart />
      </div>
      <div>{isInWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}</div>
    </button>
    
    <button 
      onClick={onMessage}
      className='btn w-full capitalize flex-1 border border-gray-200 text-lg font-semibold text-[#125b41] placeholder-transparent bg-[#fff] focus:outline-none focus:border-slate-200 py-2  shadow-sm shadow-slate-300 rounded-sm btn-outline flex flex-row gap-1 lg:gap-2 items-center font-helvetica '
    >
      <IoChatboxEllipsesOutline className="mt-1 text-[#11473c]" />
      <span>chat to seller</span>
    </button>
  </div>
);

export const PrimaryProductActions = ({ onAddToCart, onBuyNow }) => (
  <div className='pt-4 sm:pt-7 md:pt-5 xl:pt-12 flex sm:flex-row sm:gap-5 gap-2 flex-col items-center w-full xl:w-full sm:w-[90%]'>
    <button 
      onClick={onAddToCart} 
      className='btn w-full bg-transparent border-2 border-[#116059] sm:btn-wide flex-1 uppercase text-[#206883] text-[18px] font-[700] cursor-pointer tracking-wide  hover:border-none font-helvetica flex flex-row gap-2 hover:bg-[#206883] hover:text-lamaWhite py-2'
    >
      <span><TiShoppingCart /></span>
      <span>add to bag</span>
    </button>
    <Button 
      onClick={onBuyNow}
      className='bg-[#208328] border-none flex-1 uppercase w-full text-lamaWhite text-[18px] font-[700] hover:bg-[#1d420c] h-auto min-h-12 font-helvetica flex flex-row gap-2 cursor-pointer'
    >
      <span><MdSell /></span>
      <span>Buy Now</span>
    </Button>
  </div>
);