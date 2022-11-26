import axios from 'axios';
let addtoCart = document.querySelectorAll(".add-to-cart")

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        console.log(res);
    })
}



addtoCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        // console.log(e, "clicked")
        let pizza = JSON.parse(btn.dataset.pizza);
        console.log(pizza);
        updateCart(pizza);        
    })
})