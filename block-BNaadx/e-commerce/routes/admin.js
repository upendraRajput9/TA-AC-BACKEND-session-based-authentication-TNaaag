var express = require('express')
var Admin = require('../models/Admin')
var router = express.Router()

/* GET users listing. */
router.get('/',(req,res)=>{
    res.render('admin');
})

router.post('/login',(req,res,next)=>{
    var {email,password} = req.body;
    if(!email || !password){
      return res.redirect('/users/login')
    };
    Admin.findOne({email},(err,user)=>{
      if(err) return next(err);
      if(!user){
        return  res.redirect('/users/login')
      }else{
        req.session.userId = user.id;
   res.redirect('/products/'+user.id)
      }
    })
  })
  


module.exports = router
