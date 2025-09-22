
import ListingCard from '../ui/ListingCard';
import { Separator } from '../ui/Separator'
import { FilterSkeleton } from '../ui/Loaders';
import { EmptyState } from '../ui/Loaders';
import { ProductListSkeleton } from '../ui/Loaders';
import Pagination from './pagination';
import FilterProduct from './FilterProduct';
import { containerVariants, itemVariants } from '../../lib/motion';
import { motion } from 'framer-motion';

const Filter = ({ 
  handleCheckboxChange,
  filters, 
  products,
  handleClearAll,
  isLoading,
  error,
  handlePriceRangeChange,
  pagination,
  handlePageChange,
  handleColorChange,
  isEmpty,
  categories = [],
  brands = [],
  filtersLoading
}) => {
  return (
    <div className='flex flex-row bg-[#fff]'>
      <div className='hidden lg:flex flex-[0.25] lg:sticky lg:top-[80px] h-full'>
        {filtersLoading ? (
          <FilterSkeleton />
        ) : (
          <FilterProduct 
            filters={filters} 
            handleCheckboxChange={handleCheckboxChange}  
            handleColorChange={handleColorChange}
            categories={categories} 
            brands={brands} 
            handleClearAll={handleClearAll}
            handlePriceRangeChange={handlePriceRangeChange}
          />
        )}
      </div>
      
      <div className='flex flex-1 '>
        <div className='w-full'> 
          <Separator className='h-[0.5px] bg-slate-200 lg:mt-[40px] mt-[10px]'/>
          
          {isEmpty ? (
            <EmptyState handleClearAll={handleClearAll} />
          ) : (
            <>
              <motion.div className="px-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 py-4"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true}}>
                {isLoading ? (
                 <ProductListSkeleton/>
                  
                ) : error ? (
                  <div className="col-span-full text-center py-8">
                    <h3 className="text-red-500 font-medium">Error loading products</h3>
                    <p className="text-gray-600">{error}</p>
                  </div>
                ) : (
                  products?.map((item) => (
                   <motion.div variants={itemVariants} key={item._id}> 
                    <ListingCard 
                      key={item._id}
                      data={item}
                      showWishlist={true}  
                    />
                   </motion.div> 
                  ))
                )}
              </motion.div>

              {pagination && !isLoading && !error && (
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
export default Filter;