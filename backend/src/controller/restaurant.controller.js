import Restaurants from "../models/restaurants.model.js";
import ErrorHandler from "../error/ErrorHandler.js";
import ErrorWrapper from "../error/ErrorWrapper.js";
import imageDestroyer from "../utils/imageDestroyer.js";
import uploadOnCloudinary, { uploadBatchOnCloudinary } from "../utils/uploadOnCloudnary.js";
import missingFieldArray from "../utils/missingFields.js";


export const postRestaurant = ErrorWrapper(async (req, res, next) => {
    const { name } = req.body;
    if (!name || !name.trim().length) {
        throw new ErrorHandler(401, "name field can't be empty");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name });
    } catch (error) {
        throw new ErrorHandler(401, "Server Error during fetching database");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, `There is no restaurant with name ${name}`);
    }

    res
        .status(200)
        .json({
            success: true,
            message: "Restaurant found successfully",
            restaurant
        })
})

export const postAdd = ErrorWrapper(async (req, res, next) => {
    const { name, address, contact, description } = req.body;
    const email = req.user.email;

    const requiredFields = ["name", "address", "contact", "description"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length) {
        if (!req?.file) { missingFields.push("image") }
        throw new ErrorHandler(401, `Provide missing fields ${[missingFields].join(", ")} to add a restaurant`);
    }

    if (!req.file) {
        throw new ErrorHandler(401, "Provide missing fields coverImage to add a restaurant");
    }

    let existingRestaurant;
    try {
        existingRestaurant = await Restaurants.findOne({
            $or: [
                { name },
                { address }
            ]
        })
    } catch (error) {
        throw new ErrorHandler(500, "Error during data fetching");
    }

    if (existingRestaurant) {
        imageDestroyer(req.file.path);
        throw new ErrorHandler(401, "Restaurant with this credentials already exist");
    }

    try {
        const newRestaurant = await Restaurants.create({
            name,
            address,
            email,
            contact,
            coverImage: req.file.path,
            ownerId: req.user._id,
            description
        })

        res.status(200).json({
            sucess: true,
            message: `Your Restaurant ${name} added successfully`,
            newRestaurant
        })

    } catch (error) {
        throw new ErrorHandler(500, "Failed to add restaurant try after sometime");
    }
})


export const getDelete = ErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;

    const requiredFields = ["id"];
    const missingFields = missingFieldArray(req.params, requiredFields);

    if (missingFields.length) {
        throw new ErrorHandler(401, `Provide missing fields ${[missingFields].join(", ")} to add a restaurant`);
    }

    let existingRestaurant;
    try {
        existingRestaurant = await Restaurants.findOne({
            $or: [
                { _id: id }
            ]
        })
    } catch (error) {
        throw new ErrorHandler(500, "Error during data fetching");
    }

    if (!existingRestaurant) {
        throw new ErrorHandler(401, "Restaurant does not exist");
    }

    if (existingRestaurant.ownerId.toString() !== user._id.toString()) {
        throw new ErrorHandler(401, "You are not authorized to delete this restaurant");
    }


    try {
        const newRestaurant = await Restaurants.deleteOne({
            _id: id
        })

        res.status(200).json({
            sucess: true,
            message: `Your Restaurant deleted successfully`,
        })

    } catch (error) {
        console.log(error);
        throw new ErrorHandler(500, "Failed to add restaurant try after sometime");
    }
})



export const postCuisineCategoryAdd = ErrorWrapper(async (req, res, next) => {
    const { category, restaurant_name } = req.body;

    if (!category) throw new ErrorHandler(400, "Category can't be empty");

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    } catch (error) {
        throw new ErrorHandler(500, "Error while fetching your restaurant!!!");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, `There is no restaurant with name ${restaurant_name}`);
    }

    if (restaurant.email !== req.user.email) {
        throw new ErrorHandler(401, "You are not authorized to add categories to this restaurant");
    }

    const existedCategoriesList = restaurant.cusineCategories;

    if (existedCategoriesList.includes(category)) {
        throw new ErrorHandler(401, "All provided category are already existing");
    }

    try {
        const newCategory = { category, food: [] };
        restaurant.cusines.push(newCategory);
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Server Error during saving data");
    }

    res.status(200).json({
        success: true,
        message: "Cuisines added successfully to your restaurant"
    });
});





