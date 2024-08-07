import { useEffect, useRef, useState } from "react";
import { MoreVertIcon } from "../../utils/icons";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@material-tailwind/react";
import isoToReadableDate from "../../utils/isoToReadableDate";
import { useSelector } from "react-redux";

const api = axios.create({
  baseURL: "https://oodle.onrender.com",
});

const ReviewCard = ({ review, getReview }) => {
  const { auth } = useSelector((state) => state.auth);
  const [openReviewDelete, setOpenReviewDelete] = useState(false);
  const { name } = useParams();
  const [updatable, setUpdatable] = useState(false);
  const [updatedMessage, setUpdatedMessage] = useState(review.message);
  const [starRating, setStarRating] = useState(review.rating);
  const [selectedBigImage, setSelectedBigImage] = useState(null);
  const textareaRef = useRef(null);

  const openModal = (url) => {
    setSelectedBigImage(url);
  };

  const closeModal = () => {
    setSelectedBigImage(null);
  };

  const deleteReview = async (reviewId) => {
    const id = toast.loading("Deleting your review");
    try {
      let response = await api.post(
        `/restaurant/delete-review/${reviewId}`,
        { restaurant_name: name },
        { withCredentials: true }
      );
      await getReview();
      toast.success(response.data.message, { id });
    } catch (error) {
      toast.error(error.response.data.message, { id });
    }
  };

  const makeReviewEditable = () => {
    setUpdatable(true);
    setOpenReviewDelete(false);
  };

  const updateReview = async () => {
    const id = toast.loading("Updating your review");
    try {
      let response = await api.post(
        `/restaurant/update-review/${review._id}`,
        { message: updatedMessage, restaurant_name: name, rating: starRating },
        { withCredentials: true }
      );
      setUpdatable(false);
      await getReview();
      toast.success(response.data.message, { id });
    } catch (error) {
      toast.error(error.response.data.message, { id });
    }
  };

  const starRatingChanger = (e) => {
    const value = e.currentTarget.getAttribute("data-value");
    if (updatable) setStarRating(value);
  };

  const cancelEdit = () => {
    setUpdatedMessage(review.message); // Reset to original message
    setStarRating(review.rating);
    setUpdatable(false);
  };

  useEffect(() => {
    // Adjust the height of the textarea to fit its content
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"; // Reset height
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // Set height based on scrollHeight
    }
  }, [updatedMessage]);

  return (
    <div className="relative flex flex-col mb-7 p-3 rounded-lg shadow-[_5px_5px_0px_0px_rgba(109,40,217)] border-2">
      {/* Profile and Rating */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <div className="w-7 h-7 text-center rounded-full overflow-hidden">
            <img src={review.avatar} alt="profile image" />
          </div>
          <span className="uppercase font-medium">{review.username}</span>
          {auth._id === review.userId && (
            <div>
              <MoreVertIcon
                onClick={() => {
                  setOpenReviewDelete(!openReviewDelete);
                }}
              />
              {openReviewDelete && (
                <ul className="absolute right-0 z-10 min-w-[180px] overflow-auto rounded-md border border-blue-gray-50 bg-white p-3 font-sans text-sm font-normal text-blue-gray-500 shadow-lg shadow-blue-gray-500/10 focus:outline-none">
                  <li
                    onClick={makeReviewEditable}
                    className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    Update Review
                  </li>
                  <li
                    onClick={() => {
                      deleteReview(review._id);
                    }}
                    className="block w-full cursor-pointer select-none rounded-md px-3 pt-[9px] pb-2 text-start leading-tight transition-all hover:bg-blue-gray-50 hover:bg-opacity-80 text-red-500 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900"
                  >
                    Delete review
                  </li>
                </ul>
              )}
            </div>
          )}
        </div>
        <div
          className={`${
            updatable && " flex-row-reverse"
          } flex p-1 gap-1 text-orange-300`}
        >
          {[...Array(5)].map((_, idx) => (
            <span
              key={idx}
              data-value={5 - idx}
              className={`fa fa-star ${
                !updatable
                  ? `${
                      review.rating - idx > 0
                        ? "text-yellow-800"
                        : "text-gray-500"
                    }`
                  : ` ${
                      starRating < 5 - idx
                        ? " text-gray-500"
                        : "text-yellow-700"
                    } peer peer-hover:text-yellow-700 hover:text-yellow-700 text-2xl mx-1 cursor-pointer`
              }`}
              onClick={starRatingChanger}
            />
          ))}
        </div>
      </div>
      <textarea
        ref={textareaRef}
        readOnly={!updatable || auth._id !== review.userId}
        className={`${
          updatable && "border-2 border-dashed border-black p-2 rounded-2xl"
        } outline-none resize-none`}
        value={updatedMessage}
        onChange={(e) => setUpdatedMessage(e.target.value)}
        placeholder="Message Can't be empty"
      />
      <div className="mt-1">
        {review.images.map((imageObj) => (
          <div key={imageObj._id} className="relative inline-block mr-2">
            <img
              src={imageObj.url}
              alt={`uploaded-img`}
              className="object-cover w-16 h-16 rounded-lg cursor-pointer"
              onClick={() => openModal(imageObj.url)}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between">
        <span>{isoToReadableDate(review.postDate)}</span>
        <div className="flex gap-4">
          {updatable && (
            <>
              <Button className="bg-blue-500 text-white" onClick={updateReview}>
                Update
              </Button>
              <Button className="bg-red-300" onClick={cancelEdit}>
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
      {selectedBigImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[51]"
          onClick={closeModal}
        >
          <span
            className="absolute top-1 right-6 text-white text-3xl font-bold cursor-pointer hover:text-gray-400"
            onClick={closeModal}
          >
            &times;
          </span>
          <img
            src={selectedBigImage}
            alt="Full Size"
            className="max-w-screen-sm max-h-screen object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
