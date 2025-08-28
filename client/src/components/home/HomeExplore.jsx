import { cn } from '../../lib/utils';
import { Link } from 'react-router-dom';
import { useFetchCategoriesAndBrands } from '../../hooks/useCategoriesAndBrands';
import { ErrorFallback } from '../sections/ErrorFallback';

const HomeExplore = () => {
    const { 
      categories, 
       error
    } = useFetchCategoriesAndBrands();

   if (error) return <div className="w-full flex  h-full items-center justify-center">
      <ErrorFallback error={error} />
    </div>;
   
  return (
    <div className='w-full flex flex-col gap-3 px-2 sm:px-3 md:px-5 lg:px-6 h-full '>
      <div>
        <h1 className='sm:text-[1.5rem] text-[1.3rem] font-robotos font-bold text-[#082133]'>
          Explore Popular categories
        </h1>
      </div>
    
      <div className="carousel flex flex-row gap-6 justify-between h-full py-2 px-1">
        {categories?.map((category) => (
          <Link 
            to={`/products?category=${category?.name}`}
            key={category?.id} 
            className="carousel-item border-none outline-none md:w-28 md:h-40 h-36 w-24 flex flex-col items-center justify-center group rounded-lg cursor-pointer"
          >
            <div className='bg-transparent rounded-full w-full h-full flex items-center justify-center duration-500 group-hover:rotate-180 group-hover:-scale-100 transition-transform'>
              <img src = {category?.image[0]}
                className="md:h-28 md:w-28 h-24 w-24 object-cover bg-[#ffff] rounded-full" 
                alt={category?.name}
              />
            </div> 
            <div className='relative'>
              <div className='font-bold text-[0.875rem] leading-[1.40rem] tracking-wider text-[#0f4b53] capitalize font-robotos'>
                {category?.name}
              </div>
              <div
                className={cn(
                  'absolute w-full h-[2px] bg-[#91bac1] scale-x-0 group-hover:scale-x-100 transition ease-in-out delay-0 duration-500'
                )}
              />
            </div>      
          </Link> 
        ))}
      </div>
    </div>
  );
}

export default HomeExplore;