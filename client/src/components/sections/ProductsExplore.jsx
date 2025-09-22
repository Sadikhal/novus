import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';
import { CategorySkeletonLoader } from '../ui/Loaders';
import { containerVariants, itemVariants, textVariants } from '../../lib/motion';

const ProductsExplore = ({ categories, onCategoryClick, loading }) => {
  if (loading) {
    return <CategorySkeletonLoader count={15} />;
  }

  return (
    <motion.div
      className={cn('flex w-full flex-col gap-5 px-1 h-full')}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, margin: '-20% 0%' }}
    >
      <div 
        className="carousel flex flex-row lg:gap-5 w-full gap-2 md:gap-4 overflow-x-auto"
        role="list"
        aria-label="Product categories"
      >
        {categories.map((category) => (
          <div
            key={category._id}
            className="carousel-item flex flex-col items-center justify-center flex-shrink-0"
            role="listitem"
          >
            <button
              onClick={() => onCategoryClick(category.name)}
              className="group border-none outline-none flex flex-col items-center justify-center cursor-pointer"
              type="button"
              aria-label={`Select ${category.name} category`}
            >
              <div className="relative flex items-center justify-center rounded-full bg-transparent">
                <motion.img
                  src={category.image?.[1]}
                  className="h-16 w-16 rounded-full object-cover sm:h-20 sm:w-20 2xl:h-28 2xl:w-28 bg-white"
                  alt={`Category: ${category.name}`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                />
              </div>
              <div className="relative mt-2">
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
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default ProductsExplore;