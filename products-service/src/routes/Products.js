import '@babel/polyfill'
import { Router } from "express";
import { getAllProducts, createProduct, getProduct } from '../controllers/Products'

const router = Router();


router.route("/")
        .get(getAllProducts)
        .post(createProduct);


router.route('/:id')
        .get(getProduct)
        .put()

export default router;