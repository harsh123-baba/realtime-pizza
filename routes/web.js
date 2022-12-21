const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/Customers/cartController")
const guestMiddleware = require("../app/http/middlewares/guest")
function initRouter(app){
    
    app.get("/",homeController().index)
    app.get("/login",guestMiddleware ,authController().login)
    app.get("/register", guestMiddleware,authController().register)
    app.post("/register", authController().postRegister)
    app.post("/login", authController().postLogin)
    app.post('/logout', authController().logout)
    //cart
    app.get("/cart", cartController().cart)
    app.post("/update-cart", cartController().updateCart)
}

module.exports = initRouter;