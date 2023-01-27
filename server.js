require("dotenv").config()
const express = require('express');
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const app = express();
const mongoose = require('mongoose');
const session = require('express-session')
const flash = require("express-flash");
const MongoDBStore = require('connect-mongo')(session);
const passport = require('passport');
const Cart = require("./app/models/cart")


// Database connection
mongoose.connect('mongodb://localhost:27017/Pizza', function(error){
    if(error){
        console.log("error found");
    }
    else{
        console.log("Database connected")
    }
});

// session store to DB
let mongoStore = new MongoDBStore({
    host: '127.0.0.1',
    port: '27017',
    db: 'session',
    url: process.env.MONGO_url
   
})


// session configuration
app.use(session({
    secret : process.env.COOKIE_SECRET,
    resave : false,
    store: mongoStore,
    saveUnintialized : false,
    cookie : {maxAge : 1000*60*60*24}
}));
app.use(flash());

app.use(express.static('public'))
app.use(express.urlencoded({ extended : false }))
app.use(express.json());


// passport 
app.use(passport.initialize());
app.use(passport.session());
const passportInit = require('./app/config/passport')
passportInit(passport);

//end of passpost

// set template engine
app.use(expressLayout);
app.set('views', __dirname + "/resources/views");
app.set('view engine', 'ejs');

//global middleware
app.use(async (req, res, next) => {
    res.locals.user = req.user;
    // console.log(req.user)
    if(req.user){
        let user_cart = await Cart.findOne({"user_id":req.user._id});
        // console.log(user_cart)
        if(user_cart){
    
            // let user_cart = await Cart.findOne({'user_id':req.user._id});
            res.locals.totalQty = user_cart.totalQty;
            // console.log(res.locals.totalQty)
        }
        else{
            res.locals.totalQty=0
        }
    }
    // console.log(req.user)
    next();
})
require("./routes/web")(app);


const  PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

