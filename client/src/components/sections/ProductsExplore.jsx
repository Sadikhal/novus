import { cn } from '../../lib/utils';

const ProductsExplore = ({ categories,onCategoryClick }) => {
  return (
    <div className='w-full flex flex-col gap-5 px-1 h-full '>
      <div className="carousel flex flex-row lg:gap-5 w-full gap-2 md:gap-4 justify-between pt-2">
        {categories.map((category) => (
           <div 
            key={category._id} 
            onClick={() => onCategoryClick(category?.name)}
            className="carousel-item border-none outline-none h-full flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className='bg-transparent rounded-full flex items-center justify-center duration-500'>
              <img src={category.image[1]}
                className="sm:w-20 sm:h-20 w-16 h-16 2xl:w-28 2xl:h-28  object-cover bg-center bg-[#ffff] rounded-full" 
              />
            </div> 
            <div className='relative'>
              <div className='font-bold sm:text-[0.875rem] text-[0.7rem] tracking-wider text-[#183b5e] capitalize font-robotos'>
                {category.name}
              </div>
              <div
                className={cn(
                  'absolute w-full min-h-[2px] bg-[#189086] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'
                )}
              />
            </div>      
          </div> 
        ))}
      </div>
    </div>
  );
};

export default ProductsExplore;