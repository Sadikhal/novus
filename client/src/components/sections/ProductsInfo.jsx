import DOMPurify from 'dompurify';
import { FaShareFromSquare } from 'react-icons/fa6';
import SocialIcons from "../ui/SocialIcons"
import ProductSpecs from './ProductSpecs';
import { SecondaryProductActions } from './ProductActions';
import { sanitizeConfig } from '../../lib/utils';

export const ProductInfo = ({ product, isInWishlist, onWishlist, onMessage }) => (
  <div className='flex flex-col items-start'>
    <div className='text-slate-600 text-[13px] font-semibold font-robotos uppercase tracking-wide'>
      {product.brand}
    </div>
    <div className='text-[#162034] text-[25px] font-bold font-helvetica capitalize -mt-1'>
      {product.name}
    </div>
    
    <div className="flex flex-col items-start pt-1 xl:pt-2">
      {product.sellingPrice < product.actualPrice ? (
        <div className='flex flex-row gap-4 items-center'>
          <div className='text-[#292b28] text-[22px] font-bold tracking-wider  font-helvetica capitalize'>
            ₹{product?.sellingPrice}
          </div>
          <div className='text-[#454952] text-[20px] font-semibold tracking-wide font-helvetica uppercase'>
            <span className='line-through text-[16px]'>₹{product.actualPrice}</span>
          </div>
          <div className='text-[#a94a2d] text-[18px] font-semibold  font-helvetica'>
            {product.discount}% Off
          </div>
        </div>
      ) : (
        <div className='text-[#020305] text-[20px] font-[500] tracking-wider font-helvetica uppercase'>
          <span>MRP </span>
          <span>₹{product.actualPrice}</span>
        </div>
      )}
      <div className='text-[#367974] text-[15px] font-bold tracking-tight font-assistant -mt-1'>
        Inclusive of all taxes
      </div>
    </div>
    
    <SecondaryProductActions 
      isInWishlist={isInWishlist}
      onWishlist={onWishlist}
      onMessage={onMessage}
    />
    
    <div className='px-4 text-[#111111] text-[16px] font-medium font-helvetica tracking-wide pt-4'>
      <div className='flex flex-row gap-2'>
        <span className='font-medium font-robotos text-nowrap'>Colour Shown</span>: {product.color.join(', ')}
      </div>
      {product.size ? (
        <div><span className='font-medium font-robotos'>Size</span>: {product.size}</div>
      ) : (
        <div>Brand: {product.brand}</div>
      )}
    </div>
    
    <div 
      className='quill-content text-[#111111] text-[16px] font-[300] tracking-wide font-helvetica '
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.desc,sanitizeConfig) }}
    />
    
    <ProductSpecs product={product} features={product.features} />
  </div>
);


