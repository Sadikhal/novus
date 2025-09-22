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
        <ScrollArea className="sm:h-[500px] modal-box w-full max-w-xl h-full bg-[#ffff] font-poppins">
          <button
            className="btn btn-sm btn-circle text-slate-950 btn-ghost absolute right-2 top-2"
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
              <div className="form-control w-full flex flex-col sm:flex-row sm:justify-between md:gap-4 gap-1">
                <label className="label">
                  <span className="label-text text-black">Overall Rating :</span>
                </label>
                <div className="rating gap-1 w-full rating-md pl-4">
                  {["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-lime-400", "bg-green-400"].map((color, i) => {
                    const star = i + 1;
                    return (
                      <input
                        key={star}
                        type="radio"
                        name="rating"
                        value={star}
                        checked={rating === star}
                        onChange={() => setRating(star)}
                        className={`mask mask-heart ${color}`}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="form-control w-full flex flex-col md:flex-row md:justify-between md:gap-4 gap-1 mt-3">
                <label className="label">
                  <span className="label-text text-black">Your Review : </span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  minLength={6}
                  className="textarea text-black bg-white w-full border-slate-200 focus:outline-none focus:border-slate-400 font-poppins shadow-lg shadow-slate-100 rounded-md"
                  placeholder="Describe your experience..."
                />
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