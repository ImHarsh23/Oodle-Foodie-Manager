import express from "express"
import upload from "../utils/multer.js"
import { postRestaurant, postAdd, getDelete, postCuisineCategoryAdd, postCuisineCategoryRemove, postAddFoodItem, postUpdateFoodItem, postUpdateMenuItem, postRestaurantUpdate, getDeleteFoodItem, getFoodItems, getFoodItem, getAllCusines, getUser, postAddReview, getGetReview, postDeleteReview, postUpdateReview } from "../controller/restaurant.controller.js";
const router = express.Router();

//General

router.post("/", postRestaurant);
router.post("/add", upload.single("image"), postAdd);
router.get("/delete/:id", getDelete);
router.post("/restaurant-update", upload.single("image"), postRestaurantUpdate);


//Cuisine
router.post("/cuisine-category-add", postCuisineCategoryAdd);
router.post("/cuisine-category-remove", postCuisineCategoryRemove);
router.get("/user/:id", getUser);
router.get('/all-cuisines/:restaurant_name', getAllCusines);

//Food
router.post("/add-food-item", upload.single("image"), postAddFoodItem);
router.get('/food-items', getFoodItems);
router.get('/food-item/:id', getFoodItem);
router.get('/delete-food-item/:id', getDeleteFoodItem);
router.post("/update-food-item", upload.single("image"), postUpdateFoodItem);

//menu
router.post("/update-menu-item", upload.single("image"), postUpdateMenuItem);

//review
router.post("/add-review", upload.array("images", 10), postAddReview);
router.get("/get-review/:restaurant_name", getGetReview);
router.post("/delete-review/:reviewId", postDeleteReview);
router.post("/update-review/:reviewId", postUpdateReview);

export default router;

//upload.single() is used to attach image in request object req.file and req.files for multiple image.