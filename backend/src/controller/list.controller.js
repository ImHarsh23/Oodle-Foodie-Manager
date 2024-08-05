import Restaurants from "../models/restaurants.model.js"
import ErrorWrapper from "../error/ErrorWrapper.js"
import ErrorHandler from "../error/ErrorHandler.js"

export const getRestaurants = ErrorWrapper(async (req, res, next) => {
    try {
        const restaurantsList = await Restaurants.find({}).select('-ownerId -email');
        res
            .status(200)
            .json({
                success: true,
                restaurantsList
            })
    } catch (error) {
        throw new ErrorHandler(500, "Error during fetching database");
    }
})

export const getSearch = ErrorWrapper(async (req, res, next) => {
    const { keyword } = req.query;

    try {
        let restaurants = await Restaurants.find({ name: { $regex: `${keyword}`, $options: 'i' } });
        res.status(200).json({
            success: true,
            message: "Restaurants fetched successfully",
            restaurants
        });
    }
    catch (error) {
        throw new ErrorHandler(500, "Encountering Problem while fetching desired restaurants");
    }
})

