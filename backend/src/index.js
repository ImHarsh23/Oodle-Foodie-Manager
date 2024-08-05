import express from "express"
import mongoose from "mongoose";
import cors from "cors"
import cookieParser from "cookie-parser";
import userRouter from "./router/user.router.js";
import restaurantRoute from "./router/restaurant.router.js";
import RestaurantList from "./router/list.router.js"
import verifyJWT from "./middleware/verifyJWT.js";

const app = express();
const Port = process.env.Port;

app.set('view engine', 'hbs');
app.use(cors({
    origin: JSON.parse(process.env.CORS_ORIGINS),
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(express.json({ limit: "4kb" }));
app.use(express.urlencoded({ extended: true, limit: "4kb" }));
app.use(express.static("public"));
app.use(cookieParser());


/* App routes start*/
app.use("/user", userRouter);
app.use("/restaurant", verifyJWT, restaurantRoute);
app.use("/list", RestaurantList);
/* App routes end*/


mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@oodle.rpkkw6w.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority&appName=OODLE`).then(() => {
    app.listen(Port, () => {
        console.log("Server Running At Port:", Port);
    })
}).catch(() => {
    throw new Error("Error in database");
})

