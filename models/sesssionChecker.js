var sessionChecker = (req,res,next) => {
    if(req.session.user ){
        res.redirect('/welcome')
    }
    else{
        next()
    }
}
module.exports = sessionChecker