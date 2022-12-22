function guest (req, res, next){
    /// is authenticated function by passport
    if(!req.isAuthenticated()){
        return next();
    }
    return res.redirect("/");
}

module.exports = guest;