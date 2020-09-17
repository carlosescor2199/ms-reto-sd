import '@babel/polyfill';
import { Router } from "express";
import { get } from "mongoose";
import { addProduct, getCart, updateQuatityProductCart, clearCart } from '../controllers/Cart'

const router = Router();


router.route("/")
        .get(getCart)
        .post(addProduct)
        .put(updateQuatityProductCart)
        .delete(clearCart)
        

export default router;