var mongoose = require("mongoose");
var slug = require('slug')
var Schema = mongoose.Schema;

var articleSchema = new Schema({
    title:{type:String,required:true},
    description:{type:String,required:true},
    author:String,
    likes:{type:Number,default:0, minimum: 0},
    comments:[{type: Schema.Types.ObjectId , ref:"Comment"}],
    slug:{type:String,unique:true}
},{timestamps:true});

articleSchema.pre('save',function(next){
  this.slug= slug(this.title, '-')
  console.log(this.slug)
  return next()
})

module.exports = mongoose.model("Article",articleSchema)