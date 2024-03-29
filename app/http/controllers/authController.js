const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');
const User = require('../../models/userModel');
const passport = require('passport')
function authController(){
    function _getRedirectUrl(req){
        return req.user.role === "admin"? '/Admin/orders' : '/';
    }

    return {
        login(req, res){
            res.render('auth/login');
        },
        register(req, res){
            userModel.find();
            res.render('auth/register');
        },
        async postRegister(req, res){
            const { name, email, password, cnfpassword } = req.body;
            if(password !== cnfpassword){
                req.flash('name', name);
                req.flash('email', email)
                req.flash('error', "Password and confirm password are not same");
                return res.redirect("/register")
            }
            if(!name || !email || !password || !cnfpassword){
                req.flash('name', name);
                req.flash('email', email)
                req.flash('error', "All Fields are required");
                return res.redirect("/register");
            }   
            userModel.exists({email:email}, ((err, result)=>{
                if(result){
                    req.flash('error', 'Email Already exists');
                    req.flash('name', name);
                    return res.redirect('/register');
                }
            }))
            
            userModel.find();
            //hasing of password
            const hashedPassword = await bcrypt.hash(password, 10);


            //create a user
            const user = new User({
                name : name,
                email:email,
                password: hashedPassword
            })
            user.save().then((user)  =>{
                // console.log("here")
                // console.log(user);
                return res.redirect('/login')
            }).catch(err=>{

                req.flash('errorsubmit', "Error Occured");
                return res.redirect("/register");

            })
        },
        async postLogin(req, res, next){
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error', info.message)
                    return next(err)
                }
                if(!user){
                    req.flash('error', info.message);
                    return res.redirect('/login');
                }
                req.logIn(user, (err)=>{
                    req.user = user
                    if(err){
                        req.flash('error', info.message)
                        return next(err);
                    } 
                    return res.redirect(_getRedirectUrl(req));
                })
            })(req, res, next)
            
        },
        async logout(req, res, next){
            req.logout(function(err){
                if (err) {
                    return next(err);
                }      
            });
            return res.redirect("/login")
        }
    }

}

module.exports = authController;