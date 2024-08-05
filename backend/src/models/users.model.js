import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    image: {
        type: String,  //cloudnary url
    },
    avatar: {
        type: String,
    },
    orderHistory: [
        {
            date: {
                type: Date,
                default: Date.now
            },
            item: [
                {
                    food: Object,
                    quantity: Number,
                    Restaurant_id: Schema.Types.ObjectId,
                    category: String
                }
            ]
        }
    ],
    cart: [
        {
            food: Object,
            quantity: Number,
            Restaurant_id: Schema.Types.ObjectId,
            category: String
        }
    ],
    password: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String
    }
}, {
    timestamps: true
});

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();

    const user = this;
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    })
})

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        userId: this._id
    },
        process.env.REFRESH_TOKEN_KEY,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        })
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        userId: this._id,
        email: this.email,
        username: this.username,
        name: this.name
    },
        process.env.ACCESS_TOKEN_KEY,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        })
}

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model("Users", userSchema);