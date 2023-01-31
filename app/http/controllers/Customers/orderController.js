const Order = require("../../../models/order");
const Cart = require("../../../models/cart");
const moment = require('moment')
function orderController(){
    return {
        async store(req, res){
            // console.log(req.body);
            const {address, phone } = req.body;
            if(!address || !phone){
                req.flash("error:", "all fields are mandetory");
                res.redirect("/cart");
            }
            // console.log(req.body)

            // so now  i need to extract data from Cart model
            // based on req.user._id;
            const current_cart = await Cart.findOne({"user_id":req.user._id}).populate('items.item');
            // console.log("new order", current_cart.items[0]);
            let newOrder = new Order({
                customer_id : current_cart.user_id,
                items : current_cart.items,
                phone,
                address
            })
            // console.log("new order", current_cart.items[0]);
            // console.log("new bro", newOrder.items[0]);

            newOrder.save().then(async result=>{
                //here the logic is that how the order is going on
                // console.log("res is",result.items[0]);
                req.flash("success", "Order Placed Sucessfully");
                //before that i need to remove all the elements from my cart bqs order is in plced state
                let items = [];
                // //now i want to delete thease items;
                // console.log(items[0].item);
                const updated_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id }, { items: items, totalQty: 0});
                return res.redirect("/customer/orders");
            }).catch(err=>{
                // console.log(err);
                req.flash('error', "error occurred");
                res.redirect("/cart");
            })
        },
        async index (req, res){
            // console.log("index called");
            let orders = await Order.find({'user_id':req.body._id}, 
            null,
            {sort:{'createdAt':-1}}).populate('items.item');
            // console.log(orders);
            // console.log("bro:",orders[0].items[0])
            res.render("Customers/orders", {orders:orders, moment:moment});
            
        }
    }
}
module.exports=orderController;