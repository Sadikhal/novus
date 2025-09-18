import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Detailsection from '../../components/sections/Detailsection';
import Slider from '../../components/sections/Slider';
import BrandProduct from '../../components/sections/BrandProduct';
import { Services } from '../../components/sections/Services';
import { ErrorFallback } from '../../components/sections/ErrorFallback';
import { Loader } from '../../components/ui/Loaders';
import { useUserActions } from '../../hooks/useUserActions';
import { useProductDetails } from '../../hooks/useProductDetails';
import {ProductInfo} from '../../components/sections/ProductsInfo';
import {PrimaryProductActions} from '../../components/sections/ProductActions';
import SimilarProducts from '../../components/sections/SimilarProducts';

function Product() {
  const { productId } = useParams();
  const [imageIndex, setImageIndex] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const { product, similarProducts, loading, error } = useProductDetails(productId);
  const {
    isInWishlist,
    handleAddToCart,
    handleWishlist,
    handleBuyNow,
    handleMessageSubmit
  } = useUserActions(product);

  return (
    <div className='flex flex-col bg-lamaWhite px-3 h-full w-full md:px-7 lg:px-3 xl:px-4 pt-2 min-h-screen'>
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
          <div className="flex flex-col lg:flex-row pt-3 bg-[#ffff] rounded-sm py-2 h-full w-full">
            <div className="lg:sticky xl:top-8 lg:top-6 lg:self-start lg:h-auto h-full lg:w-[40%] xl:w-[43%]">
              <Slider 
                images={product.image} 
                imageIndex={imageIndex} 
                setImageIndex={setImageIndex}
              />
              
              <PrimaryProductActions 
               onAddToCart={() => handleAddToCart(selectedSize)}
               onBuyNow={() => handleBuyNow(selectedSize)}
              />
              
              <div className="flex flex-col gap-12 lg:mt-8">
                <div className='hidden lg:flex w-full'>
                  <Services product={product} />
                </div>
              </div>
            </div>
            
            <div className="right xl:w-[58%] pt-6 lg:pt-2  px-2 lg:ml-9 xl:ml-7 lg:w-[60%] ">
              <ProductInfo  
                product={product}
                isInWishlist={isInWishlist}
                onWishlist={handleWishlist}
                onMessage={() => handleMessageSubmit(product?.userId, 'chat')}
                selectedSize={selectedSize}
                setSelectedSize={setSelectedSize}
              />
            </div>
          </div>

          <div className='lg:hidden block w-full mt-8 py-3 px-2 sm:px-3 md:px-5 bg-[#e4ddcc] rounded-md'>
            <Services product={product}/>
          </div>
          <div>
            <Detailsection product={product} />
          </div>
        </>
      )}
        <div className='flex flex-col h-full gap-8'>
          <BrandProduct product={product} />
          <SimilarProducts products={similarProducts} loading={loading} error={error} />
        </div>
      </div>
  );
}

export default Product;