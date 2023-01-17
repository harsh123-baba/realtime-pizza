import axios from 'axios';
import Noty from 'noty';
let addtoCart = document.querySelectorAll(".add-to-cart")
let cartCounter = document.querySelector("#cartCounter");

function updateCart(pizza){
    axios.post("/update-cart", pizza).then(res=>{
        // console.log(res);
        console.log("clicked")
        // cartCounter.innerText = res.data.totalQty;
        // console.log(res.data.totalQty)
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
        // console.log(e, "clicked")
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(pizza);
        updateCart(pizza);        
    })
})