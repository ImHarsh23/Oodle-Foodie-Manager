import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import WriteReview from "../WriteReview/WriteReview";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loading from "../Loading/Loading";
import ReviewCard from "../ReviewCard/ReviewCard";

const Rating = () => {
  const [writeReview, setWriteReview] = useState(false);
  const [reviews, setReviews] = useState(null);
  const { name } = useParams();

  const turnWriteReviewOn = () => {
    setWriteReview(true);
  };

  const turnWriteReviewOff = () => {
    setWriteReview(false);
  };

  const getReview = async () => {
    try {
      let { data } = await axios.get(
        `http://localhost:4444/restaurant/get-review/${name}`,
        { withCredentials: true }
      );
      setReviews(data.reviews);
    } catch (error) {
      toast.error("Unable to fetch restaurant reviews right now");
    }
  };

  useEffect(() => {
    getReview();
  }, []);

  const reviewSubmitHandler = async (reviewData) => {
    const formData = new FormData();
    reviewData.images.forEach((file) => {
      formData.append("images", file); // Field name 'images' is used here
    });
    formData.append("restaurant_name", reviewData.restaurant_name);
    formData.append("rating", reviewData.rating);
    formData.append("message", reviewData.message);
    let toastId = toast.loading("Posting Review");
    try {
      let { data } = await axios.post(
        "http://localhost:4444/restaurant/add-review",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(data.message, { id: toastId });
      setWriteReview(false);
      getReview();
    } catch (error) {
      toast.error(error.response.data.message, { id: toastId });
    }
  };

  if (!reviews) {
    return (
      <div className="flex justify-center my-5">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-center items-center w-full">
        <div className="px-10 flex flex-col gap-2 p-5 bg-white rounded-xl w-full">
          <div className="flex justify-between">
            <h1 className="text-lg">Reviews</h1>
            {!writeReview && (
              <Button onClick={turnWriteReviewOn}>Write review</Button>
            )}
          </div>
          {writeReview && (
            <WriteReview
              turnWriteReviewOff={turnWriteReviewOff}
              reviewSubmitHandler={reviewSubmitHandler}
            />
          )}

          {/* <!-- Item Container --> */}
          <div className="flex flex-col my-10">
            {reviews.length ? (
              reviews.map((review) => {
                return (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    getReview={getReview}
                  />
                );
              })
            ) : (
              <div className="text-center text-2xl font-medium">No reviews</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Rating;
