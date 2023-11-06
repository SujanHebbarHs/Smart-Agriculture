const mongoose = require("mongoose");

const orderHistorySchema = new mongoose.Schema({

    productId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },
    pName:{
        type:String,
        required:true,
    },
    buyerId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    buyerName: {
        type:String,
        require: true,
    },
    ownerId:{
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
    status:{
        type:String,
        required,
    }
}, {
    timestamps:true
});

const OrderHistory = new mongoose.model("Order", orderHistorySchema);

module.exports = OrderHistory;