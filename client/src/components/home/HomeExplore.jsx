import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useFetchCategoriesAndBrands } from '../../hooks/useCategoriesAndBrands';
import { ErrorFallback } from '../sections/ErrorFallback';
import { CategorySkeletonLoader } from '../ui/Loaders';
import { containerVariants, itemVariants, textVariants } from '../../lib/motion';
import { motion } from 'framer-motion';

const HomeExplore = () => {
  const { 
    categories, 
    error,
    isLoading
  } = useFetchCategoriesAndBrands();

  if (isLoading) {
    return (
      <CategorySkeletonLoader count={15} />
    );
  }
  if (categories.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-gray-500">
        No categories available
      </div>
    );
  }

  if (error) return <div className="w-full flex h-full items-center justify-center">
    <ErrorFallback error={error} />
  </div>;

  return (
    <motion.div
      className='w-full flex flex-col gap-3 px-2 sm:px-3 md:px-5 lg:px-6 h-full'
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <div>
        <h1 className='sm:text-[1.5rem] text-[1.3rem] font-robotos font-bold text-[#082133]'>
          Explore Popular categories
        </h1>
      </div>
    
      <div className="carousel carousel-horizontal flex flex-row gap-4 md:gap-2 justify-between h-full px-1 w-full">
        {categories?.map((category) => (
          <Link 
            to={`/products?category=${category?.name}`}
            key={category?.id} 
            className="carousel-item border-none outline-none md:w-28 md:h-36 h-32 w-20 flex flex-col items-center justify-center group rounded-lg cursor-pointer"
          >
            <div className='bg-transparent rounded-full w-full h-full flex items-center justify-center duration-500 group-hover:rotate-180 group-hover:-scale-100 transition-transform'>
              <motion.img 
                src={category?.image[0]}
                className="md:h-24 md:w-24 h-20 w-20 object-cover bg-[#ffff] rounded-full" 
                alt={category?.name}
                variants={itemVariants}
              />
            </div> 
            <div className='relative'>
              <motion.span
                className='font-bold text-[0.875rem] text-nowrap tracking-wider text-[#0f4b53] capitalize font-robotos  '
                variants={textVariants}
              >
                {category?.name}
              </motion.span>
              <div
                className={cn(
                  'absolute w-full h-[2px] bg-[#91bac1] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'
                )}
              />
            </div>      
          </Link> 
        ))}
      </div>
    </motion.div>
  );
}

export default HomeExplore;