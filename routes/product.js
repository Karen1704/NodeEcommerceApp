const Product = require('../models/Product');
const productRouter = require('express').Router();
const {verifyToken,verifyTokenAuthorization,verifyTokenAndAdmin} = require('./verifyToken')



//Create a product
productRouter.post('/', verifyTokenAndAdmin , async (req,res)=>{
    const newProduct = new Product({
        ...req.body,
        categories:req.body.categories.map((cat)=>cat.toLowerCase()),
        gender:req.body.gender.toLowerCase()
    });
    try{
        const savedProduct = await newProduct.save();
        res.status(201).send(savedProduct);
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Update a Product
productRouter.put('/product/:id', verifyTokenAndAdmin, async (req,res) =>{
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set:req.body,
            },
            {new:true}
        );
        res.status(200).send(updatedProduct);
    }
    catch(err){
        res.status(500).send({"Error":err})
    }
});

//Delete a product
productRouter.delete('/product/:id', verifyTokenAndAdmin, async (req,res)=>{
   
    try{
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).send(
            'Product with id ' +  req.params.id + ' was deleted'
        )
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Get a product
productRouter.get('/product/:id', async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id);
        res.status(200).send(product); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})





//Get all products
productRouter.get('/all', async (req,res)=>{
    try{
        let products;
        if(req.query.new){
            products = await Product.find().sort({createdAt: -1}).limit(1);
        }
        else if(req.query.category){
            products = await Product.find({
                categories:{
                    $in:[req.query.category.toLowerCase()],
                }    
            })
        }
        else if(req.query.gender){
            products = await Product.find({
                gender:req.query.gender.toLowerCase(),
            })
        }
        else{
            products = await Product.find();
        }
        
        res.status(200).send(products); 
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})

module.exports = productRouter;