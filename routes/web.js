const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/Customers/cartController")

function initRouter(app){
    
    app.get("/",homeController().index)
    app.get("/cart", cartController().cart)
    app.get("/login", authController().login)
    app.get("/signup",authController().register)
}

module.exports = initRouter;