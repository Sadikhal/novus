import { cn } from '../../lib/utils';
import { HomeExplores } from '../../lib/data';
import { useFetchCategoriesAndBrands } from '../../hooks/useCategoriesAndBrands';
import { Loader } from '../ui/Loaders';

const HomeExplore = () => {
    const { 
      categories, 
      isLoading, 
       error
    } = useFetchCategoriesAndBrands();

   if (error) return <div className="w-full flex  h-full items-center justify-center">
      <ErrorFallback error={error} />
    </div>;
    if (isLoading) return <Loader />;

  return (
    <div className='w-full flex flex-col gap-5 px-10'>
      <div>
        <h1 className='text-[1.5rem] font-robotos font-bold leading-[32px] text-[#082133]'>
          Explore Popular categories
        </h1>
      </div>
    
      <div className="carousel flex flex-row gap-3 h-full py-4 md:py-0">
        {categories?.map((category) => (
          <div 
            key={category?.id} 
            className="carousel-item border-none outline-none md:w-48 md:h-48 sm:w-40 sm:h-40 w-[130px] h-[130px] flex flex-col items-center justify-center group"
          >
            <div className='bg-transparent rounded-full w-40 h-40 flex items-center justify-center duration-500 group-hover:rotate-180 group-hover:-scale-100 transition-transform'>
              <div 
                className="h-32 w-32 bg-cover bg-center bg-[#ffff] rounded-full" 
                style={{ backgroundImage: `url(${category?.image[0]})` }}
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
          </div> 
        ))}
      </div>
    </div>
  );
}

export default HomeExplore;