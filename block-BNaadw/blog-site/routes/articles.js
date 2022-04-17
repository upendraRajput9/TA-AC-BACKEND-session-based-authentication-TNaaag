var express = require('express');
var Article = require("../models/Article")
let Comment = require("../models/Comment")
var router = express.Router();

/* GET users listing. */
router.get("/new",(req,res)=>{
  res.render("articleForm")
})
router.get('/',(req, res, next)=>{
  Article.find({},(err,articles)=>{
    if(err) return next(err)
    console.log(articles)
    res.render("articles",{articles:articles})
  })
});

router.get('/:slug',(req, res, next)=>{
  let slugger = req.params.slug;
  
  Article.findOne({slug:slugger}).populate('comments').exec((err,article)=>{
    if(err) return next(err);
    console.log(article,"🤑")
    res.render("singleArticle",{article:article})
  })
});

router.post("/",(req,res,next)=>{
  Article.create(req.body,(err,articles)=>{
    if(err) {
       return res.redirect("/articles/new")
    }
    res.redirect("/articles/")
  })
})

router.get('/:id/edit',(req, res, next)=>{
  let id = req.params.id;
  Article.findById(id,(err,article)=>{
    if(err) return next(err)
    console.log(article)
    res.render("updateArticle",{article:article})
  })
});
router.post("/:id/update",(req,res,next)=>{
  let id = req.params.id;
  Article.findByIdAndUpdate(id,req.body,(err,article)=>{
    if(err) return next(err)
    res.redirect("/articles/"+id)
  })
})

router.get("/:id/delete",(req,res,next)=>{
  let id = req.params.id;
  Article.findByIdAndDelete(id,(err,article)=>{
    console.log(article)
    if(err) return next(err)
    res.redirect("/articles")
  })
})

router.get("/:id/likes",(req,res,next)=>{
  let id = req.params.id;
  Article.findByIdAndUpdate(id,{$inc:{ likes: 1}},(err,article)=>{
    if(err) return next(err)
    res.redirect("/articles/"+id)
  })
})
router.get("/:id/dislike",(req,res,next)=>{
  let id = req.params.id;
  Article.findByIdAndUpdate(id,{$inc:{ likes: -1}},(err,article)=>{
    console.log(article)
    if(err) return next(err)
    res.redirect("/articles/"+id)
  })
})
router.post("/:id/comments",(req,res,next)=>{
  let id = req.params.id;
  req.body.articleId=id;
  
  Comment.create(req.body,(err,comment)=>{
    if(err) return next(err);
    Article.findByIdAndUpdate(id,{$push:{comments:comment._id}},(err,updatearticle)=>{
      if(err) return next(err);
      res.redirect("/articles/"+id)
    })
   
  })
  
})

module.exports = router;