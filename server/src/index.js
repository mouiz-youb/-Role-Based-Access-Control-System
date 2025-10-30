import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './router/authRouter.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// router middleware
app.use('/auth', authRouter);
// starter of server 
const Start = ()=>{
    app.listen(PORT ,()=>{
        console.log(`Server is running on port ${PORT}`);
    })
}

Start();




