import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const app = express();

//Import routes
import cart from './routes/Cart'

//settings
app.set('port', process.env.PORT || 5002);

//Middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/cart', cart);

export default app;