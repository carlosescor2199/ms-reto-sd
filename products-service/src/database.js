import mongoose from 'mongoose'

mongoose.connect("mongodb+srv://admin:admin@cluster0.v1isk.azure.mongodb.net/microservices-reto?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(db => console.log('Database is connected'))
    .catch(err => console.log(err));