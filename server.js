const express = require('express');
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const app = express();

app.get("/", (req, res)=>{
    res.render('home')
})
// set template engine
app.use(expressLayout);
app.set('views', __dirname + "/resources/views");
app.set('view engine', 'ejs');



app.set('views', path.join(__dirname ,"/resources/views"));
app.set('view engine', 'ejs');

const  PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

