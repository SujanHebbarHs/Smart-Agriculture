const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:true,
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required:true,
    },
    price:{
        type:Number,
        require:true,
    },
    category:{
        type:String,
        required:true,
    },
    img:{
        type:String,
        required:true,
    },

});

const Product = new mongoose.model("Product", productSchema);

module.exports = Product;