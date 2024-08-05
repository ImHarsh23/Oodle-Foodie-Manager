import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Card } from "@material-tailwind/react";

const RestaurantCard = ({ name, image, categorys, id, description }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  return (
    <div className="p-5 w-full max-w-96 sm:max-w-full">
      <Card
        style={{ display: "flex" }}
        className="shadow-2xl shadow-black h-full flex flex-col rounded-lg overflow-hidden hover:scale-105 transition-all duration-300"
      >
        <div>
          <img
            src={image}
            alt="Bold typography"
            className="rounded-2xl"
            style={{
              display: "block",
              objectFit: "cover",
              width: "100%",
              height: 200,
              padding: "0.5rem",
            }}
          />
        </div>
        <div className="py-1 px-3">
          <p className="font-bold text-gray-700 text-xl leading-7 uppercase">
            {name}
          </p>
          <p className="text-[#7C7C80] font-[15px]">
            {categorys.join().length > 19
              ? categorys.join().slice(0, 17) + "..."
              : categorys.join()}
          </p>
          <p className="text-sm mb-0.5">
            {description.length > 70
              ? description.slice(0, 70) + "..."
              : description}
          </p>
        </div>
        <Link
          onClick={(e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              toast.error("You need to Login");
            }
          }}
          className="mt-auto m-4"
          to={`restaurant/${name}`}
        >
          <div className="block w-full py-2 font-medium tracking-wide text-center capitalize transition-colors duration-300 transform bg-[#FFC933] hover:bg-[#FFC933DD] rounded-md hover:bg-[#314379] focus:outline-none focus:ring focus:ring-teal-300 focus:ring-opacity-80">
            Go inside
          </div>
        </Link>
      </Card>
    </div>
  );
};

export default RestaurantCard;
