var express = require('express')
var User = require('../model/User')
var router = express.Router()

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource')
})

//get registration form
router.get('/register', (req, res) => {
  var error = req.flash('error')
  res.render('userForm',{error})
})

//user register
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err){
      req.flash('error','email should be unique and password should be more than 5 char..')
      return res.redirect('/users/register')
    } 
    res.redirect('/users/login')
  })
})

//Get login form
router.get('/login', (req, res) => {
  var message = req.flash('message')
  res.render('loginForm',{message})
})

//login
router.post('/login', (req, res, next) => {
  var { email, password } = req.body
  if (!email || !password) {
    req.flash('message','fill all info')
    return res.redirect('/users/login')
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err)
    if (!user) {
      req.flash('message','user is not found')
      return res.redirect('/users/login')
    }

    user.verifyPassword(password, (err, result) => {
      if (err) return next(err)
      if (!result) {
        req.flash('message','password is not match')
        return res.redirect('/users/login')
      }else{
        req.session.userId = user.id;
 res.redirect('/')
      }
    })
  })
})

module.exports = router
