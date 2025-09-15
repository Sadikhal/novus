// import React from 'react';
// import ListingCard from '../../components/ui/ListingCard';

// const HomeTrending = ({ title, listings, wishlist, type }) => {
//   return (
//     <div className='felx flex-col bg-[#fff] px-2 h-full py-2'>
//       <div className='text-[23px] font-assistant font-bold leading-[28px] text-slate-900 p-2 capitalize'>
//         {title}
//       </div>
//       <div>
//         <div 
//           className="px-2       
//             grid 
//             grid-cols-2 
//             gap-4
//             bg-[#fff] h-full"
//         >    
//           {listings?.map((listing) => (
//             <ListingCard
//               key={listing?._id}
//               data={listing}
//               showWishlist={wishlist}
//               type={type}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HomeTrending;

import ListingCard from '../../components/ui/ListingCard';
import { motion } from 'framer-motion'; // Added import
import { containerVariants } from '../../lib/motion'; // Added import

const HomeTrending = ({ title, listings, wishlist, type }) => {
  return (
    <div className='felx flex-col bg-[#fff] px-2 h-full py-2'>
      <div className='text-[23px] font-assistant font-bold leading-[28px] text-slate-900 p-2 capitalize'>
        {title}
      </div>
      <div>
        <motion.div 
          className="px-2 grid grid-cols-2 gap-4 bg-[#fff] h-full"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >    
          {listings?.map((listing) => (
            <ListingCard
              key={listing?._id}
              data={listing}
              showWishlist={wishlist}
              type={type}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default HomeTrending;