import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';

let addtoCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter");

// function renderCart(){
//     axios.get("/cart").then(res=>{
//         console.log(res);

//     })
// }

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        // console.log("oops", res.data.totalQty);
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
        // console.log(pizza);
        updateCartKeys(pizza, "reduce",btn.dataset.itemno);
    })
})

//delete operation call here
function deleteItem(pizza){
    
    axios.delete(`/delete_item/${pizza}`, pizza).
    then(res=>{
        totalCartValue.innerText = res.data.changed_price;
        new Noty({
            type: 'error',
            timeout: 1000,
            text: "Item Removed",
            progressBar: false
        }).show();
    })
}

const deletebutton = document.querySelectorAll(".delete-item")
deletebutton.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza);
        deleteItem(pizza);
    })
})

// alert message js to remove after few seconds
let alrtmsg = document.querySelector('#success-alert');
if(alrtmsg){
    setTimeout(()=>{
        alrtmsg.remove();
    }, 5000)
}


//update status
let statuses = document.querySelectorAll(".status_line")
let hiddenInput = document.querySelector("#hiddenOrderInput")
let order = hiddenInput ? hiddenInput.value : null;
// console.log(order);

// Change order status
// let statuses = document.querySelectorAll('.status_line')
// let hiddenInput = document.querySelector('#hiddenInput')
// let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)
let time = document.createElement('small')

function updateStatus(order) {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true;
    statuses.forEach((status) => {
       let dataProp = status.dataset.status
       if(stepCompleted) {
            status.classList.add('step-completed')
       }
       console.log(dataProp)
       console.log(order.status)
       if(dataProp === order.status) {
            stepCompleted = false
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time)
           if(status.nextElementSibling) {
            status.nextElementSibling.classList.add('current')
           }
       }
    })

}
updateStatus(order);

//socket client side

let socket = io();
//join
//jese hi hm order page pr aayege server ko msg emit krna hai ki we are on order page
//take this order id and make a room for particular id
// instead of join you can say anything

if(order){
    socket.emit('join', `order_${order._id}`)
}

//for auto update of admin page
let adminAreaPath = window.location.pathname
if(adminAreaPath.includes('admin')){
    initAdmin(socket);

    socket.emit('join', 'adminRoom');
}

// socket will send a messafe of name 'join' and here inside that
// order_kjndcjksnckjsdcn

socket.on('orderUpdated', (data)=>{
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format
    updatedOrder.status = data.status
    // console.log("bc", updatedOrder);
    updateStatus(updatedOrder);
    new Noty({
        type:'success',
        timeout:1000,
        text:"order Updated"
    }).show();
})
