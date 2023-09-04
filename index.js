import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import debug from 'debug';
import mongoose from 'mongoose';

const startupDebugger = debug('app:startup');
const dbDebugger = debug('app:db');

import userRoutes from './routes/users.js';
import authRoute from './routes/auth.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());-
app.use(morgan('tiny'));


app.use('/api/users',userRoutes);
app.use('/api/auth',authRoute);

mongoose.connect(process.env.MONGO_URL)
.then(() =>dbDebugger('Connected to mongodb...'))
.catch(err => console.error('could not connect to mongodb',err));


const port = process.env.PORT || 5000;
app.listen(port,()=>{
    startupDebugger(`Server has started and is running at port http://localhost:${port}`);
});