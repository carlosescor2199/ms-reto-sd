import { Schema, model } from 'mongoose';

const productsSchema = new Schema({
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
    createdAt: {
        type: Date,
        required: true
    }
});

export default model('products', productsSchema);