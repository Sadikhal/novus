import AdProducts from "./AdProducts";
import HomeTrending from "./HomeTrending";
import { GridSkeletonLoader, SkeletonLoader } from "../ui/Loaders";
import { transformCategoryData } from "../../lib/extractBanners";

export const BannerSection = ({ 
  loading, 
  banner, 
  type, 
  Component, 
  transformData,
  className = '' 
}) => (
  <div className={`bg-white ${className}`}>
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
    <div className='lg:flex items-center justify-center lg:flex-row hidden'>
      <div className='px-4 lg:flex-[0.6] hidden lg:flex'>
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
        <div className='lg:flex-1 pr-6 mt-1'>
          <AdProducts img='/mobiles/mob1.jpg' />
        </div>
      )}
    </div>
    
    {loading ? (
      <SkeletonLoader type='category' count={4} />
    ) : (
      <div className='lg:hidden pr-6 mt-1'>
        <AdProducts img='/mobiles/mob1.jpg' />
      </div>
    )}
  </>
);

export const GridSection = ({ loading, banners }) => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
    {loading ? (
      Array(3).fill(0).map((_, i) => (
        <div key={i} className='px-4 flex-[0.6]'>
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
      </>
    )}
  </div>
);

const GridBannerItem = ({ title, listings, type = 'product' }) => (
  <div className='px-4 flex-[0.6]'>
    <HomeTrending 
      title={title}
      listings={listings} 
      loading={false}
      type={type}
    />
  </div>
);
