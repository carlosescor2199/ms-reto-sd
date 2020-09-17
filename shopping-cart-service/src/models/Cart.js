import { Schema, model } from 'mongoose';


const cartSchema = new Schema({
    user: {
        type: String,
        required: true,
        unique: true
    },
    products: [
        {
            id_product: {
                type: String,
                required: true,
            },
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            imageURL: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            seller: {
                type: String,
                required: true
            },
        }
    ]
})

export default model('cart', cartSchema);