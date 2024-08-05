import ErrorWrapper from "../error/ErrorWrapper.js";
import ErrorHandler from "../error/ErrorHandler.js";
import jwt from "jsonwebtoken";
import Users from "../models/users.model.js";

const verifyJWT = ErrorWrapper(async (req, res, next) => {
    let { AccessToken, RefreshToken } = req.cookies;

    if (!AccessToken || !RefreshToken) {
        throw new ErrorHandler(401, "Unauthozied Access, Kindly login First");
    }

    let user;
    try {
        const { userId, email, username, name } = jwt.verify(AccessToken, process.env.ACCESS_TOKEN_KEY);
        user = await Users.findOne({
            $or: [
                { _id: userId },
                { email: email },
                { username: username }
            ]
        })
    } catch (error) {
        throw new ErrorHandler(401, error.message);
    }

    if (!user) {
        throw new ErrorHandler(401, "User Doesn't exist");
    }

    if (user.refreshToken != RefreshToken) {
        throw new ErrorHandler(401, "Not Autorized to access, Kindly login first");
    }

    req.user = user;
    next();
})

export default verifyJWT;