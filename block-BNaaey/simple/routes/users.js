var express = require('express');
const { render } = require('../app');
var User = require('../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  res.send('respond with a resource');
});
router.get('/register',(req,res)=>{
  res.render('userForm')
})

router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    console.log(err,user)
    if(err) return next(err)
    res.redirect('/users/login')
  })
})

router.get('/login',(req,res,next)=>{
  res.render('loginForm')
});

router.post('/login',(req,res,next)=>{
  var {email , password}=req.body
if(!email || !password){
  res.redirect('/users/login')
}
User.findOne({email:email},(err,user)=>{
  if(err) return next(err)

if(!user){
  return res.redirect('/users/login')
}  

user.verifyPassword(password,(err,result)=>{
  if(err) return next(err);
  if(!result){
   return res.redirect('/users/login');
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
})
})
})

module.exports = router;


