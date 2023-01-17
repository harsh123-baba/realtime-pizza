let debug = true;
const Cart = require("../../../models/cart");
const userModel = require("../../../models/userModel");
const Menu = require('../../../models/menu');
function cartController(){
    return {
        async cart(req, res){
            let user_cart = await Cart.findOne({ 'user_id': req.user._id });
            // we need to put check if usercart is undefinded then blank page
            let items_cart = user_cart.items;
            // we need to keep array of nested array
            let items = [];
            // items_cart.map(async (item)=>{
            for(var i = 0; i<items_cart.length; i++){
                let item = items_cart[i];
                let pizza = await Menu.findOne({'_id':item.item});
                if(pizza){
                    let item_comp = {
                        pizza_name : pizza.name,
                        pizza_size : pizza.size,
                        pizza_price : pizza.price,
                        pizza_img : pizza.image,
                        pizza_qty : item.itemQty
                    }
                    // console.log(item_comp)
                    items.push(item_comp);
                }
            }
            
            res.render('Customers/cart', {items : items});
        },

        async updateCart(req, res) {
            // console.log("helo")
            // console.log(req.body);
            //    console.log(req.user);
            //    console.log(user);
            let totalQty = 0;
            if (req.isAuthenticated()) {
                // console.log(req.user)
                let user_cart = await Cart.findOne({'user_id' : req.user._id});
                if (user_cart == null){
                    // console.log("osnsn")
                    // create one cart for this gareeb
                    // const arr = [req.body._id, 1];
                    let new_cart = await new Cart({
                        items : [{
                            item : req.body._id,
                            itemQty : 1
                        }],
                        user_id : req.user._id
                    })
                    totalQty = 1;
                    // console.log(new_cart);
                    new_cart.save().then((cart)=>{
                    // console.log("Added");
                    }).catch(err=>{
                        // throw err
                        console.log(err);
                    })
                }
                else{
                    //update the prev cart 
                    // console.log("lnsvcl")
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
                return res.json({})
                return res.render('/Customers/cart', {user_cart : user_cart} )
            }
            else{
                return res.redirect("/login");
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