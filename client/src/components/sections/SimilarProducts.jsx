import { Separator } from '../ui/Separator';
import { SkeletonLoader } from '../ui/Loaders';
import { ScrollArea } from '../ui/ScrollArea';
import HomeProducts from '../home/HomeProducts';

const SimilarProducts = ({ products, error, loading }) => {
  return (
    <div className='flex flex-col gap-2 h-full'>
      <Separator className="h-[0.5px] bg-slate-200" />
      {error && (
        <div className="text-red-800 text-center py-4">
          {error}
        </div>
      )}
      {loading ? (
        <div className="w-[220px]">
          <SkeletonLoader count={8} />
        </div>
      ) : products.length > 0 ? (
        <ScrollArea
          orientation="horizontal" 
          className="w-full bg-[#fffbfb]"
        >
          <div className="flex flex-row w-max space-x-4 px-2">
            <HomeProducts listings={products} title="similar products" />
          </div>
        </ScrollArea>
      ) : null}
    </div>
  );
};

export default SimilarProducts;