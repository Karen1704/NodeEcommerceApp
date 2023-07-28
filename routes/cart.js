const Cart = require('../models/Cart');
const { verifyTokenAndAdmin, verifyToken, verifyTokenAuthorization } = require('./verifyToken');
const cartRouter = require('express').Router();

//Create cart
cartRouter.post('/', verifyToken, async (req,res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(201).send(savedCart);
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Update a cart
cartRouter.put('/cart/:id', verifyTokenAuthorization, async (req,res) =>{
    try{
        const upadatedCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).send(upadatedCart);
    }
    catch(err){
        res.status(500).send({"Error":err})
    }
});

//Delete a product
cartRouter.delete('/cart/:id', verifyTokenAuthorization, async (req,res)=>{
   
    try{
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).send(
            'Cart with id ' +  req.params.id + ' was deleted'
        )
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
}) 



//Get user cart
cartRouter.get('/cart/:userId',verifyTokenAuthorization, async (req,res)=>{
    try{
        const cart = await Cart.find({userId : req.params.userId });
        res.status(200).send(cart); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})





//Get all 
cartRouter.get('/all', verifyTokenAndAdmin,async (req,res)=>{
    try{
        const carts = await Cart.find();
        res.status(200).send(carts); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


module.exports = cartRouter;