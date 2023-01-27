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
            let totalCartValue = 0;
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
                    totalCartValue += (pizza.price * item.itemQty)
                    items.push(item_comp);
                }
            }
            // console.log("HELOO",user_cart.totalQty);
            res.render('Customers/cart', {items : items, totalCartValue:totalCartValue});
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
                // console.log("brijs", req.sessiontotalQty)
                if(user_cart){

                    return res.json({ totalQty: user_cart.totalQty})
                }
                else{
                    totalQty : 0
                }
                // return res.render('/Customers/cart', {user_cart : user_cart} )
            }
            else{
                return res.redirect("/login");
            }
        },

        async updateCartKeys(req, res){
            const user_cart = await Cart.findOne({'user_id': req.user._id});
            // const menu_cart = await Menu.findOne({'user_id':user_cart._id});
            // console.log(menu_cart);
            // await Cart.findOne({'user_id':user_cart._id}).populate('menus').exec((err, cartItems)=>{
            //     console.log(cartItems)
            // })
            // console.log(price_cart);
            let changed_value = null;
            let current_price = 0;
            let totalQty = user_cart.totalQty;
            for(var i = 0; i<user_cart.items.length; i++){
                // console.log(user_cart.items[i])
                current_price += user_cart.items[i].price
                console.log(current_price)
                if(user_cart.items[i].item == req.body.pizza_id){
                    
                    // only this is the code for add the prodcut ;
                    let user_item = user_cart.items;
                    changed_value = user_item[i].itemQty;
                    if(req.body.action === "add"){
                        user_item[i].itemQty += 1;
                        changed_value = user_item[i].itemQty;
                        totalQty += 1;      
                        current_price += user_item[i].price                     
                        console.log(current_price)               

                    }
                    else{
                        if(user_item[i].itemQty > 1){
                            user_item[i].itemQty -= 1;
                            changed_value = user_item[i].itemQty;
                            totalQty -= 1;
                            current_price -= user_item[i].price                     
                        }
                        else if(user_item[i].itemQty === 1){
                            current_price -= user_item[i].price      
                            console.log(current_price)               
                            user_item[i].itemQty -= 1;
                            changed_value = user_item[i].itemQty;
                            user_item.splice(i, 1);
                            totalQty -= 1;
                        }
                        else{
                            changed_value = user_item[i].itemQty;
                            console.log("nothing here to delete")
                        }
                    }
                    let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                        { items: user_item, totalQty: totalQty }
                    );
                    
                
                }
            }
            // return res.redirect("/cart")
            return res.json({ user_cart:user_cart,totalQty: totalQty, changed_value:changed_value, current_price:current_price })

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