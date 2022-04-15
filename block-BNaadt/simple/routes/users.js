var express = require('express');
var User = require('../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session)
  res.send('respond with a resource');
});
router.get('/register',(req,res)=>{
  var message=req.flash('error')[0]
  res.render('userForm',{message})
})

router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    console.log(err,user)
    if(err) {
      req.flash('error','email should we unique and password is more then 4 char')
     return res.redirect('/users/register')
    }
    res.redirect('/users/login')
  })
})

router.get('/login',(req,res,next)=>{
  console.log(req.session)
 var error = req.flash('error')
  res.render('loginForm',{error})
});

router.post('/login',(req,res,next)=>{
  var {email , password}=req.body
if(!email || !password){
  req.flash('error','fill also info')
 return res.redirect('/users/login')
}
User.findOne({email:email},(err,user)=>{
  if(err) return next(err)

if(!user){
  req.flash('error','email is not register')
  return res.redirect('/users/login')
}  

user.verifyPassword(password,(err,result)=>{
  if(err) return next(err);
  if(!result){
    req.flash('error','password is not match')
   return res.redirect('/users/login');
  }
  req.session.userId = user.id;
  res.redirect('/dashboard');
})
})
})
router.get('/logout',(req,res)=>{
  req.session.destroy();
  res.clearCookie('connect.sid')
  res.redirect('/users/login')

})

module.exports = router;
