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
                        pizza_id : pizza.id,
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
            // console.log("HELOO",user_cart.totalQty);
            res.render('Customers/cart', {items : items});
        },

        async updateCart(req, res) {
            console.log("uodatjdnc")
            let totalQty = 0;
            if (!req.session.cart) {
                req.session.cart = {
                    totalQty: 0
                }
                // req.session.totalQty = user_cart.totalQty
            }
            if (req.isAuthenticated()) {
                // console.log(req.user)
                let user_cart = await Cart.findOne({'user_id' : req.user._id});
                if (user_cart == null){
                    let new_cart = await new Cart({
                        items : [{
                            item : req.body._id,
                            itemQty : 1
                        }],
                        totalQty : 1,
                        user_id : req.user._id
                    })
                    // req.session.cart.totalQty = 1;
                    
                    new_cart.save().then((cart)=>{
                    // console.log("Added");
                    }).catch(err=>{
                        // throw err
                        console.log(err);
                    })
                }
                else{
                    let prevAvailable = false;
                    for(var i = 0;i<user_cart.items.length; i++){
                        if (user_cart.items[i].item == req.body._id){
                            // console.log("sldnvds");
                            let old_item_list = user_cart.items;
                            let item = user_cart.items;
                            item[i].itemQty += 1;
                            totalQty += 1;
                            let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                                { items: item, totalQty: user_cart.totalQty + 1 }
                            );
                            // req.session.cart.totalQty = user_cart.totalQty + 1;
                            prevAvailable = true;                            
                        }
                    }
                    if(!prevAvailable){
                        let old_item_list = user_cart.items;
                        let item = {item : req.body._id}
                        old_item_list.push(item);
                        //now our task is to update that part
                        let update_cart = await Cart.findOneAndUpdate({'user_id': req.user._id}, 
                            { items: old_item_list, totalQty: user_cart.totalQty+1 }
                        );   
                        req.session.cart.totalQty = user_cart.totalQty+1;

                    }
                }  
                return res.json({totalQty:req.session.cart.totalQty})
                return res.render('/Customers/cart', {user_cart : user_cart} )
            }
            else{
                return res.redirect("/login");
            }

        },

        async updateCartKeys(req, res){
            console.log('snvkl', req.body)
            const user_cart = await Cart.findOne({'user_id': req.user._id});
            // console.log(user_cart)
            if(req.body.action === "add"){
                // console.log("called add");
                // usercart is now my cart 
                // i need to perform add the qty operation on it
                
                for(var i = 0; i<user_cart.items.length; i++){
                    if(user_cart.items[i].item == req.body.pizza_id){
                        let user_item = user_cart.items;
                        user_item[i].itemQty += 1;
                        let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                            { items: user_item, totalQty: user_cart.totalQty + 1 }
                        );
                        // req.session.cart.totalQty = user_cart.totalQty + 1;
                    }
                }

            }
            else{

                console.log("reduce called");
            }
            
            // return res.redirect("/cart")
            // return res.json({ totalQty: req.session.cart.totalQty }).render('/Customers/cart', { user_cart: user_cart })

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