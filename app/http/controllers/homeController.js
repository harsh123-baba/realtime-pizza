const Menu = require("../../models/menu");


function homeController(req, res){
    return{
        async index(req, res){
            let pizza = await Menu.find();
            // console.log(pizza)
            return res.render('home', {pizza:pizza})
        }
    }
}

module.exports = homeController;
