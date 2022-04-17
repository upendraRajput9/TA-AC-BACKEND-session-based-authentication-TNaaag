var express = require('express');
let Comment = require("../models/Comment");
let Article = require("../models/Article")
var router = express.Router();

router.get("/:id/edit",(req,res)=>{
    let id = req.params.id;
    Comment.findById(id,(err,comment)=>{
        if(err) return next(err)
res.render("commentUpdate",{comment})
    })
})
router.post("/:id",(req,res)=>{
    let id = req.params.id;
    console.log(req.body)
    Comment.findByIdAndUpdate(id,{content:req.body.content},(err,comment)=>{
        if(err) return next(err)
res.redirect("/articles/"+comment.articleId)
    })
})

router.get("/:id/delete",(req,res)=>{
    let id = req.params.id;
    Comment.findByIdAndRemove(id,(err,comment)=>{
        if(err) return next(err)
        Article.findByIdAndUpdate(comment.articleId,{$pull:{comments:comment._id}},(err,article)=>{
            res.redirect("/articles/"+comment.articleId)
        })

    })
})

router.get("/:id/delete",(req,res)=>{
    let id = req.params.id;
    Comment.findByIdAndRemove(id,(err,comment)=>{
        if(err) return next(err)
        Article.findByIdAndUpdate(comment.articleId,{$pull:{comments:comment._id}},(err,article)=>{
            res.redirect("/articles/"+comment.articleId)
        })

    })
})


router.get("/:id/delete",(req,res)=>{
    let id = req.params.id;
    Comment.findByIdAndRemove(id,(err,comment)=>{
        if(err) return next(err)
        Article.findByIdAndUpdate(comment.articleId,{$pull:{comments:comment._id}},(err,article)=>{
            res.redirect("/articles/"+comment.articleId)
        })

    })
})

router.get("/:id/like",(req,res)=>{
    let id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc:{ likes: 1}},(err,comment)=>{
        if(err) return next(err)
            res.redirect("/articles/"+comment.articleId)
    })
})
router.get("/:id/dislike",(req,res)=>{
    let id = req.params.id;
    Comment.findByIdAndUpdate(id,{$inc:{ dislikes: 1}},(err,comment)=>{
        if(err) return next(err)
            res.redirect("/articles/"+comment.articleId)
    })
})



module.exports= router