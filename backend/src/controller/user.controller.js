import ErrorWrapper from "../error/ErrorWrapper.js";
import Users from "../models/users.model.js";
import Restaurants from "../models/restaurants.model.js"
import ErrorHandler from "../error/ErrorHandler.js";
import uploadOnCloudinary from "../utils/uploadOnCloudnary.js";
import tokenGenerator from "../utils/tokenGenerator.js";
import missingFieldArray from "../utils/missingFields.js";
import ForgotToken from "../models/forgot.js";
import mailer from "../utils/mailer.js";
import crypto from "crypto";

export const postSignup = ErrorWrapper(async (req, res, next) => {
    const { username, name, email, password } = req.body;
    const requiredFields = ["username", "password", "name", "email"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length > 0) {
        throw new ErrorHandler(401, `There are missing fields ${missingFields.join(",")} While Signup`);
    }

    const existingUser = await Users.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (existingUser) {
        throw new ErrorHandler(401, `User with username ${username} or email ${email} already exists`);
    }


    let newData = {
        username,
        password,
        email,
        name
    }


    if (req?.file) {
        try {
            let response = await uploadOnCloudinary(req.file.path);
            newData.image = response.secure_url;
        } catch (error) {
            throw new ErrorHandler(500, `Error While Uploading Image ${error.message}`);
        }
    }

    try {
        await Users.create(newData);

        const newUser = await Users.findOne({ email }).select("-password");

        res
            .status(201)
            .json({
                sucess: true,
                message: "Account Created Successfully",
                newUser
            })
    } catch (error) {
        throw new ErrorHandler(500, `Error while creating new user`);
    }
})




export const postLogin = ErrorWrapper(async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username && !email) {
        throw new ErrorHandler(400, "Please enter either username or email");
    }

    if (!password) {
        throw new ErrorHandler(400, "Please enter password");
    }

    const user = await Users.findOne({
        $or: [
            { username },
            { email }
        ]
    })

    if (!user) {
        throw new ErrorHandler(400, `User with ${username ? `username ${username}` : `email ${email}`} doesn't exists`);
    }

    const passwordMatch = await user.isPasswordCorrect(password);

    if (!passwordMatch) {
        throw new ErrorHandler(400, "Password is incorrect");
    }

    try {
        const [accessToken, refreshToken] = await tokenGenerator(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res
            .status(200)
            .cookie("RefreshToken", refreshToken, { path: '/', sameSite: 'None', secure: true })
            .cookie("AccessToken", accessToken, { path: '/', sameSite: 'None', secure: true })
            .json({
                success: true,
                message: `Login ${user.username} Successfully`,
                user,
                refreshToken
            });
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
})



export const getLogout = ErrorWrapper(async (req, res, next) => {
    const { RefreshToken } = req.cookies;
    if (!RefreshToken) {
        throw new ErrorHandler(401, "You need to login first");
    }

    res
        .clearCookie("RefreshToken")
        .json({
            success: true,
            message: `Logout Successfully`
        });
})


export const postForgotPassword = ErrorWrapper(async (req, res, next) => {
    const { email } = req.body;

    if (!email || email.trim().length === 0) {
        throw new ErrorHandler(404, "Please provide email");
    }

    let user;
    try {
        user = await Users.findOne({ email });
    } catch (error) {
        throw new ErrorHandler(501, "Error while fetching user data, Please try again later!!!")
    }

    if (!user) {
        throw new ErrorHandler(404, "There is no user associated with this email");
    }

    let ResetToken = crypto.randomBytes(132).toString('hex');

    const link = `${req.protocol}://${req.get('host')}/user/reset-password/${ResetToken}`;

    let tempToken = await ForgotToken.create({
        token: crypto.createHash("sha256").update(ResetToken).digest('hex'),
        id: user._id
    })

    await mailer(email, link).catch((error) => { throw new ErrorHandler(500, "Unable to send reset link right now") });

    res
        .status(200)
        .json({
            success: true,
            message: 'Email sent successfully, Check your email'
        })
})


export const getResetPassword = ErrorWrapper(async (req, res, next) => {
    const { token } = req.params;

    let userForgotToken = await ForgotToken.findOne({ token: crypto.createHash("sha256").update(token).digest('hex') });

    if (!userForgotToken) {
        return res.render("invalid");
    }

    res.render("reset", {
        token: token
    });
})


export const postResetPassword = ErrorWrapper(async (req, res, next) => {
    const { token } = req.params;
    const { password } = req.body;

    let userForgotToken;
    try {
        userForgotToken = await ForgotToken.findOne({ token: crypto.createHash("sha256").update(token).digest('hex') });
    } catch (error) {
        throw new ErrorHandler(500, "Encounter Database problem");
    }

    if (!userForgotToken) {
        return res.render("invalid")
    }

    try {
        let user = await Users.findOne({ _id: userForgotToken.id });
        user.password = password
        await user.save();
    } catch (error) {
        throw new ErrorHandler(500, "Encounter Database problem");
    }

    res.render("success", {
        message: "Password changed successfully go to login page"
    });
})


export const postME = ErrorWrapper(async (req, res, next) => {
    const { RefreshToken } = req.cookies;

    let user;
    try {
        user = await Users.findOne({ refreshToken: RefreshToken }).select("-password -refreshToken");
    } catch (error) {
        throw new ErrorHandler(500, "Error while fetching user");
    }

    if (!user) {
        throw new ErrorHandler(401, "Invalid User");
    }

    res
        .status(201)
        .json({
            success: true,
            message: "User found successfully",
            user
        })
})

