const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
const orderRouter = require('./routes/order')

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("Database Connection Successfull!"))
    .catch((err)=> console.log(err))

const app = express();
app.use(express.json());

app.use('/api/users',userRouter);
app.use('/api/products',productRouter);
app.use('/api/cart',cartRouter);
app.use('/api/orders',orderRouter);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running");
})

console.log('Hello!')



