var express = require('express');
var path = require('path')
var fs = require('fs')
var Product = require('../models/Product');
var multer = require('multer');
var router = express.Router();
var Admin = require('../models/Admin')

var storage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,'./public/images')
    },
    filename:(req,file,cb)=>{
      console.log(file);
      cb(null,Date.now()+path.extname(file.originalname))
    }
  })
  
  var upload =multer({storage:storage})
//product page
router.get('/new/:id',(req,res)=>{
    let id = req.params.id
    res.render('productForm.ejs',{id:id})
})

router.get('/:id/',(req,res,next)=>{
    let userId = req.params.id
    Admin.findById(userId,(err,admin)=>{
        console.log(err,admin)
        if(err) return next(err)
    Product.find({},(err,products)=>{
        if(err) return next(err);
        res.render('products',{list:products,userId:userId,admin:admin})
    })
})
})

//get product added form
router.post('/:id',upload.single('image'),(req,res,next)=>{
    var id = req.params.id;
    req.body.image=req.file.filename
        Product.create(req.body,(err,product)=>{
            if(err) return next(err);
            console.log(product);
            res.redirect('/products/'+id)
        })
    });

//create product

//detail page
router.get('/:id/:userId',(req,res,next)=>{
    var id = req.params.id;
    var userId = req.params.userId;
Admin.findById(userId,(err,admin)=>{
    
    if(err) return next(err);
    Product.findById(id,(err,product)=>{
        console.log(product)
        if(err) return next(err);
        res.render('detail',{product:product,userId:userId,admin:admin})
    })
})
   
})
//likes
router.get('/:id/:userId/like',(req,res,next)=>{
    var id = req.params.id;
    var userId = req.params.userId;
    Product.findByIdAndUpdate(id,{$inc:{likes:+1}},(err,product)=>{
        console.log(product)
        if(err) return next(err);
        res.redirect('/products/'+id+'/'+userId)
    })
})
//dislike
router.get('/:id/:userId/dislike',(req,res,next)=>{
    var id = req.params.id;
    var userId = req.params.userId;
        Product.findById(id,(err,product)=>{
            if(err) return next(err);
            if(product.likes>0){
                Product.findByIdAndUpdate(id,{$inc:{likes:-1}},(err)=>{
                    if(err) return next(err);
                    res.redirect('/products/'+id+'/'+userId)
                })
            }
        })
})
//edit
router.get("/:id/:adminId/edit",(req,res,next)=>{
    var id = req.params.id;
    var adminId = req.params.adminId
    Product.findById(id,(err,product)=>{
        if(err) return next(err)
        res.render('editProduct',{product:product,adminId:adminId})
    })
});

router.post("/:id/:adminId/edit",upload.single('image'),(req,res,next)=>{
    var id = req.params.id;
    var adminId = req.params.adminId
    if(req.file!=undefined){
    req.body.image = req.file.filename
    }
    Product.findByIdAndUpdate(id,req.body,(err,product)=>{
        if(err) return next(err)
        let iteam = path.join('public/images/'+product.image)
        if(req.file!=undefined){
            fs.unlink(iteam,function(err){
              return res.redirect('/products/'+id+'/'+adminId)
            })
        }else{
            return res.redirect('/products/'+id+'/'+adminId)
        }
    })
})

//delete
router.get("/:id/:adminId/delete",(req,res,next)=>{
    var id = req.params.id;
    var adminId = req.params.adminId
    Product.findByIdAndDelete(id,(err,product)=>{
        if(err) return next(err)
        let iteam = path.join('public/images/'+product.image)
        fs.unlink(iteam,function(err){
            if(err) return next(err)
            res.redirect('/products/'+adminId)
        })
    })
})

module.exports= router