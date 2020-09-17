import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const app = express();

//Import routes
import products from './routes/Products'

//settings
app.set('port', process.env.PORT || 5001);

//Middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/products', products);

export default app;