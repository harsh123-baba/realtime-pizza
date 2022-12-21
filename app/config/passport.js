const LocalStretegy = require('passport-local').Strategy;
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt')
function init(passport){
    //  login here;
    // done is call back hai
    passport.use(new LocalStretegy({
            usernameField: 'email',    // define the parameter in req.body that passport can use as username and password
            passwordField: 'password'
        }, async(email, password, done)=>{
        //check if mail exist
        const user = await userModel.findOne({email:email})
        if(!user){
            return done(null, false, {message:"No user with this username"});
        }
        bcrypt.compare(password, user.password).then(match=>{
            if(match){
                return done(null, user, {message:"login Done"})
            }
            return done(null, false, {message:"Wrong pass or username"})
        }).catch(err=>{
            return done(null, false, {message:"somting went wrong"})
        })

    }))
    passport.serializeUser((user, done)=>{
        done(null, user._id);
    })
    passport.deserializeUser((id, done)=>{
        userModel.findById(id ,(err, user)=>{
            done(err, user);
        })
    })
   
}

module.exports = init;