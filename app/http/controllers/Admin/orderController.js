const Order = require("../../../models/order");

function orderContoller (){
    return {
        async index(req, res){
            // let order = Order.find({status : {$ne :"completed"}}).populate('customer_id', '-password')
            // .exec((err, result)=>{
            //     console.log(err);

            // }) 
            let order = await Order.find({ status: { $ne: "completed" } }, null, {sort:{'createdAt':-1}}).populate('customer_id')

            console.log(order);
            // console.log("hi")
        }
    }
}

module.exports = orderContoller;