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
                        // console.log(cart_item.items)
                        // console.log("lo",user_cart.items[i])
                        // console.log(req.body._id);
                        // console.log(user_cart.items[i].item)
                        if (user_cart.items[i].item == req.body._id){
                            // console.log("sldnvds");
                            prevAvailable = true;                            
                        }
                    }
                    console.log(prevAvailable)
                    if(!prevAvailable){
                        let old_item_list = user_cart.items;
                        let item = {item : req.body._id, itemQty : 1}
                        // console.log("before", old_item_list)
                        old_item_list.push(item);
                        
                        //now our task is to update that part
                        let update_cart = await Cart.findOneAndUpdate({'user_id': req.user._id}, 
                            { items: old_item_list }
                        );
                        console.log(update_cart);
                        // user_cart.items.push(itemX);
                        
                    }
                }
            }
            else{
                res.redirect("/login");
            }

        }


        // updateCart(req, res){
        // //for the first time when user have nothing in cart
        //     if(!req.session.cart){
        //         req.session.cart = {
        //             items:{},
        //             totalQty: 0,
        //             totalPrice : 0
        //         }
        //     }
        //     let cart = req.session.cart;
        //     console.log(req.body);
        //     // check if item is not exist in cart;
        //     if(!cart.items[req.body._id]){
        //         cart.items[req.body._id] = {
        //             item : req.body,
        //             qty : 1 
        //         }
        //     }
        //     else{
        //         cart.items[req.body._id]+=1;
        //         cart.totalQty += 1;
        //         cart.totalPrice += req.body.price;
        //     }
        //     return res.json({totalQty:req.session.cart.totalQty})
        // }

        // async updateCart(req, res){
        //     let item = req.body;
        // }
        
    }
}
module.exports = cartController;