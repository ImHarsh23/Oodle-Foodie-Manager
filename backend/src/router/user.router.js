import express from "express"
const router = express.Router();
import { postSignup, postLogin, getLogout, postForgotPassword, getResetPassword, postResetPassword, postME, postUpdate, postCartAdd, getCart, getCartRemove, getOrderPlace, getCartOrderPlace, postOrderHistoryBuy } from "../controller/user.controller.js";
import upload from "../utils/multer.js"
import verifyJWT from "../middleware/verifyJWT.js";

router.post("/signup", upload.single("image"), postSignup);

router.post("/login", postLogin);

router.get("/logout", getLogout);

router.post("/forgot-password", postForgotPassword);

router.get("/reset-password/:token", getResetPassword);

router.post("/reset-password/:token", postResetPassword);

router.post("/me", verifyJWT, postME);

router.post("/update", verifyJWT, upload.single("image"), postUpdate);

//Cart
router.get("/cart", verifyJWT, getCart);
router.post("/cart/add", verifyJWT, postCartAdd);
router.get("/cart/remove/:foodId", verifyJWT, getCartRemove);

//orderPlace
router.get("/cart/order/place", verifyJWT, getCartOrderPlace);

//Order History
router.get("/ordersHistory", verifyJWT, getOrderPlace);
router.post("/ordersHistory/buy", verifyJWT, postOrderHistoryBuy);

export default router;