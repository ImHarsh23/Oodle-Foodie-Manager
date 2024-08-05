import { Button } from "@material-tailwind/react";
import { useState } from "react";
import { useParams } from "react-router-dom";

const WriteReview = ({ turnWriteReviewOff, reviewSubmitHandler }) => {
  let { name } = useParams();
  let [reviewData, setReviewData] = useState({
    restaurant_name: name,
    rating: "",
    message: "",
    images: [],
  });
  const [rating, setRating] = useState(1);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    setReviewData({
      ...reviewData,
      images: [...reviewData.images, ...files],
    });
  };

  const handleRemoveImage = (imageUrl) => {
    setReviewData((prev) => {
      let images = prev.images.filter((image) => {
        return image.name !== imageUrl.name;
      });
      return { ...prev, images: [...images] };
    });
  };

  const handleClick = (e) => {
    const value = e.currentTarget.getAttribute("data-value");
    setRating(value);
    setReviewData({ ...reviewData, rating: value });
  };

  return (
    <div className="py-3 sm:max-w-xl sm:mx-auto">
      <div className="bg-white min-w-1xl flex flex-col rounded-xl shadow-lg">
        <div className="px-12 py-5">
          <h2 className="text-gray-800 text-3xl font-semibold">
            Your opinion matters to us!
          </h2>
        </div>
        <div className="bg-gray-200 w-full flex flex-col items-center">
          <div className="flex flex-col items-center">
            <div className="flex flex-row-reverse justify-center p-10">
              {[...Array(5)].map((_, key) => (
                <span
                  key={key}
                  data-value={5 - key}
                  fontSize="large"
                  className={`fa fa-star ${
                    rating < 5 - key ? "text-grey-100" : "text-yellow-700"
                  } peer peer-hover:text-yellow-700 hover:text-yellow-700 w-12 h-12 text-3xl mx-2 cursor-pointer`}
                  onClick={handleClick}
                ></span>
              ))}
            </div>
          </div>
          <div className="w-3/4 flex flex-col">
            <textarea
              rows="3"
              className="p-4 rounded-xl resize-none"
              placeholder="Leave a message, if you want"
              onChange={(e) => {
                setReviewData({ ...reviewData, message: e.target.value });
              }}
            />
            <div className="flex flex-wrap my-3 gap-3">
              {reviewData.images.map((image, index) => (
                <div key={index} className="relative inline-block">
                  <button
                    className="absolute -right-2 -top-3 bg-red-300 h-5 w-5 font-medium rounded-full"
                    onClick={() => handleRemoveImage(image)}
                  >
                    X
                  </button>
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`uploaded-img-${index}`}
                    className="object-cover w-24 h-24"
                  />
                </div>
              ))}
              <label
                htmlFor="reviewImage"
                className="bg-blue-gray-100 w-24 h-24 p-1 flex flex-col justify-center items-center rounded-md text-sm font-bold cursor-pointer"
              >
                <div className="text-lg mx-auto hover:scale-105 cursor-pointer font-bold h-7 w-7 flex justify-center items-center border-2 border-black rounded-full">
                  +
                </div>
                Add Image
              </label>
              <input
                className="hidden"
                id="reviewImage"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <button
              onClick={() => {
                reviewSubmitHandler(reviewData);
              }}
              className="py-3 my-8 text-lg bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl text-white"
            >
              Rate now
            </button>
          </div>
        </div>
        <div className="h-20 flex items-center justify-center">
          <Button onClick={turnWriteReviewOff} color="yellow">
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WriteReview;
