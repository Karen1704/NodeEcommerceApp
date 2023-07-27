const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        unieque:false
    },
    description:{
        type:String,
        required:true,
        unique:false
    },
    gender:{
        type:String,
        required:true,
        unique:false
    },
    sku:{
        type:String,
        required:true,
        unique:true,
    },
    img:{
        type:String,
        required:true,
    },
    categories:{
        type:Array,
        required:true,
    },
    size:{
        type:Array,
        required:false,
    },
    color:{
        type:String,
        required:false,
    },
    price:{
        type:Number,
        required:true,
    }
    
},
{timestamps:true}
)

module.exports = mongoose.model("Product",ProductSchema)