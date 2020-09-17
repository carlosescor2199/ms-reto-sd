import { Schema, model } from 'mongoose';


const userSchema = new Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    birthDate: {
        type: Date
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: Date,
})


export default model('User', userSchema);