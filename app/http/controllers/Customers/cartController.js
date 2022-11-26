function cartController(){
    return {
        cart(req, res){
            res.render('Customer/cart')
        }
    }
}
module.exports = cartController;