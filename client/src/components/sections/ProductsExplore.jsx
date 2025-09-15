
// import { cn } from '../../lib/utils';
// import { motion } from 'framer-motion';
// import { CategorySkeletonLoader } from '../ui/Loaders';

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.3,
//       staggerChildren: 0.1,
//     },
//   },
// };

// const itemVariants = {
//   hidden: { opacity: 0, filter: 'blur(5px)' },
//   visible: {
//     opacity: 1,
//     filter: 'blur(0px)',
//     transition: { duration: 0.4 },
//   },
// };

// const textVariants = {
//   hidden: { opacity: 0, y: 10 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.4 },
//   },
// };


// const ProductsExplore = ({ categories, onCategoryClick, loading, className }) => {
//   if (loading) {
//     return (
//      <CategorySkeletonLoader count={15} />
//     );
//   }
//   if (!categories || categories.length === 0) {
//     return (
//       <div className="flex h-full w-full items-center justify-center text-gray-500">
//         No categories available
//       </div>
//     );
//   }

//   return (
//     <motion.div
//       className={cn('flex w-full flex-col gap-5 px-1 h-full', className)}
//       variants={containerVariants}
//       initial="hidden"
//       whileInView="visible"
//       viewport={{ once: true }}
//     >
//       <div className="carousel flex flex-row lg:gap-5 w-full gap-2 md:gap-4 justify-between">
//         {categories.map((category) => (
//           <motion.button
//             key={category._id}
//             onClick={() => onCategoryClick(category.name)}
//             className="carousel-item group border-none outline-none h-full flex flex-col items-center justify-center cursor-pointer"
//             type="button"
//             aria-label={`Select ${category.name} category`}
//           >
//             <div className="relative flex items-center justify-center rounded-full bg-transparent">
//               <motion.img
//                 src={category.image?.[0]}
//                 className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 2xl:h-28 2xl:w-28 bg-white"
//                 alt={`Category: ${category.name}`}
//                 loading="lazy"
//                 variants={itemVariants}
//               />
//             </div>
//             <div className="relative">
//               <motion.span
//                 className="font-robotos capitalize text-[0.7rem] font-bold tracking-wider sm:text-[0.875rem] text-[#183b5e]"
//                 variants={textVariants}
//               >
//                 {category.name}
//               </motion.span>
//               <div
//                 className={cn(
//                   'absolute w-full min-h-[2px] bg-[#189086] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'
//                 )}
//               />
//             </div>
//           </motion.button>
//         ))}
//       </div>
//     </motion.div>
//   );
// };


// export default ProductsExplore;




import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { CategorySkeletonLoader } from '../ui/Loaders';
import { containerVariants, itemVariants, textVariants } from '../../lib/motion';



const ProductsExplore = ({ categories, onCategoryClick, loading}) => {

  
  if (loading) {
    return (
      <CategorySkeletonLoader count={15} />
    );
  }
  if (!categories || categories.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        No categories available
      </div>
    );
  }

  return (
    <motion.div
      className={cn('flex w-full flex-col gap-5 px-1 h-full')}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div className="carousel flex flex-row lg:gap-5 w-full gap-2 md:gap-4 justify-between">
        {categories.map((category) => (
          <motion.button
            key={category._id}
            onClick={() => onCategoryClick(category.name)}
            className="carousel-item group border-none outline-none h-full flex flex-col items-center justify-center cursor-pointer"
            type="button"
            aria-label={`Select ${category.name} category`}
          >
            <div className="relative flex items-center justify-center rounded-full bg-transparent">
              <motion.img
                src={category.image?.[0]}
                className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 2xl:h-28 2xl:w-28 bg-white"
                alt={`Category: ${category.name}`}
                loading="lazy"
                variants={itemVariants}
              />
            </div>
            <div className="relative">
              <motion.span
                className="font-robotos capitalize text-[0.7rem] font-bold tracking-wider sm:text-[0.875rem] text-[#183b5e]"
                variants={textVariants}
              >
                {category.name}
              </motion.span>
              <div
                className={cn(
                  'absolute bottom-[-2px] w-full h-[2px] bg-[#189086] scale-x-0 group-hover:scale-x-100 group-focus:scale-x-100 transition-transform duration-300'
                )}
              />
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsExplore;
