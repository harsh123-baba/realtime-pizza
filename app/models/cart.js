const mongoose = require('mongoose');
const Schema = mongoose.Schema

const cartSchema = new Schema({
    items : [
        {
            item : {
             type : mongoose.Schema.Types.ObjectId,
             ref : "Menu"
             }, 
             
            itemQty: {
                 type: Number, required: true, default: 1 
            },
        }
    ],
    totalQty: {
        type: Number
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserModel'
    }
})

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;