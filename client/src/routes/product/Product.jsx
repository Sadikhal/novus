import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Detailsection from '../../components/sections/Detailsection';
import HomeProducts from '../../components/home/HomeProducts';
import Slider from '../../components/sections/Slider';
import BrandProduct from '../../components/sections/BrandProduct';
import { Separator } from '../../components/ui/Separator';
import { Services } from '../../components/sections/Services';
import { ErrorFallback } from '../../components/sections/ErrorFallback';
import { Loader, SkeletonLoader } from '../../components/ui/Loaders';
import { ScrollArea } from '../../components/ui/ScrollArea';
import { useUserActions } from '../../hooks/useUserActions';
import { useProductDetails } from '../../hooks/useProductDetails';
import {ProductInfo} from '../../components/sections/ProductsInfo';
import {PrimaryProductActions} from '../../components/sections/ProductActions';
import SimilarProducts from '../../components/sections/SimilarProducts';

function Product() {
  const { productId } = useParams();
  const [imageIndex, setImageIndex] = useState(null);
  const { product, similarProducts, loading, error } = useProductDetails(productId);
  const {
    isInWishlist,
    handleAddToCart,
    handleWishlist,
    handleBuyNow,
    handleMessageSubmit
  } = useUserActions(product);

  return (
    <div className='flex flex-col bg-lamaWhite px-3 h-full w-full md:px-7 xl:px-4 pt-5 min-h-screen'>
      {loading ? (
        <div className='flex justify-center items-center h-[56vh] md:h-[80vh]'>
          <Loader />
        </div>
      ) : !product ? (
        <div className='flex justify-center items-center h-[56vh] md:h-[80vh]'>
          Product not found
        </div>
      ) : error ? (
        <ErrorFallback message={error} />
      ) : (
        <>
          <div className="container flex flex-col xl:flex-row pt-3 bg-[#ffff] px-2 rounded-sm py-2 h-full w-full">
            <div className="xl:sticky xl:top-12 xl:self-start xl:h-auto h-full xl:w-[55%]">
              <Slider 
                images={product.image} 
                imageIndex={imageIndex} 
                setImageIndex={setImageIndex}
              />
              
              <PrimaryProductActions 
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
              
              <div className="flex flex-col gap-12 lg:mt-8">
                <div className='hidden xl:flex w-full'>
                  <Services product={product} />
                </div>
              </div>
            </div>
            
            <div className="right xl:w-[45%] pt-6 md:pt-0 md:-mt-2 xl:mt-0 px-2 lg:ml-12 xl:ml-7">
              <ProductInfo  
                product={product}
                isInWishlist={isInWishlist}
                onWishlist={handleWishlist}
                onMessage={handleMessageSubmit}
              />
            </div>
          </div>

          <div className='xl:hidden block w-full mt-8 py-3 px-2 sm:px-3 md:px-5 bg-[#e4ddcc] rounded-md'>
            <Services product={product}/>
          </div>
          
          <div>
            <Detailsection product={product} />
          </div>
        </>
      )}

      <div className='pt-4'>
        <div className='flex flex-col'>
          <BrandProduct product={product} />
          <SimilarProducts products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      </div>
  );
}

export default Product;