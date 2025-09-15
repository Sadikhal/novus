// import { useState, useEffect } from 'react';
// import { AiFillHeart } from "react-icons/ai";
// import { useDispatch, useSelector } from 'react-redux';
// import { Link, useNavigate } from 'react-router-dom';
// import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';

// const ListingCard = ({ data, showWishlist, type }) => { 
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const wishlistItems = useSelector((state) => state.wishlist.items);  
//   const isInWishlist = wishlistItems.some((item) => item?._id === data?._id);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isHovered, setIsHovered] = useState(false);

//   useEffect(() => {
//     let interval;
//     if (isHovered && data?.image?.length > 1) {
//       interval = setInterval(() => {
//         setCurrentImageIndex(prev => (prev + 1) % data?.image.length);
//       }, 1000);
//     }
//     return () => {
//       clearInterval(interval);
//       if (!isHovered) setCurrentImageIndex(0);
//     };
//   }, [isHovered, data?.image?.length]);

//   const handleWishlist = (e) => {
//     e.preventDefault();
//     if (isInWishlist) {
//       dispatch(removeFromWishlist(data?._id));
//     } else {
//       dispatch(addToWishlist(data));
//     }
//   };


//   return type === 'category' ? (
//     <Link to= {data?.url} 
//       className='flex flex-col gap-1 items-center cursor-pointer group col-span-1 py-3 h-full'
//     >
//       <div className='relative overflow-hidden w-full transition duration-0'>
//         <img 
//           className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110"
//           src={data?.image || "/no-image.png"}
//           alt="Listing"
//         />
//       </div>
//       <div className="md:text-[14px] text-[12px] font-assistant capitalize text-[#405150] overflow-hidden whitespace-nowrap px-2 pt-2 font-medium">
//         {data?.name}
//       </div>
//       <div className="font-bold md:text-[16px] text-[14px] text-[#282c3f] whitespace-nowrap font-assistant overflow-hidden px-2 -mt-1 text-wrap">
//         {data?.title}
//       </div>
//     </Link>
//   ) : (
//     <Link 
//       to={`/product/${data?._id}`}  
//       className="col-span-1 cursor-pointer w-full group relative border rounded-xl flex flex-col pb-1"
//     >
//       <div className="w-full transition duration-0">
//         <div className="flex flex-col w-full">
//           <div 
//             className="relative overflow-hidden rounded-xl"
//             onMouseEnter={() => setIsHovered(true)}
//             onMouseLeave={() => setIsHovered(false)}
//           >
//             <img 
//               className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110"
//               src={data?.image[currentImageIndex] || '/no-image.png'}
//               alt="Listing"
//             />
            
//             {data?.image?.length > 1 && (
//               <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
//                 {data?.image?.map((_, index) => (
//                   <div
//                     key={index}
//                     className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
//                       index === currentImageIndex 
//                         ? 'bg-white scale-125' 
//                         : 'bg-white/50 scale-100'
//                     }`}
//                   />
//                 ))}
//               </div>
//             )}
//           </div>
          
//           <div className="font-semibold sm:text-[15px] text-[13px] text-[#282c3f]  whitespace-nowrap font-poppins overflow-hidden px-2 pt-2 capitalize">
//             {data?.name}
//           </div>
          
//           <div className="sm:text-[14px] text-[12px] font-assistant capitalize text-[#535766] overflow-hidden whitespace-nowrap px-2 font-semibold">
//             {data?.brand}
//           </div>
          
//           <div className="flex flex-row gap-2 text-left items-baseline px-2 overflow-hidden">
//             {data?.discount ? (
//               <>
//                 <del className="font- sm:font-semibold text-[#7e818c] font-assistant sm:text-[12px] text-[10px] whitespace-nowrap">
//                   R.S {data?.actualPrice}
//                 </del>
//                 <div className="font-bold font-assistant sm:text-[14px] text-[12px] text-slate-950 whitespace-nowrap">
//                   R.S {data?.sellingPrice}
//                 </div>
//                 <div className="font-medium font-assistant sm:text-[12px] text-[#ff5722] whitespace-nowrap text-[10px]">
//                   {data?.discount}% off
//                 </div>
//               </>
//             ) : (
//               <div className="font-bold font-assistant text-[14px] text-slate-950 whitespace-nowrap">
//                 R.S {data?.sellingPrice}
//               </div>
//             )}
//           </div>
//         </div>
        

//         {showWishlist && (
//           <div className="w-full h-20 bg-white absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
//             <button
//               onClick={handleWishlist}
//               className="border flex flex-row gap-2 mt-2 justify-center items-center w-[95%] p-1 px-4 mx-auto"
//             >
//               <AiFillHeart
//                 size={20}
//                 className={isInWishlist ? "fill-slate-400" : "fill-rose-500"}
//               />
//               <div className="text-[14px] font-bold text-slate-950 font-assistant uppercase">
//                 {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
//               </div>
//             </button>

//             {data.size && (
//               <div className='flex flex-row pt-2'>
//                 <div className="font-assistant text-[#3e424f] text-[14px] font-normal text-start px-2 -mt-[2px] text-nowrap h-full">
//                   Sizes :
//                 </div>
//                 <div className="flex flex-row gap-2 items-center w-full flex-wrap">
//                   {data.size.map((item, index) => (
//                     <div
//                       key={index}
//                       className="text-[12px] capitalize text-[#535766] text-nowrap"
//                     >
//                       {item}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//           )}