export const postCuisineCategoryRemove = ErrorWrapper(async (req, res, next) => {
    const { category, restaurant_name } = req.body;

    if (!category) throw new ErrorHandler(400, "Category can't be empty");

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    } catch (error) {
        throw new ErrorHandler(500, "Error while fetching your restaurant!!!");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, `There is no restaurant with name ${restaurant_name}`);
    }

    if (restaurant.email !== req.user.email) {
        throw new ErrorHandler(401, "You are not authorized to delete categories to this restaurant");
    }

    const existedCategoriesList = restaurant.cusineCategories;

    let index = existedCategoriesList.indexOf(category);

    if (index === -1) {
        throw new ErrorHandler(401, `${category} doesn't exist in your cuisines`);
    }

    existedCategoriesList.splice(index, 1);


    try {
        let indexToDelete = restaurant.cusines.findIndex(cuisine => cuisine.category === category);
        restaurant.cusines.splice(indexToDelete, 1);
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Server Error during saving data");
    }

    res.status(200).json({
        success: true,
        message: "Cuisine deleted successfully from your restaurant"
    });
});


export const postAddFoodItem = ErrorWrapper(async (req, res, next) => {
    let { category, name, price, description, restaurant_name, veg } = req.body;

    const requiredFields = ["category", "name", "price", "description", "restaurant_name", "veg"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length > 0) {
        throw new ErrorHandler(401, `Provide missing fields ${missingFields.join(", ")} to add a restaurant`);
    }

    if (!req.file) {
        throw new ErrorHandler(401, `Provide missing fields image`);

    }

    let restaurant;
    try {
        name = name.toLowerCase().trim();
        description = description.trim();
        restaurant_name = restaurant_name.toLowerCase().trim();
        veg = veg.toLowerCase().trim() === "true" ? true : false;

        restaurant = await Restaurants.findOne({ name: restaurant_name })
    } catch (error) {
        throw new ErrorHandler(500, "Error during fetching data try after some time");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Restaurant with this name doesn't exist");
    }

    if (restaurant.email !== req.user.email) {
        throw new ErrorHandler(401, "You are not authorized to add food to this restaurant");
    }

    const [selectedRestaurantCuisines] = restaurant.cusines.filter((item) => {
        return item.category === category;
    })

    if (!selectedRestaurantCuisines) {
        throw new ErrorHandler(404, `Please add the category first in which you want to add ${name}`);
    }

    const isFoodAlreadyExist = selectedRestaurantCuisines.food.filter((item) => (
        item.name === name
    ))

    if (isFoodAlreadyExist.length > 0) {
        throw new ErrorHandler(401, "There can't be multiple food items with same name")
    }

    try {
        const response = await uploadOnCloudinary(req.file.path);
        selectedRestaurantCuisines.food.push({ name, price, description, veg, image: [{ url: response.secure_url }] });
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(401, "Error while saving food in database");
    }

    res.status(200).json({
        success: true,
        message: "Food Added Successfully"
    })
})



export const postRestaurantUpdate = ErrorWrapper(async (req, res, next) => {
    const { address, contact, description, _id } = req.body;
    try {
        let restaurant = await Restaurants.findOne({ _id });
        restaurant.address = address;
        restaurant.contact = contact;
        restaurant.description = description;
        if (req.file) {
            restaurant.coverImage = req.file.path;
        }
        await restaurant.save();
    } catch (error) {
        ErrorHandler(500, "Facing problem while fetching information");
    }

    res.status(200).json({
        success: true,
        message: "Updated successfully"
    })
})



export const postUpdateFoodItem = ErrorWrapper(async (req, res, next) => {

    let { category, name, price, description, restaurant_name, veg } = req.body;

    const requiredFields = ["category", "name", "price", "description", "restaurant_name", "veg"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length) {
        throw new ErrorHandler(401, `Provide missing fields ${missingFields.join(", ")} to add a restaurant`);
    }

    let restaurant;
    try {
        name = name.toLowerCase().trim();
        description = description.trim();
        restaurant_name = restaurant_name.toLowerCase().trim();
        veg = veg.toLowerCase().trim() === "true" ? true : false;

        restaurant = await Restaurants.findOne({ name: restaurant_name })
    }
    catch (error) {
        throw new ErrorHandler(500, "Error during fetching data try after some time");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Restaurant with this name not found");
    }

    if (restaurant.email !== req.user.email) {
        throw new ErrorHandler(401, `You are not authorized to add categories in ${restaurant.name} restaurant, You are not owner`);
    }

    const [selectedRestaurantCuisines] = restaurant.cusines.filter((item) => {
        return item.category === category;
    })

    let index = -1;
    for (let i = 0; i < selectedRestaurantCuisines.food.length; i++) {
        if (selectedRestaurantCuisines.food[i].name === name) {
            index = i;
            break;
        }
    }


    let images = [];
    try {
        if (req?.file) {
            const response = await uploadOnCloudinary(req.file.path);
            let imgObj = { url: response.secure_url };
            images.push(imgObj);
        }
    } catch (error) {
        throw new Error(500, "Error While uploading images on server");
    }

    const updatedFood = {
        name: name,
        price: +price,
        description,
        veg,
        image: [...images]
    }

    selectedRestaurantCuisines.food[index].name = name;
    selectedRestaurantCuisines.food[index].price = price;
    selectedRestaurantCuisines.food[index].description = description;
    selectedRestaurantCuisines.food[index].veg = veg;
    if (req?.file) {
        selectedRestaurantCuisines.food[index].image = images;
    }
    await restaurant.save();

    res.status(200).json({
        success: true,
        message: `${name} updated successfilly`,
        updatedFood
    })
})


