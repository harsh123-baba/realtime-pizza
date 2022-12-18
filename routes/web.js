const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/Customers/cartController")

function initRouter(app){
    
    app.get("/",homeController().index)
    app.get("/login", authController().login)
    app.get("/register",authController().register)
    app.post("/register", authController().postRegister)

    //cart
    app.get("/cart", cartController().cart)
    app.post("/update-cart", cartController().updateCart)
}

module.exports = initRouter;