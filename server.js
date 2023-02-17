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
const EventEmitter = require('events');

// Database connection
mongoose.connect(process.env.MONGO_URL, function(error){
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
    url: process.env.MONGO_URL
   
})


//event emitter
const eventEmitter = new EventEmitter();
app.set('eventEmitter', eventEmitter);

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
const passportInit = require('./app/config/passport');
// const { EventEmitter } = require("stream");
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
app.use((req, res)=>{
    res.status(404).send('<h1>Page not found</h1>')
})

const  PORT = process.env.PORT || 5000;

const server = app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

//socket 
const io = require('socket.io')(server);
//jese hi connection hojata hai then we need to give one call back
//jese hi client connect ho jata hai use hme private room k andr join kreana hai 
// hr ek order k liye ek private room hogi
// order room k andr change aate hi hm event emit krne wala hai
//connection will give us socket
io.on('connection', (socket)=>{
    //jo bh clien t connect kr rha use join krwana hai
    //in this private room of particular order
    //name unique hona chaiye kyoki ek order ka ek room baki ko nh btana bs isko btana hai
    //and need to identify which order which room
    // in socket.on ('join') join is the message that is comming from client side 
    socket.on('join', (orderId)=>{
        //here below join is socket method
        socket.join(orderId);
    })

})

eventEmitter.on('orderUpdated', (data)=>{
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})
eventEmitter.on('orderPlaced', (result)=>{
    io.to('adminRoom').emit('orderPlaced', result)
})