export const postUpdateMenuItem = ErrorWrapper(async (req, res, next) => {
    const { restaurant_name } = req.body;

    if (!restaurant_name || !restaurant_name.trim().length) {
        throw new ErrorHandler(401, "Restaurant name field can not be empty");
    }

    if (!req.file) {
        throw new ErrorHandler(401, "Provide menu image");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    } catch (error) {
        throw new ErrorHandler(500, "Error during fetching data");
    }

    if (restaurant.email !== req.user.email) {
        throw new ErrorHandler(401, "You can't do any operation on other's restaurant");
    }

    try {
        let response = await uploadOnCloudinary(req.file.path);
        restaurant.menu.push({ imageUrl: response.secure_url });
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Error during uploading image");
    }

    res
        .status(201)
        .json({
            success: true,
            message: "Menu image uploaded successfully"
        })
})


export const getDeleteFoodItem = ErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { restaurant_name, category } = req.query;

    try {
        const restaurant = await Restaurants.findOne({ name: restaurant_name });
        if (!restaurant) {
            throw new ErrorHandler(404, `Restaurant with name ${restaurant_name} not found`);
        }
        const user = req.user;
        if (user._id.toString() !== restaurant.ownerId.toString()) {
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }
        const index = restaurant.cusines.findIndex((item) => item.category === category);
        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the food item of ${restaurant_name}`);
        }
        const foodIndex = restaurant.cusines[index]["food"].findIndex((item) => item._id.toString() === id.toString());

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        restaurant.cusines[index]["food"].splice(foodIndex, 1);
        await restaurant.save();
        res.status(200).json({
            success: true,
            message: "Food item deleted successfully!",
            data: restaurant
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


export const getFoodItems = ErrorWrapper(async (req, res, next) => {
    const { restaurant_name, category } = req.query;
    try {
        const restaurant = await Restaurants.findOne({ name: restaurant_name });
        if (!restaurant) {
            throw new ErrorHandler(404, `Restaurant with name ${restaurant_name} not found`);
        }
        const user = req.user;
        if (user._id.toString() !== restaurant.ownerId.toString()) {
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }
        const index = restaurant.cusines.findIndex((item) => item.category === category);
        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the
                    food item of ${restaurant_name}`);
        }
        const food = restaurant.cusines[index]["food"];
        res.status(200).json({
            success: true,
            message: "Food items fetched successfully!",
            data: food
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})

export const getFoodItem = ErrorWrapper(async (req, res, next) => {
    const { id } = req.params;
    const { restaurant_name, category } = req.query;

    try {
        const restaurant = await Restaurants.findOne({ name: restaurant_name });
        if (!restaurant) {
            throw new ErrorHandler(404, `Restaurant with name ${restaurant_name} not found`);
        }
        const user = req.user;
        if (user._id.toString() !== restaurant.ownerId.toString()) {
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }
        const index = restaurant.cusines.findIndex((item) => item.category === category);
        if (index == -1) {
            throw new ErrorHandler(404, `Please add the category first in which you want to update the food item of ${restaurant_name}`);
        }
        const foodIndex = restaurant.cusines[index]["food"].findIndex((item) => item._id.toString() === id.toString());

        if (foodIndex == -1) {
            throw new ErrorHandler(404, `Please provide the correct details - food or id inorder to update the details`);
        }

        const food = restaurant.cusines[index]["food"][foodIndex];

        res.status(200).json({
            success: true,
            message: "Food item deleted successfully!",
            data: food
        })
    } catch (error) {
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})



export const getAllCusines = ErrorWrapper(async (req, res, next) => {
    const { restaurant_name } = req.params;

    try {
        const restaurant = await Restaurants.findOne({ name: restaurant_name });
        if (!restaurant) {
            throw new ErrorHandler(404, `Restaurant with name ${restaurant_name} not found`);
        }
        const user = req.user;
        if (user._id.toString() !== restaurant.ownerId.toString()) {
            throw new ErrorHandler(401, "You are not authorized to perform this action");
        }

        const food = restaurant.cusines;

        res.status(200).json({
            success: true,
            message: "Food items fetched successfully!",
            data: food
        })
    } catch (error) {
        console.log(error);
        throw new ErrorHandler(error.statusCode || 500, error.message);
    }
})


export const getUser = ErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    try {
        const restaurants = await Restaurants.find({ ownerId: id });

        res.status(200).json({
            success: true,
            message: "Restaurants found",
            restaurants,
        });
    } catch (error) {
        console.log(error)
        throw new ErrorHandler(500, 'Error fetching restaurants');
    }
})

