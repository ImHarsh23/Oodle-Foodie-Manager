import mongoose from "mongoose";
import { Schema } from "mongoose";

const forgotUserSchema = Schema({
    token: String,
    id: Schema.Types.ObjectId,
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 200
    }
})

export default mongoose.model("forgotToken", forgotUserSchema);