const Order = require("../../../models/order");

function orderContoller (){
    return {
        async index(req, res){
            let order = await Order.find({ status: { $ne: "completed" } }, null, { sort: { 'createdAt': -1 } }).populate('customer_id', '-password').populate('items.item')
            // let order1 = await Order.find({ status: { $ne: "completed" } }, null, { sort: { 'createdAt': -1 } }).populate('items.item')
            if (req.xhr) {
                
                return res.json(order)
            } else {
                return res.render('Admin/orders')
            }
        }
    }
}

module.exports = orderContoller;