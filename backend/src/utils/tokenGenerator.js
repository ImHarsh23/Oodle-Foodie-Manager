import Users from "../models/users.model.js";
import ErrorHandler from "../error/ErrorHandler.js";

const tokenGenerator = async (userId) => {
    try {
        const user = await Users.findOne({ _id: userId });
        if (!user) {
            throw new Error("User not found");
        }
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();
        return [accessToken, refreshToken];

    } catch (error) {
        throw new ErrorHandler(500, "Error while generating access token and refresh token");
    }
}

export default tokenGenerator;