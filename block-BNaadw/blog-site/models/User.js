var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var Schema = mongoose.Schema;
var userSchema = new Schema({
    fullname:String,
    email:{type:String,required:true,unique:true},
    password:{type:String},
    city:String
})

userSchema.pre('save',function(next){
    if(this.password && this.isModified('password')){
        bcrypt.hash(this.password,10,(err,hashing)=>{
            if(err) return next(err);
            this.password = hashing;
            console.log(this.password)
            return next()
        })
    }else{
      return next()
    }
  })
  userSchema.methods.verifyPassword = function(password,cb){
      bcrypt.compare(password,this.password,(err,result)=>{
          return cb(err,result)
      })
  }
  
  


module.exports = mongoose.model('User',userSchema);