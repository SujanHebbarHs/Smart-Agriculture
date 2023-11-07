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
        default:"Pending",
    },
    quantity:{
        type:Number,
        default:1,
    },
    totalPrice: {
        type: Number,
        default: function () {
            return this.price;
        },
    }
}, {
    timestamps:true
});

const OrderHistory = new mongoose.model("OrderHistory", orderHistorySchema);

module.exports = OrderHistory;