import express from "express"
import { getRestaurants, getSearch } from "../controller/list.controller.js";
const router = express.Router();

router.get("/restaurants", getRestaurants);

router.get("/search", getSearch);

export default router;
