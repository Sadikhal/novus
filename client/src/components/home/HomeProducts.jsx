// // HomeProducts.jsx
// import React from 'react'
// import ListingCard from '../ui/ListingCard'
// import { ScrollArea, ScrollBar } from '../ui/ScrollArea'
// import Heading from '../ui/Headings'

// const HomeProducts = ({ listings,wishlist,type,title,loading}) => {
//   return (
//     <>
//     <div className='py-2'>
//        <Heading title={title} listings={listings} loading = {loading} />
//     </div>
    
//     <ScrollArea 
//       orientation="horizontal" 
//       className="w-full px-2 bg-[#fffbfb] py-4"
//     >
//       <div className="flex flex-nowrap gap-4 pb-4">
//         {listings.map((listing,index) => (
//           <div key={index} className="flex-shrink-0 w-36 md:w-48 sm:w-40">
//             <ListingCard 
//             loading={loading}
//               data={listing}
//               showWishlist={wishlist}
//               type={type}
//             />
//           </div>
//         ))}
//       </div>
//       <ScrollBar orientation="horizontal" />
//     </ScrollArea>
//     </>
//   )
// }

// export default HomeProducts
import ListingCard from '../ui/ListingCard';
import { ScrollArea, ScrollBar } from '../ui/ScrollArea';
import Heading from '../ui/Headings';
import { motion } from 'framer-motion'; // Added import
import { containerVariants } from '../../lib/motion'; // Added import

const HomeProducts = ({ listings, wishlist, type, title, loading }) => {
  return (
    <>
      <div className='py-2'>
        <Heading title={title} listings={listings} loading={loading} />
      </div>
      
      <ScrollArea 
        orientation="horizontal" 
        className="w-full px-2 bg-[#fffbfb] py-4"
      >
        <motion.div 
          className="flex flex-nowrap gap-4 pb-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {listings.map((listing, index) => (
            <div key={index} className="flex-shrink-0 w-36 md:w-48 sm:w-40">
              <ListingCard 
                loading={loading}
                data={listing}
                showWishlist={wishlist}
                type={type}
              />
            </div>
          ))}
        </motion.div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

export default HomeProducts;