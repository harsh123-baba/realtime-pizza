const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const oderSchema = new Schema ({
    customer_id : {
        type:mongoose.Schema.Types.ObjectId,
        ref:'UserModel',
        required:true
    },
    items:[
        {
            item:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Menu"
            },
            itemQty : {
                type : Number, required:true
            }
        }
    ],
    phone : {type:Number, reuqired:true},
    address : {type : String, required:true},
    payment_method : {type:String, default:"COD"},
    status : {type:String, default:"order_plcaed"}
}, {timestamps:true});


const Order = mongoose.model("Order", oderSchema);
module.exports = Order;


