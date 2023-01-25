import axios from 'axios';
import Noty from 'noty';
let addtoCart = document.querySelectorAll(".add-to-cart")
// let cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        new Noty({
            type:'success',
            timeout:1000,
            text:"Cart Updated"
        }).show();
    }).catch(err=>{
        new Noty({
            type:'error',
            timeout:1000,
            text:"error occured",
            progressBar:false
        }).show();
    })
}




addtoCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log("ovnsjdnc")
        console.log("jksv", e);
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);        
    })
})




const addKey = document.querySelectorAll(".add-to-cart-keys")
const reduceKey = document.querySelectorAll(".reduce-to-cart-keys");

function updateCartKeys(pizza_id, action){
    // console.log(pizza, action)`
    axios.post('/update-cart-keys', {pizza_id, action})
    // .then(res=>{
    //     console.log("res", res);
    //     console.log("Clicked", action)
    //     if(action==='add'){
    //         new Noty({
    //             type: 'success',
    //             timeout: 1000,
    //             text: "Item Added"
    //         }).show();
    //     }
    //     else{
    //         new Noty({
    //             type: 'error',
    //             timeout: 1000,
    //             text: "Item Removed",
    //             progressBar: false
    //         }).show();
    //     }   
    // })
    console.log('klsnfkldfsklnflk')
}


addKey.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        // console.log("Asknkld")
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCartKeys(pizza, "add");
    })
})

reduceKey.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        // console.log("clickce");
        let pizza_id = JSON.parse(btn.dataset.pizza);
        updateCartKeys(pizza_id, "reduce");
    })
})