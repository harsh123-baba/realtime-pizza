const Order = require("../../../models/order");

function orderContoller (){
    return {
        async index(req, res){
            // let order = Order.find({status : {$ne :"completed"}}).populate('customer_id', '-password')
            // .exec((err, result)=>{
            //     console.log(err);

            // }) 
            let order = await Order.find({ status: { $ne: "completed" } }, null, {sort:{'createdAt':-1}}).populate('customer_id', '-password')
            let order1 = await Order.find({ status: { $ne: "completed" } }, null, { sort: { 'createdAt': -1 } }).populate('items.item')
            console.log(order1[0].items[0].item)
            // console.log(order1)
            // console.log(order);
            // console.log("hi")
            if (req.xhr) {
                return res.json(order)
            } else {
                return res.render('admin/orders')
            }
        }
    }
}

module.exports = orderContoller;