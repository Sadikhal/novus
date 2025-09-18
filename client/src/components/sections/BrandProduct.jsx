import Heading from '../ui/Headings';
import { apiRequest } from '../../lib/apiRequest';
import ProductCard from './ProductCard';
import { SkeletonLoader } from '../ui/Loaders';
import { ScrollArea } from '../ui/ScrollArea';
import { useEffect, useState } from 'react';

const BrandProduct = ({ product }) => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [brandProducts, setBrandProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (product?.brand) {
          const brandProductResponse = await apiRequest.get(
            `/product?brand=${product.brand}&limit=10`
          );
          const filteredProducts = brandProductResponse.data.products?.filter(
            (item) => item._id !== product._id
          ) || [];
          setBrandProducts(filteredProducts);
        }
      } catch (error) {
        console.error("API Error:", error);
        setError("Something went wrong while fetching the product.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [product]);

  return (
    <div className='w-full'>
      <Heading 
        title="More products from brand" 
        loading={loading} 
        listings={brandProducts} 
      />
      {error && (
        <div className="text-red-800 text-center py-4">
          {error}
        </div>
      )}
      <ScrollArea
        orientation="horizontal" 
        className="w-full bg-[#fffbfb] mt-5"
      >
        <div className="flex flex-row w-max space-x-4 px-1 md:px-3 h-full">
          {loading ? (
            <div className="w-[220px]">
              <SkeletonLoader count={8} />
            </div>
          ) : (
            brandProducts.length > 0 && (
              brandProducts.map((listing) => (
                <div key={listing._id} className="h-full w-36 md:w-48 sm:w-40">
                  <ProductCard
                    data={listing}
                    wishlist={true}
                  />
                </div>
              ))
            ) 
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default BrandProduct;