export const postUpdate = ErrorWrapper(async (req, res, next) => {
    const { name, email, username } = req.body;
    const user = req.user;
    const requiredFields = ["name", "username", "email"];
    const missingFields = missingFieldArray(req.body, requiredFields);

    if (missingFields.length > 0) {
        throw new ErrorHandler(401, `There are missing fields ${missingFields.join(",")} While Signup`);
    }

    try {
        user.username = username;
        user.name = name;
        await user.save();
    }
    catch (error) {
        throw new ErrorHandler(500, "Problem to process request right now");
    }

    if (req?.file) {
        try {
            let response = await uploadOnCloudinary(req.file.path);
            user.avatar = response.secure_url;
        } catch (error) {
            throw new ErrorHandler(500, `Error While Uploading Image ${error.message}`);
        }
    }


    try {
        const [accessToken, refreshToken] = await tokenGenerator(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        res
            .status(200)
            .cookie("RefreshToken", refreshToken, { path: '/', sameSite: 'None', httpOnly: false, secure: true }) // Set path for RefreshToken to all paths
            .cookie("AccessToken", accessToken, { path: '/', sameSite: 'None', httpOnly: false, secure: true }) // Set path for AccessToken to all paths
            .json({
                success: true,
                message: `User ${user.username} updated successfully`
            });
    } catch (error) {
        throw new ErrorHandler(500, error.message);
    }
})


export const postCartAdd = ErrorWrapper(async (req, res, next) => {
    const { foodId, Restaurant_id, category } = req.body;
    let user = req.user;

    let IndexIfAlreadyExist = user.cart.findIndex((item) => item.food._id.toString() === foodId);

    try {
        if (IndexIfAlreadyExist !== -1) {
            user.cart[IndexIfAlreadyExist].quantity++;
            await user.save();
            return res
                .status(200)
                .json({
                    sucess: true,
                    message: "Item Updated in cart"
                })
        }
    }
    catch (error) {
        throw new ErrorHandler(500, "DataBase Error");
    }

    let restaurant;
    try {
        restaurant = await Restaurants.findOne({ _id: Restaurant_id });
    } catch (error) {
        throw new ErrorHandler(500, "Encountring Error While fetching Restaurant");
    }

    if (!restaurant) {
        throw new ErrorHandler(401, "Restaurant not found");
    }

    let cuisines = restaurant.cusines;

    let Categoryindex = cuisines.findIndex((item) => item.category === category);

    if (Categoryindex == -1) {
        throw new ErrorHandler(401, "Category Not found Try again after some time");
    }

    let foodIndex = cuisines[Categoryindex].food.findIndex((item) => item._id == foodId);

    const cartItem = {
        food: cuisines[Categoryindex].food[foodIndex],
        quantity: 1
    }

    try {
        cartItem.category = cuisines[Categoryindex].category;
        cartItem.Restaurant_id = Restaurant_id;
        user.cart.unshift(cartItem);
        await user.save();
    } catch (error) {
        throw new ErrorHandler(500, "Problem in Database Try after some time");
    }

    res
        .status(200)
        .json({
            sucess: true,
            message: "Item Added in cart",
            count: user.cart.length
        })
})

export const getCart = ErrorWrapper(async (req, res, next) => {
    res
        .status(200)
        .json({
            sucess: true,
            cart: req.user.cart
        })
})

export const getCartRemove = ErrorWrapper(async (req, res, next) => {
    const { foodId } = req.params;
    let user = req.user;

    let index = user.cart.findIndex((item) => item._id.toString() === foodId);

    if (index === -1) {
        throw new ErrorHandler(400, "Not Found in your cart");
    }

    try {
        user.cart.splice(index, 1);
        await user.save();
        return res
            .status(200)
            .json({
                sucess: true,
                message: "Item Remove from cart"
            })
    }
    catch (error) {
        throw new ErrorHandler(500, "DataBase Error");
    }
})

export const getOrderPlace = ErrorWrapper(async (req, res, next) => {
    let user = req.user;
    return res
        .status(200)
        .json({
            sucess: true,
            message: "History fetched successfully",
            history: user.orderHistory,
        })
})

export const getCartOrderPlace = ErrorWrapper(async (req, res, next) => {
    let user = req.user;
    let historyObj = { item: [] };

    if (!user.cart.length) {
        throw new ErrorHandler(400, "Please add items in cart");
    }

    user.cart.forEach(item => {
        let obj = {};
        obj.food = item.food;
        obj.quantity = item.quantity;
        obj.Restaurant_id = item.Restaurant_id
        obj.category = item.category
        historyObj.item.push(obj);
    });

    try {
        user.orderHistory.unshift(historyObj);
        user.cart = [];
        await user.save();
    } catch (error) {
        throw new ErrorHandler(500, "Error While saving data in database");
    }

    res
        .status(200)
        .json({
            success: true,
            message: "Order Placed Successfully"
        })
})

export const postOrderHistoryBuy = ErrorWrapper(async (req, res, next) => {
    const { items } = req.body;
    const user = req.user;

    if (!items) {
        throw new ErrorHandler(400, "Please provide required details");
    }

    let cart = [];

    try {
        items.item.forEach(element => {
            let obj = {};
            obj.food = element.food,
                obj.quantity = element.quantity,
                obj.category = element.category,
                obj.Restaurant_id = element.Restaurant_id
            cart.push(obj);
        })
    } catch (error) {
        throw new ErrorHandler(400, "Required data is not in proper form")
    }

    try {
        user.cart = [...cart];
        await user.save();
    } catch (error) {
        throw new ErrorHandler(500, "Problem in server db try after some time")
    }

    res
        .status(200)
        .json({
            success: true,
            message: "Items Added in cart"
        })

})