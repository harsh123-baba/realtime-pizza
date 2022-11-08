const express = require('express');
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const app = express();

app.use(express.static('public'))


// set template engine
app.use(expressLayout);
app.set('views', __dirname + "/resources/views");
app.set('view engine', 'ejs');

app.get("/", (req, res) => {
    res.render('home')
})
app.get("/cart", (req, res) => {
    res.render('Customers/cart')
})
app.get("/login", (req, res)=>{
    res.render('auth/login')
})
app.get("/signup",(req, res)=>{
    res.render('auth/register');
})
const  PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

