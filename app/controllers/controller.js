var express = require('express')
module.exports.home = function(req,res){
products = req.app.locals.products
res.render('survey.pug',{products:products})
}