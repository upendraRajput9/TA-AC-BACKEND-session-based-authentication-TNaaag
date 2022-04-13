var express = require('express');
var User = require('../model/User')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/register',(req,res)=>{
  res.render('userForm')
})

router.post('/register',(req,res,next)=>{
  User.create(req.body,(err,user)=>{
    console.log(err,user)
    
  })
})

module.exports = router;
