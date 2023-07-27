const User = require('../models/User');
const userRouter = require('./auth');
const CryptoJs = require('crypto-js');
const {verifyToken,verifyTokenAuthorization,verifyTokenAndAdmin} = require('./verifyToken')


//UPDATE
userRouter.put('/user/:id',verifyTokenAuthorization, async (req,res)=>{
    if(req.body.password){
        req.body.password = CryptoJs.AES.encrypt(req.body.password,'Secret PassPhrase').toString()
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set:req.body
        },{new:true});
        res.status(200).send(updatedUser)
    }
    catch(err){
        res.status(500).send({"err":err})
    }
});


//DELETE

userRouter.delete("/user/:id",verifyTokenAuthorization,async (req,res)=>{
    try{ 
        await User.findByIdAndDelete(req.params.id)
        res.status(200).send({"Message": "User has been deleted"})
    }

    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Get User 

userRouter.get('/user/:id',verifyTokenAndAdmin, async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        res.status(200).send(user)
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Find all users

userRouter.get('/all',verifyTokenAndAdmin, async (req,res)=>{
    try{
        const users = await User.find();
        res.status(200).send(users)
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})


//Find user stats

userRouter.get('/stats',verifyTokenAndAdmin, async (req,res)=>{
    const date  = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear()-1)) 
    try{
        const data = await User.aggregate([
            {$match:{createdAt:{$gte:lastYear}}},
            {
            $project: {
                month :{$month : '$createdAt'}
            },
        },
        {
            $group :{
                _id : "$month",
                total :{$sum:1},
            }
        }
        ]);
        res.status(200).send(data)
    }
    catch(err){
        res.status(500).send({
            "error":err
        })
    }
})




module.exports = userRouter;
