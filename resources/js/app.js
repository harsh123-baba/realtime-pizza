import axios from 'axios';
let addtoCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        // console.log(res);
        cartCounter.innerText = res.data.totalQty;
        
    })
}



addtoCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(e, "clicked")
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(pizza);
        updateCart(pizza);        
    })
})