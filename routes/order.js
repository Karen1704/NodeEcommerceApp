const Cart = require('../models/Cart');
const Order = require('../models/Order');
const { verifyTokenAndAdmin, verifyToken, verifyTokenAuthorization } = require('./verifyToken');
const orderRouter = require('express').Router();
 
//Create order
orderRouter.post('/', verifyTokenAuthorization , async (req,res)=>{
    const newOrder = new Order(req.body);
    try{
        const savedOrder = await newOrder.save();
        res.status(201).send(savedOrder);
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Update an order
orderRouter.put('/order/:id', verifyTokenAuthorization, async (req,res) =>{
    try{
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).send(updatedOrder);
    }
    catch(err){
        res.status(500).send({"Error":err})
    }
});

//Delete an order
orderRouter.delete('/order/:id', verifyTokenAuthorization, async (req,res)=>{
   
    try{
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).send(
            'Order with id ' +  req.params.id + ' was deleted'
        )
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})



//Get user orders
orderRouter.get('/cart/:userId',verifyTokenAuthorization, async (req,res)=>{
    try{
        const orders = await Order.find({userId : req.params.userId });
        res.status(200).send(orders); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})





//Get all orders
orderRouter.get('/all', verifyTokenAndAdmin, async (req,res)=>{
    try{
        const orders = await Order.find();
        res.status(200).send(orders); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//get monthly income
orderRouter.get('/income',verifyTokenAndAdmin, async (req,res)=>{
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth()-1));
    const previousMonth = new Date(new Date.setMonth(lastMonth.getMonth()-1));
    try{
      const income = await Order.aggregate([
       { $match:{createdAt:{$gte:previousMonth}}},
       {
        $project:{
        month:{$month:"$createdAt"},
        sales:"$amount"

        },
       },
      ])

      res.status(200).send(income);
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})

module.exports = orderRouter;