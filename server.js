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
//global middleware
app.use((req, res, next)=>{
    res.locals.session = req.session;
    res.locals.user  = req.user;
    next();
})


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

require("./routes/web")(app);

const  PORT = process.env.PORT || 5000;

app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

