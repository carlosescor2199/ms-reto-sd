
import '@babel/polyfill';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';
const app = express();

//Import routes
import users from './routes/users'

//settings
app.set('port', process.env.PORT || 5000);

//Middlewares
app.use(cors());
app.use(express.json());

//routes
app.use('/users', users);

export default app;