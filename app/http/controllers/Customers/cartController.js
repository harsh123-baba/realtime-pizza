function cartController(){
    return {
        cart(req, res){
            res.render('Customers/cart')
        },
        updateCart(req, res){
            return res.json({
                data:"All ok"
            })
        }
    }
}
module.exports = cartController;