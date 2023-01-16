let debug = true;
const Cart = require("../../../models/cart");
const userModel = require("../../../models/userModel");
function cartController(){
    return {
        cart(req, res){
            res.render('Customers/cart')
        },

        async updateCart(req, res) {
            console.log("helo")
            console.log(req.body);
               console.log(req.user);
            //    console.log(user);

            if (req.isAuthenticated()) {
                // console.log(req.user)
                let user_cart = await Cart.findOne({'user_id' : req.user._id});
                if (user_cart == null){
                    console.log("osnsn")
                    // create one cart for this gareeb
                    // const arr = [req.body._id, 1];
                    let new_cart = await new Cart({
                        items : [{
                            item : req.body._id,
                            itemQty : 1
                        }],
                        user_id : req.user._id
                    })
                    console.log(new_cart);
                    new_cart.save().then((cart)=>{
                        console.log("Added");
                    }).catch(err=>{
                        // throw err
                        console.log(err);
                    })
                }
                else{
                    //update the prev cart 
                    console.log("lnsvcl")
                    // console.log(user_cart);
                    let prevAvailable = false;
                    for(var i = 0;i<user_cart.items.length; i++){
                        if (user_cart.items[i].item == req.body._id){
                            // console.log("sldnvds");
                            let old_item_list = user_cart.items;
                            let item = user_cart.items;
                            item[i].itemQty += 1;
                            let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                                { items: item }
                            );
                            console.log(item[i].itemQty)
                            prevAvailable = true;                            
                        }
                    }
                    if(!prevAvailable){
                        let old_item_list = user_cart.items;
                        let item = {item : req.body._id, itemQty : 1}
                        // console.log("before", old_item_list)
                        old_item_list.push(item);
                        
                        //now our task is to update that part
                        let update_cart = await Cart.findOneAndUpdate({'user_id': req.user._id}, 
                            { items: old_item_list }
                        );   
                    }
                }
            }
            else{
                res.redirect("/login");
            }

        }
        
    }
}
module.exports = cartController;