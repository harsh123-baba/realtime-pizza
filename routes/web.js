
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
//customer contoller
const cartController = require("../app/http/controllers/Customers/cartController")
const orderController = require("../app/http/controllers/Customers/orderController");

//admin controller
const adminOrderContoller = require('../app/http/controllers/Admin/orderController');
const statusController = require("../app/http/controllers/Admin/statusController");

//middlewares
const guestMiddleware = require("../app/http/middlewares/guest")
const authMiddleware = require("../app/http/middlewares/auth");
const adminMiddleware = require('../app/http/middlewares/admin');

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
    app.post("/update-cart-keys",cartController().updateCartKeys)

    // Cutomer Routes
    //Order
    app.post("/orders", authMiddleware ,orderController().store)
    app.get("/customer/orders",authMiddleware, orderController().index)
    app.get("/customer/orders/:id" , authMiddleware, orderController().show);


    //ADMIN routes
    //orders
    app.get("/admin/orders", adminOrderContoller().index);
    app.post("/admin/order/status", statusController().update);
     


}

module.exports = initRouter;