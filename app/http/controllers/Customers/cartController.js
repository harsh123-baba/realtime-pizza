let debug = true;
function cartController(){
    return {
        cart(req, res){
            res.render('Customers/cart')
        },
        updateCart(req, res){
        //for the first time when user have nothing in cart
            if(!req.session.cart){
                req.session.cart = {
                    items:{},
                    totalQty: 0,
                    totalPrice : 0
                }
            }
            let cart = req.session.cart;
            console.log(req.body);
            // check if item is not exist in cart;
            if(!cart.items[req.body._id]){
                cart.items[req.body._id] = {
                    item : req.body,
                    qty : 1 

                }
            }
            else{
                cart.items[req.body._id]+=1;
                cart.totalQty += 1;
                cart.totalPrice += req.body.price;
            }
            return res.json({totalQty:req.session.cart.totalQty})
        }
    }
}
module.exports = cartController;