export const postAddReview = ErrorWrapper(async (req, res) => {
    const { restaurant_name, rating, message } = req.body;
    const userId = req.user._id;
    const { username, avatar } = req.user;

    const requiredFields = ["restaurant_name", "message"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length) {
        throw new ErrorHandler(401, `Provide missing fields ${[missingFields].join(", ")} to add a restaurant`);
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    }
    catch (error) {
        throw new Error(500, "Encountering problem in Server");
    }

    if (userId.toString() === restaurant.ownerId.toString()) {
        throw new ErrorHandler(401, "You can't rate Your own restaurant");
    }

    const review = {
        userId,
        message,
        username,
        avatar
    }

    if (rating) {
        review.rating = rating;
    }

    if (req.files) {
        try {
            const response = await uploadBatchOnCloudinary(req.files);
            const imageUrl = [];
            for (let i = 0; i < response.length; i++) {
                imageUrl.push({
                    "url": response[i].url
                });
            }
            review.images = imageUrl;
        }
        catch {
            throw new ErrorHandler(500, "Encountering error while uploading set of images");
        }
    }

    try {
        let finalRating = restaurant.rating * restaurant.reviews.length;
        finalRating = finalRating + (+rating);
        finalRating = finalRating / (restaurant.reviews.length + 1);
        restaurant.reviews.unshift(review);
        restaurant.rating = finalRating;
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Problem while saving data in DB");
    }

    res
        .status(201)
        .json({
            success: true,
            message: "Review posted successfully"
        })
})

export const getGetReview = ErrorWrapper(async (req, res) => {
    const { restaurant_name } = req.params;

    if (!restaurant_name || !restaurant_name.trim().length) {
        throw new ErrorHandler("Please provide details");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    }
    catch (error) {
        throw new Error(500, "Encountering problem in Server");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Unable to find this restaurant");
    }
    res
        .status(201)
        .json({
            success: true,
            message: "Review posted successfully",
            reviews: restaurant.reviews
        })
})

export const postDeleteReview = ErrorWrapper(async (req, res) => {
    const { reviewId } = req.params;
    const { restaurant_name } = req.body;

    if (!reviewId || !reviewId.trim().length) {
        throw new ErrorHandler("Please provide details");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    }
    catch (error) {
        throw new Error(500, "Encountering problem in Server");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Unable to find this restaurant");
    }

    const index = restaurant.reviews.findIndex(item => item._id.toString() === reviewId);

    if (index === -1) {
        throw new ErrorHandler(402, "Review not found");
    }

    if (req.user._id.toString() !== restaurant.reviews[index].userId.toString()) {
        throw new ErrorHandler(401, "Unauthorize Operation");
    }

    try {
        restaurant.reviews.splice(index, 1);
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Database Issue");
    }

    res
        .status(201)
        .json({
            success: true,
            message: "Review removed successfully",
        })
})

export const postUpdateReview = ErrorWrapper(async (req, res, next) => {
    const { reviewId } = req.params;
    const { message, restaurant_name, rating } = req.body;

    if (!message) {
        throw new ErrorHandler(401, "Message can't be empty");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ name: restaurant_name });
    }
    catch (error) {
        throw new ErrorHandler(500, "Encountering problem in Server");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Unable to find this restaurant");
    }

    const index = restaurant.reviews.findIndex(item => item._id.toString() === reviewId);

    if (index !== -1) {
        let review = restaurant.reviews[index];
        review.message = message;
        review.rating = rating;
    }

    if (req.user._id.toString() !== restaurant.reviews[index].userId.toString()) {
        throw new ErrorHandler(401, "Unauthorize Operation");
    }

    try {
        await restaurant.save();
    } catch (error) {
        throw new ErrorHandler(500, "Database Issue");
    }

    res
        .status(201)
        .json({
            success: true,
            message: "Review updated successfully",
        })
})