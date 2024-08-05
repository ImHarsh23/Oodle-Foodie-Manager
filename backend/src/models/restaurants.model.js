import mongoose from "mongoose";
import uploadOnCloudinary from "../utils/uploadOnCloudnary.js";
import { Schema } from "mongoose";

const restaurantSchema = mongoose.Schema({
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "Users"
    },
    name: {
        type: String,
        lowercase: true,
        required: true,
        unique: true
    },

    address: {
        type: String,
        lowercase: true,
        unique: true
    },

    contact: {
        type: Number,
        required: true
    },

    email: {
        type: String,
        lowercase: true,
    },

    coverImage: {
        type: String,
        required: true
    },

    description: String,

    images: [
        {
            url: String
        }
    ],

    rating: {
        type: Number,
        default: 0
    },

    cusines: [
        {
            category: String,
            food: [
                {
                    name: String,
                    price: Number,
                    description: String,
                    veg: Boolean,
                    image: [
                        {
                            url: String
                        }
                    ]
                }
            ]
        }
    ],

    cusineCategories: [
        {
            type: String
        }
    ],

    menu: [
        {
            imageUrl: String
        }
    ],

    reviews: [
        {
            userId: {
                type: Schema.Types.ObjectId,
                ref: "Users"
            },

            rating: {
                type: Number,
                default: 1
            },

            images: [
                {
                    url: String
                }
            ],

            message: {
                type: String
            },

            username: String,

            avatar: String,

            postDate: {
                type: Date,
                default: Date.now()
            }
        }
    ]
}, {
    timestamps: true
});


restaurantSchema.pre("save", async function (next) {
    if (!this.isModified("coverImage")) return next();

    const restaurant = this;
    let response = null;
    try {
        response = await uploadOnCloudinary(restaurant.coverImage);
        restaurant.coverImage = response.secure_url;
    } catch (error) {
        throw new Error("Something went wrong");
    }
})

restaurantSchema.pre("save", function (next) {
    if (!this.isModified("cusines")) return next();

    let cusines = this.cusines;
    let cusineCategories = this.cusineCategories;

    try {
        cusines.forEach(element => {
            if (!cusineCategories.includes(element.category)) {
                cusineCategories.push(element.category);
            }
        });
    } catch (error) {
        throw new Error("Encountring server Error");
    }

    next();
})

export default mongoose.model("Restaurants", restaurantSchema);