import { cn } from '../../lib/utils';

const ProductsExplore = ({ categories }) => {
  return (
    <div className='w-full flex flex-col gap-5 px-1 h-full '>
      <div className="carousel flex flex-row lg:gap-7 w-full gap-2 md:gap-5 justify-between">
        {categories.map((category) => (
          <div 
            key={category._id} 
            className="carousel-item border-none outline-none h-full flex flex-col items-center justify-center group cursor-pointer"
          >
            <div className='bg-transparent rounded-full flex items-center justify-center duration-500'>
              <div 
                className="md:h-24 md:w-24 sm:w-20 sm:h-20 w-[72px] h-[72px] bg-cover bg-center bg-[#ffff] rounded-full" 
                style={{ backgroundImage: `url(${category.image[1]})` }}
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