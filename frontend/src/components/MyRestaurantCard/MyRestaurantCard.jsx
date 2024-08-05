import {
  Card,
  CardBody,
  CardFooter,
  Typography,
  Button as Button2,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

const MyRestaurantCard = ({
  id,
  name,
  description,
  popUp,
  setPopUp,
  setDeleteId,
}) => {
  return (
    <Card className="w-full max-w-96 sm:max-w-full">
      <div className="p-4">
        <Typography variant="h5" color="blue-gray" className="mb-2 uppercase">
          {name}
        </Typography>
        <Typography>
          {" "}
          {description.length > 100
            ? description.slice(0, 100) + "..."
            : description}
        </Typography>
      </div>
      <div className="mt-auto flex flex-nowrap p-4">
        <div className=" flex flex-nowrap">
          <Link to={`/restaurant/${name}/edit`}>
            <Button2 className="bg-yellow-800 hover:bg-yellow-900 mr-4">
              Edit Restaurant
            </Button2>
          </Link>
          <Button2
            onClick={() => {
              setPopUp(!popUp);
              setDeleteId(id);
            }}
            className="bg-transparent shadow-none text-black border-2 hover:bg-red-300 hover:text-white px-3 py-2 rounded-md"
          >
            Delete
          </Button2>
        </div>
      </div>
    </Card>
  );
};

export default MyRestaurantCard;
