const express = require('express');
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const app = express();
const mongoose = require('mongoose');


// Database connection

mongoose.connect('mongodb://localhost:27017/pizza', function(error){
    if(error){
        console.log("error found");
    }
    else{
        console.log("conneted")
    }
});
// const MyModel = mongoose.model('Test', new Schema({ name: String }));
// Works
// MyModel.findOne(function(error, result) { /* ... */ });


app.use(express.static('public'))


// set template engine
app.use(expressLayout);
app.set('views', __dirname + "/resources/views");
app.set('view engine', 'ejs');

require("./routes/web")(app);


const  PORT = process.env.PORT || 3000;

app.listen(PORT, function(){
    console.log("Connecting... on ", PORT)
})  

