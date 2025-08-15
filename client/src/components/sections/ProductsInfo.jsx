import DOMPurify from 'dompurify';
import { FaShareFromSquare } from 'react-icons/fa6';
import SocialIcons from "../ui/SocialIcons"
import ProductSpecs from './ProductSpecs';
import { SecondaryProductActions } from './ProductActions';

export const ProductInfo = ({ product, isInWishlist, onWishlist, onMessage }) => (
  <div className='flex flex-col items-start'>
    <div className='text-slate-600 text-[13px] font-semibold font-robotos uppercase tracking-wide'>
      {product.brand}
    </div>
    <div className='text-[#162034] text-[28px] font-bold font-helvetica capitalize -mt-1'>
      {product.name}
    </div>
    
    <div className="flex flex-col items-start pt-1 xl:pt-2">
      {product.sellingPrice < product.actualPrice ? (
        <div className='flex flex-row gap-4 items-center'>
          <div className='text-[#63804b] text-[22px] font-bold tracking-wider  font-helvetica capitalize'>
            ${product?.sellingPrice}
          </div>
          <div className='text-[#454952] text-[20px] font-semibold tracking-wide font-helvetica uppercase'>
            <span className='line-through text-[16px]'>${product.actualPrice}</span>
          </div>
          <div className='text-[#a94a2d] text-[18px] font-semibold  font-helvetica'>
            {product.discount}% Off
          </div>
        </div>
      ) : (
        <div className='text-[#020305] text-[20px] font-[500] tracking-wider font-helvetica uppercase'>
          <span>MRP </span>
          <span>${product.actualPrice}</span>
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
    
    <div className='px-4 text-[#111111] text-[16px] font-medium font-helvetica tracking-wide pt-6'>
      <div className='flex flex-row gap-2'>
        Colour Shown: {product.color.join(', ')}
      </div>
      {product.size ? (
        <div>Size: {product.size}</div>
      ) : (
        <div>Brand: {product.brand}</div>
      )}
    </div>
    
    <div className='flex flex-row sm:gap-7 gap-5 items-center pt-4 px-3'>
      <div className='text-[#757e2e] text-[22px] font-medium tracking-wider  font-helvetica capitalize flex items-center gap-2 sm:gap-3 flex-row w-full md:pl-4 px-2 md:px-3'>
        <FaShareFromSquare /> 
        <span className='text-slate-800'>:</span>
      </div>
      <SocialIcons productName={product.name} />
    </div>
    
    <div 
      className='quill-content text-[#111111] pt-5 md:pt-6 text-[16px] font-[300] font-helvetica tracking-wide text-justify'
      dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.desc,sanitizeConfig) }}
    />
    
    <ProductSpecs product={product} features={product.features} />
  </div>
);


  export const sanitizeConfig = {
  ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
    'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div', 'span',
    'img', 'pre', 'u', 'font', 'table', 'thead', 'tbody', 'tr', 'td', 'th'],
  ALLOWED_ATTR: ['href', 'name', 'target', 'src', 'alt', 'style', 'class', 'width', 'height'],
};
