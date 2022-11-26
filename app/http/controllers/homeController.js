function homeController(req, res){
    return{
        // index : function(){

        // }
        index(req, res){
            res.render('home');
        }
    }
}

module.exports = homeController;
