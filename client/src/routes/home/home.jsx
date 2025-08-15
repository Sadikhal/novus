import HomeCarousal from '../../components/home/HomeCarousal'
import HomeExplore from '../../components/home/HomeExplore'
import HomeProducts from '../../components/home/HomeProducts'
import { useEffect } from 'react'
import { useState } from 'react'
import {  Loader } from '../../components/ui/Loaders';
import useBanners from '../../hooks/useBanners';
import { extractBanners, transformCategoryData } from '../../lib/extractBanners'
import { BannerSection, GridSection, SecondaryBannerSection } from '../../components/home/BannerSection'
import { ErrorFallback } from '../../components/sections/ErrorFallback'



const Home = () => {
  const { categories, products, error, loading } = useBanners();
  const [bannerData, setBannerData] = useState({
    primaryProducts: [],
    primaryCategories: [],
    secondaryProducts: [],
    secondaryCategories: [],
    tertiaryCategories : []

  });
  
  useEffect(() => {
    if (!loading) {
      setBannerData(extractBanners(products, categories));
    }
  }, [loading, products, categories]);


  return (
    <div className='bg-[#f5f5f5]'>
      { error ?
      <div className='flex justify-center items-center h-[56vh] md:h-[80vh]'> 
       <ErrorFallback message = {error}/>
       </div> : (
          <div className='bg-[#f5f5f5] flex flex-col gap-4 lg:gap-3 w-full'>
          {!loading && bannerData.tertiaryCategories.length > 0 && (
              <HomeCarousal 
                loading={loading}
                banner={bannerData.tertiaryCategories[0]}
                transformData={data => data.categories.map(transformCategoryData)}
              />
            )}
            
            {loading && (
              <div className='w-full h-[300px] justify-center flex items-center'>
                 <Loader/>
              </div>
            )}
      <div className='bg-lamaWhite py-5'>
        <HomeExplore />
      </div>
      
      <BannerSection 
        loading={loading}
        banner={bannerData.primaryProducts[0]}
        type="product"
        Component={HomeProducts}
        transformData={data => data.products.map(p => p.productId)}
        className="w-full mx-4"
      />
      
      {/* 2. First active primary category */}
      <BannerSection 
        loading={loading}
        banner={bannerData.primaryCategories[0]}
        type="category"
        Component={HomeProducts}
        transformData={data => data.categories.map(transformCategoryData)}
        className="px-1 mx-4"
      />
      
      {/* Secondary banners section */}
      <SecondaryBannerSection 
        loading={loading}
        banners={bannerData}
      />
      
      {/* Grid section */}
      <GridSection 
        loading={loading}
        banners={bannerData}
      />
      
      {/* 3. Second active primary product */}
      <BannerSection 
        loading={loading}
        banner={bannerData.primaryProducts[1]}
        type="product"
        Component={HomeProducts}
        transformData={data => data.products.map(p => p.productId)}
        className="w-full mx-4"
      />
      
      {/* 4. Second active primary category */}
      <BannerSection 
        loading={loading}
        banner={bannerData.primaryCategories[1]}
        type="category"
        Component={HomeProducts}
        transformData={data => data.categories.map(transformCategoryData)}
        className="px-1 mx-4"
      />
</div>
   )}
    </div>
  );
};

export default Home;