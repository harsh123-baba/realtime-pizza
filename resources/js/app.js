import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
let addtoCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter");
function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        console.log("oops", res.data.totalQty);
        cartCounter.innerText = res.data.totalQty
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
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);        
    })
})




const addKey = document.querySelectorAll(".add-to-cart-keys")
const reduceKey = document.querySelectorAll(".reduce-to-cart-keys");
const totalCartValue = document.querySelector("#totalCartValue");
function updateCartKeys(pizza_id, action, itemno){
    let changedItem = "changed_value_" + itemno
    let changedPrice = "changed_price_"+ itemno;
    let changed_value = document.getElementById(changedItem)
    let totalCartValue = document.querySelector("#totalCartValue");
    let changed_price = document.getElementById(changedPrice);

    axios.post('/update-cart-keys', {pizza_id, action})
    .then(res=>{
        changed_value.innerText = res.data.changed_value + " Pcs";
        cartCounter.innerText = res.data.totalQty     
        totalCartValue.innerText = res.data.current_price;
        changed_price.innerText = res.data.changed_price;
        if(action==='add'){
            new Noty({
                type: 'success',
                timeout: 1000,
                text: "Item Added"
            }).show();
        }
        else{
            new Noty({
                type: 'error',
                timeout: 1000,
                text: "Item Removed",
                progressBar: false
            }).show();
        }   
    })
}


addKey.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCartKeys(pizza, "add", btn.dataset.itemno);
    })
})

reduceKey.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        // console.log(btn.dataset)
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(pizza)
        updateCartKeys(pizza, "reduce",btn.dataset.itemno);
    })
})

// alert message js to remove after few seconds
let alrtmsg = document.querySelector('#success-alert');
if(alrtmsg){
    setTimeout(()=>{
        alrtmsg.remove();
    }, 5000)
}

initAdmin();
