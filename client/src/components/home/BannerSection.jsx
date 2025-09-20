import AdProducts from "./AdProducts";
import HomeTrending from "./HomeTrending";
import { GridSkeletonLoader, SkeletonLoader } from "../ui/Loaders";
import { transformCategoryData } from "../../lib/extractBanners";
import { Button } from "../ui/Button";
import { containerVariants, bannerVariants } from "../../lib/motion";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";


export const BannerSection = ({ 
  loading, 
  banner, 
  type, 
  Component, 
  transformData,
  className = '' 
}) => (
  <div className={`bg-lamaWhite h-full w-full ${className}`}>
    {loading ? (
      <SkeletonLoader type={type} count={6} />
    ) : banner && (
      <Component 
        title={banner.title}
        listings={transformData(banner)}
        wishlist={type === "product"}
        type={type}
        loading={false}
      />
    )}
  </div>
);

export const SecondaryBannerSection = ({ loading, banners }) => (
  <>
    <div className='lg:flex items-center justify-center lg:flex-row hidden h-full w-full'>
      <div className='px-4 lg:flex-[0.6] hidden lg:flex h-full'>
        <div className='flex flex-col gap-3 w-full'> 
          {loading ? (
            <GridSkeletonLoader count={4} />
          ) : banners.secondaryProducts[0] && (
            <HomeTrending 
              title={banners.secondaryProducts[0].title}
              listings={banners.secondaryProducts[0].products.slice(0,4).map(p => p.productId)} 
              loading={false}
            />
          )}
        </div>
      </div>
      
      {loading ? (
        <SkeletonLoader type='category' count={4} />
      ) : (
        <div className='lg:flex-1 pr-6 mt-1 hidden lg:block h-full w-full'>
         <AdProducts />
        </div>
        
      )}
    </div>
    
    {loading ? (
      <SkeletonLoader type='category' count={4} />
    ) : (
      <motion.div className='lg:hidden px-3 mt-1 relative h-full max-h-[300px] w-full block'
       variants={containerVariants}
       initial="hidden"
       animate="visible"
       >
        <Link to ='/products?category=perfumes,beauty' className='h-full w-full'>
          <motion.img 
            src="/banner/perfume9.webp" 
            className="object-cover h-full max-h-[300px] w-full rounded-lg"
            alt="banner"
            variants={bannerVariants}
            
          />
        <div className="absolute inset-0  bg-opacity-50 flex  left-10 top-20 flex-col gap-2">
          <div className="text-white text-2xl font-assistant font-extrabold capitalize  ">Unveil the Essence of Elegance</div>
          <div className='text-white text-base font-poppins font-medium  capitalize'>
          Timeless & Modern choices
          </div>
        </div>
      <div className="absolute bottom-9 left-16">
        <Button className="border-slate-50 text-lamaWhite bg-transparent border-2 hover:bg-transparent font-bold">
          Shop Now
        </Button>
      </div>
     </Link> 
    </motion.div>
    )}
  </>
);

export const GridSection = ({ loading, banners }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 h-full w-full'>
    {loading ? (
      Array(3).fill(0).map((_, i) => (
        <div key={i} className='px-4 flex-[0.6] h-full'>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
          <GridSkeletonLoader count={4} />
        </div>
      ))
    ) : (
      <>
        {banners.secondaryProducts[1] && (
          <GridBannerItem 
            title={banners.secondaryProducts[1].title}
            listings={banners.secondaryProducts[1].products.slice(0,4).map(p => p.productId)} 
          />
        )}
        
        {banners.secondaryCategories[0] && (
          <GridBannerItem 
            title={banners.secondaryCategories[0].title}
            listings={banners.secondaryCategories[0].categories.slice(0,4).map(transformCategoryData)} 
            type="category"
          />
        )}
        
        {banners.secondaryProducts[2] && (
          <GridBannerItem 
            title={banners.secondaryProducts[2].title}
            listings={banners.secondaryProducts[2].products.slice(0,4).map(p => p.productId)} 
          />
        )}

        <div className='flex lg:hidden flex-col gap-3 h-full w-full'> 
          {loading ? (
            <GridSkeletonLoader count={4} />
          ) : banners.secondaryProducts[0] && (
            <HomeTrending 
              title={banners.secondaryProducts[0].title}
              listings={banners.secondaryProducts[0].products.slice(0,4).map(p => p.productId)} 
              loading={false}
            />
          )}
        </div>
      </>
    )}
  </div>
);

const GridBannerItem = ({ title, listings, type = 'product' }) => (
  <div className='px-4 flex-[0.6] h-full'>
    <HomeTrending 
      title={title}
      listings={listings} 
      loading={false}
      type={type}
    />
  </div>
);
