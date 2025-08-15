import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import ReviewModal from './ReviewModal';
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { ScrollArea } from '../ui/ScrollArea';

const Review = ({ product: initialProduct }) => {
  const [product, setProduct] = useState(initialProduct);

  const renderHearts = (rating) => {
    const heartColors = [
      'bg-red-400', 'bg-orange-400', 'bg-yellow-400', 
      'bg-lime-400', 'bg-green-400'
    ];

    return heartColors.slice(0, rating).map((color, index) => (
      <input
        key={index}
        name={`rating-${rating}`}
        className={`mask mask-heart ${color}`}
        checked
        readOnly
      />
    ));
  };

  const handleReviewSubmit = (updatedReviews) => {
    const numReviews = updatedReviews.length;
    const rating = updatedReviews.reduce((acc, review) => acc + review.rating, 0) / numReviews;
    
    setProduct(prev => ({
      ...prev,
      reviews: updatedReviews,
      numReviews,
      rating
    }));
  };

  return (
    <ScrollArea className="bg-slate-50 w-full h-[calc(100vh-80px)]">
      <div className='pt-5 px-3 font-poppins text-black flex flex-row gap-5 items-center'>
        <div className='font-bold text-2xl'>Rating and Reviews</div>
        <div className='h-10 w-16 flex items-center justify-center text-lamaWhite flex-row gap-1 bg-[#099e94] rounded-full'>
          <span className='font-bold'>
            {Number(product?.rating ?? 0).toFixed(1)}
          </span>
          <FaStar />
        </div>
      </div>
      
      <div>
        <ReviewModal onReviewSubmit={handleReviewSubmit} />
      </div>

      {product.reviews.length > 0 ? (
        <div className="grid p-4 md:p-2 lg:p-6 md:grid-cols-2 gap-4">
          {product.reviews.map((review) => (
            <div key={review._id} className="card bg-[#fff] shadow-xl">
              <div className="my-4 w-full pr-2">
                <div className="rating gap-1 justify-end w-full rating-md">
                  {renderHearts(review.rating)}
                </div>
                <div className="flex flex-row gap-3">
                  <img
                    className="rounded-full h-16 w-16 pl-1 object-cover"
                    src={review?.userImage || "/person.jpg"}
                    alt="review author"
                  />
                  <div className="flex flex-row space-x-2 text-black text-wrap font-helvetica text-[14px] w-full font-medium">
                    <BiSolidQuoteAltLeft className="text-md" />
                    <div className="pt-1 text-wrap break-words flex-grow font-poppins">
                      {review.comment}
                    </div>
                  </div>
                </div>
                <div className="card-actions justify-end text-black font-helvetica text-[14px]">
                  <span>-</span> <div>{review.name}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='flex w-full justify-center items-center italic text-slate-300 h-20'>
          <span>No reviews yet</span>
        </div>
      )}
    </ScrollArea>
  );
};

export default Review;