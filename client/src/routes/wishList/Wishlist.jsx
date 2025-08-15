import ListingCard from '../../components/ui/ListingCard';
import Heading from '../../components/ui/Headings';
import { useSelector } from 'react-redux';

const Wishlist = () => {
  const wishlist = useSelector((state) => state.wishlist.items);

  return (
    <div>
      <div className='bg-white p-4 mt-5 rounded-md'>
        <Heading key='2' title="My favourites" listings={wishlist}/>
        <div className='pt-2'>
          {wishlist.length === 0 ? (
            <div className="col-span-full text-center bg-lamaWhite h-[30vh] md:h-[40vh] text-gray-500 italic items-center justify-center flex">
              No products found in wishlist
            </div>
          ) : ( 
            <div className="px-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 bg-[#fff]">
              {wishlist.map((listing, i) => (
                <ListingCard
                  key={i}
                  data={listing}
                  offer={false}
                  showWishlist={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;