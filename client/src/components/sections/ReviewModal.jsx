import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { apiRequest } from '../../lib/apiRequest';
import { toast } from "../../redux/useToast";
import { ScrollArea, ScrollBar } from '../ui/ScrollArea';

const ReviewModal = ({ onReviewSubmit }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(1);

  const { currentUser } = useSelector((state) => state.user);
  const { productId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiRequest.post(`/review/${productId}`, { 
        comment, 
        rating 
      });
      onReviewSubmit(res.data.reviews);
      setComment('');
      setRating(1);
      toast({
        variant: "secondary",
        title: "Review added successfully"
      });
      document.getElementById('review_modal').close();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
      console.error('Review submission error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        className="px-5 mx-7 underline-offset-8 underline pt-8 cursor-pointer text-black font-bold capitalize font-robotos text-[16px] w-32 text-nowrap"
        onClick={() => document.getElementById('review_modal').showModal()}
      >
        Write a Review
      </button>

      <dialog id="review_modal" className="modal">
        <ScrollArea className="md:h-[500px] modal-box w-full max-w-xl h-full bg-[#ffff] font-poppins">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={() => document.getElementById('review_modal').close()}
          >
            ✕
          </button>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
            <div className="flex flex-col justify-center items-center gap-3">
              <h2 className="text-black text-[22px] font-bold tracking-wider  font-robotos capitalize">
                Write a Review
              </h2>
              <p className="text-black text-[16px] font-normal tracking-wider  font-helvetica text-center">
                Share your thoughts with the community.
              </p>
            </div>

            <div className="flex flex-col w-full py-4 gap-3">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-black">Overall Rating</span>
                </label>
                <div className="rating gap-1 w-full rating-md">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <input
                      key={star}
                      type="radio"
                      name="rating"
                      value={star}
                      checked={rating === star}
                      onChange={() => setRating(star)}
                      className="mask mask-heart bg-red-400"
                    />
                  ))}
                </div>
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-black">Your Review</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  minLength={6}
                  className="textarea textarea-bordered bg-white border-gray-100 focus:outline-none focus:border-slate-300 font-poppins shadow-sm shadow-slate-400 rounded-md"
                  placeholder="Describe your experience..."
                />
                <span className="label-text-alt text-black">
                  Minimum 30 characters.
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn bg-[#0f5885] text-white hover:bg-novusYellow font-poppins border-none" 
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>

            {error && (
              <div className="text-red-800 text-sm text-center mt-2">
                {error}
              </div>
            )}
          </form>
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </dialog>
    </div>
  );
};

export default ReviewModal;