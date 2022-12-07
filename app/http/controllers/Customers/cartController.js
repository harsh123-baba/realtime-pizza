let debug = true;
function cartController(){
    return {
        cart(req, res){
            res.render('Customers/cart')
        },
        updateCart(req, res){
            // for the first time creating object structure
            if(!req.session.cart){
                req.session.cart = {
                    items:{},
                    totalQty:0,
                    totalPrice:0
                }
                
            }
            let cart = req.session.cart
            console.log(req.body)
            // check if time does not exist in cart
            if(!cart.items(req.body._id)){
                cart.items(req.body._id) = {
                    item:req.body,
                    qty:1
                },
                cart.totalQty += 1;
                cart.totalPrice += req.body.price
            }else{
                cart.items(req.body._id).qty+=1
                cart.totalQty+=1
                cart.totalPrice += req.body.price
            }
            return res.json({
                data:req.session.cart.totalPrice
            })
        }
    }
}
module.exports = cartController;