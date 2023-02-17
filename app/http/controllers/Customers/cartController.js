let debug = true;
const Cart = require("../../../models/cart");
const Menu = require('../../../models/menu');



function cartController(){
    return {      
        async cart(req, res){
            
            let user_cart = await Cart.findOne({ 'user_id': req.user._id });
            // we need to put check if usercart is undefinded then blank page
            let items = [];
            let totalCartValue = 0;
            if(user_cart){
                let items_cart = user_cart.items;
                // we need to keep array of nested array
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
            }
            // console.log("HELOO",user_cart.totalQty);
            res.json({items:items, totalCartValue:totalCartValue});
            res.render('Customers/cart', {items : items, totalCartValue:totalCartValue});
        },

        //inside cart session only totalQty is available

        async updateCart(req, res) {
            // console.log("uodatjdnc")
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
                // console.log("bro", user_cart);
                if (user_cart == null){
                    // req.session.cart.totalQty = user_cart.totalQty+1;
                    let new_cart = await new Cart({
                        items : [{
                            item : req.body._id,
                            itemQty : 1
                        }],
                        totalQty : 1,
                        user_id : req.user._id
                    })
                    req.session.cart.totalQty = 1;
                    new_cart.save().then((cart)=>{
                        
                    }).catch(err=>{
                        // throw err
                        console.log(err);
                    })
                }
                else{
                    let prevAvailable = false;
                    for(var i = 0;i<user_cart.items.length; i++){
                        if (user_cart.items[i].item == req.body._id){
                            let item = user_cart.items;
                            item[i].itemQty += 1;
                            totalQty += 1;
                            let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                                { items: item, totalQty: user_cart.totalQty + 1 }
                            );
                            req.session.cart.totalQty = totalQty;

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
                
                if(user_cart){
                    return res.json({ totalQty: req.session.cart.totalQty})
                }
                else{
                    return res.json({ totalQty: req.session.cart.totalQty})
                }
                // return res.render('/Customers/cart', {user_cart : user_cart} )
            }
            else{
                return res.redirect("/login");
            }
        },

        async updateCartKeys(req, res){
            const user_cart = await Cart.findOne({ 'user_id': req.user._id }).populate('items.item')
            let changed_value = null;
            let changed_price = null;
            let current_price = 0;
            let totalQty = user_cart.totalQty;
            // to calculate price of whole cart
            for(var i = 0;i<user_cart.items.length; i++){
                current_price += (user_cart.items[i].item.price * user_cart.items[i].itemQty)
            }
            for(var i = 0; i<user_cart.items.length; i++){
                // current_price += (user_cart.items[i].item.price * user_cart.items[i].itemQty)
                if(user_cart.items[i].item.id == req.body.pizza_id){
                    // only this is the code for add the prodcut;
                    let user_item = user_cart.items;
                    changed_value = user_item[i].itemQty;
                    changed_price = user_item[i].item.price * user_item[i].itemQty;
                    if(req.body.action === "add"){
                        user_item[i].itemQty += 1;
                        changed_value = user_item[i].itemQty;
                        totalQty += 1;
                        current_price += user_cart.items[i].item.price
                        changed_price += user_cart.items[i].item.price;
                    }
                    else{
                        // console.log("a", user_item[i].itemQty);
                        if(user_item[i].itemQty > 1){
                            user_item[i].itemQty -= 1;
                            changed_value = user_item[i].itemQty;
                            totalQty -= 1;
                            current_price -= user_cart.items[i].item.price;
                            changed_price -= user_cart.items[i].item.price;  
                        }
                        else if(user_item[i].itemQty === 1){
                            current_price -= user_cart.items[i].item.price
                            changed_price -= user_cart.items[i].item.price;                  
                            user_item[i].itemQty -= 1;
                            changed_value = user_item[i].itemQty;
                            user_item.splice(i, 1);
                            totalQty -= 1;
                        }
                        // console.log(changed_price, " ", current_price);
                    }
                    // console.log("hello",changed_price);
                    
                    let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
                        { items: user_item, totalQty: totalQty }
                    );
                    
                
                }
            }
            // return res.redirect("/cart")
            return res.json({ user_cart:user_cart,
                totalQty: totalQty, 
                changed_value:changed_value, 
                current_price:current_price, 
                changed_price:changed_price 
            })

        },
        async deleteItem(req, res){
            // console.log(req.params)
            // console.log("delete item called");
            const usercart = await Cart.findOne({ 'user_id': req.user._id }).populate('items.item')
            // console.log(usercart.items[0].item)
            let user_items = usercart.items;
            let totalQty = usercart.totalQty
            let changed_price = null;
            // for(var i = 0; i<user_items.length; i++){
            //     let changed_price = totalCartValue(req);
            // }
            for(var i = 0;i<user_items.length; i++){
                changed_price += (user_items[i].item.price * user_items[i].itemQty)
                // console.log(changed_price)
            }
            for(var i = 0; i<user_items.length; i++){
            // console.log("sdnsl",user_items[i].item._id, " ", req.params)
                if(user_items[i].item._id == req.params.id){
                    //splice this element;
                    totalQty -= user_items[i].itemQty;
                    changed_price -= (user_items[i].itemQty*user_items[i].item.price);
                    user_items.splice(i, 1)
                    // console.log(user_items)
                    break;
                }
            }
            let update_cart = await Cart.findOneAndUpdate({ 'user_id': req.user._id },
            { items: user_items, totalQty: totalQty }
            );
            return res.json({ usercart:usercart,
                totalQty: totalQty, 
                // changed_value:changed_value, 
                // current_price:current_price, 
                changed_price:changed_price 
            })


        }


        
    }
}
module.exports = cartController;