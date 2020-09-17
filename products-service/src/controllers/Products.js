import Product from '../models/Products';
import { validateInputsProducts, validateUser } from '../utils/validators'
import "dotenv/config";

export const createProduct = async (req, res) => {
    const error = {};
    const user = await validateUser(req.headers.authorization)

    if(!user.data.user) {
        error.token = "Sesión expirada"
        return res.status(403).json({
            error
        })
    }
    const { name, description, imageURL, quantity, price } = req.body;

    const { valid, errors } = validateInputsProducts(name, description, imageURL, quantity, price);

    if(!valid){
        return res.status(403).json({ errors });
    }

    const newProduct = await Product.create({
        name,
        description,
        imageURL,
        quantity,
        price,
        seller: user.data.user.id,
        createdAt: new Date(),
      });


      return res.status(201).json({
        product: newProduct,
      });

}

export const getAllProducts = async (req, res) => {

    const products = await Product.find();
    

    return res.status(200).json({
        products
    })
}

export const getProduct = async (req, res) => {
    const errors = {};

    const id = req.params.id;

    const product = await Product.findOne({_id: id});

    if(!product){
        errors.product = "Producto no encontrado";
        return res.status(200).json({errors})
    }
    

    return res.status(200).json({
        product
    })
}