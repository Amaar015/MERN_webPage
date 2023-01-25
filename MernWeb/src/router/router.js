const express =require('express')
const Model=require('../models/models')
const router=new express.Router();





router.get('/',(req,res)=>{
    res.render('index');
});
router.get('/about',(req,res)=>{
    res.render('about');
});
router.get('/services',(req,res)=>{
    res.render('services');
});
router.get('/products',(req,res)=>{
    res.render('products');
});

router.get('*',(req,res)=>{
    res.render('error');
})


// export module
module.exports=router;