//       </div>

//       {data?.offer && (
//         <div className='text-[#ff5722] font-bold font-assistant text-[12px] px-2 mt-2'>
//           only few left
//         </div>
//       )}
//     </Link>
//   );
// }

// export default ListingCard;

import { useState, useEffect } from 'react';
import { AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToWishlist, removeFromWishlist } from '../../redux/wishlistSlice';
import { motion } from 'framer-motion'; // Added import
import { itemVariants, textVariants } from '../../lib/motion'; // Added import

const ListingCard = ({ data, showWishlist, type }) => { 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlistItems = useSelector((state) => state.wishlist.items);  
  const isInWishlist = wishlistItems.some((item) => item?._id === data?._id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    let interval;
    if (isHovered && data?.image?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % data?.image.length);
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      if (!isHovered) setCurrentImageIndex(0);
    };
  }, [isHovered, data?.image?.length]);

  const handleWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(data?._id));
    } else {
      dispatch(addToWishlist(data));
    }
  };

  return type === 'category' ? (
    <motion.div>
      <Link 
        to={data?.url} 
        className='flex flex-col gap-1 items-center cursor-pointer group col-span-1 py-3 h-full'
      >
        <div className='relative overflow-hidden w-full transition duration-0'>
          <motion.img 
            className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110"
            src={data?.image || "/no-image.png"}
            alt="Listing"
            loading="lazy"
            variants={itemVariants}
          />
        </div>
        <motion.span className="md:text-[14px] text-[12px] font-assistant capitalize text-[#405150] overflow-hidden whitespace-nowrap px-2 pt-2 font-medium"
        variants={textVariants}>
          {data?.name}
        </motion.span>
        <div className="font-bold md:text-[16px] text-[14px] text-[#282c3f] whitespace-nowrap font-assistant overflow-hidden px-2 -mt-1 text-wrap">
          {data?.title}
        </div>
      </Link>
    </motion.div>
  ) : (
    <motion.div variants={itemVariants}> {/* Added motion.div */}
      <Link 
        to={`/product/${data?._id}`}  
        className="col-span-1 cursor-pointer w-full group relative border rounded-xl flex flex-col pb-1"
      >
        <div className="w-full transition duration-0">
          <div className="flex flex-col w-full">
            <div 
              className="relative overflow-hidden rounded-xl"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img 
                className="aspect-square object-cover w-full duration-500 transition-transform group-hover:scale-110"
                src={data?.image[currentImageIndex] || '/no-image.png'}
                alt="Listing"
              />
              
              {data?.image?.length > 1 && (
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
                  {data?.image?.map((_, index) => (
                    <div
                      key={index}
                      className={`w-[6px] h-[6px] rounded-full transition-all duration-300 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 scale-100'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="font-semibold sm:text-[15px] text-[13px] text-[#282c3f] whitespace-nowrap font-poppins overflow-hidden px-2 pt-2 capitalize">
              {data?.name}
            </div>
            
            <div className="sm:text-[14px] text-[12px] font-assistant capitalize text-[#535766] overflow-hidden whitespace-nowrap px-2 font-semibold">
              {data?.brand}
            </div>
            
            <div className="flex flex-row gap-2 text-left items-baseline px-2 overflow-hidden">
              {data?.discount ? (
                <>
                  <del className="font- sm:font-semibold text-[#7e818c] font-assistant sm:text-[12px] text-[10px] whitespace-nowrap">
                    R.S {data?.actualPrice}
                  </del>
                  <div className="font-bold font-assistant sm:text-[14px] text-[12px] text-slate-950 whitespace-nowrap">
                    R.S {data?.sellingPrice}
                  </div>
                  <div className="font-medium font-assistant sm:text-[12px] text-[#ff5722] whitespace-nowrap text-[10px]">
                    {data?.discount}% off
                  </div>
                </>
              ) : (
                <div className="font-bold font-assistant text-[14px] text-slate-950 whitespace-nowrap">
                  R.S {data?.sellingPrice}
                </div>
              )}
            </div>
          </div>

          {showWishlist && (
            <div className="w-full h-20 bg-white absolute bottom-0 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlist}
                className="border flex flex-row gap-2 mt-2 justify-center items-center w-[95%] p-1 px-4 mx-auto"
              >
                <AiFillHeart
                  size={20}
                  className={isInWishlist ? "fill-slate-400" : "fill-rose-500"}
                />
                <div className="text-[14px] font-bold text-slate-950 font-assistant uppercase">
                  {isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                </div>
              </button>

              {data.size && (
                <div className='flex flex-row pt-2'>
                  <div className="font-assistant text-[#3e424f] text-[14px] font-normal text-start px-2 -mt-[2px] text-nowrap h-full">
                    Sizes :
                  </div>
                  <div className="flex flex-row gap-2 items-center w-full flex-wrap">
                    {data.size.map((item, index) => (
                      <div
                        key={index}
                        className="text-[12px] capitalize text-[#535766] text-nowrap"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {data?.offer && (
          <div className='text-[#ff5722] font-bold font-assistant text-[12px] px-2 mt-2'>
            only few left
          </div>
        )}
      </Link>
    </motion.div>
  );
}

export default ListingCard;