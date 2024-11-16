import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser';
import authroutes from './routes/authroutes.js'
import userroutes from './routes/userroutes.js'
import dataroutes from './routes/dataroutes.js'
dotenv.config()



const app=express()

app.use(cookieParser());
app.use(express.json())


app.use(cors({
  origin: 'https://ravishankar2003.github.io',
  credentials:true
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGODB_URI)
.then(()=> console.log('mongodb connected'))
.catch((err)=> console.log(err) );



app.use('/api/auth', authroutes);
app.use('/api/user', userroutes);
app.use('/api/data', dataroutes);





app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  });


app.listen(process.env.PORT||3000, ()=>{
    console.log('server on port 3000')
})
