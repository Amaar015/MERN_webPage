const express =require('express')
const UserBio=require('../models/models')
const router=new express.Router();
const multer =require('multer');
const path=require('path');
const fs=require('fs');
const { Console } = require('console');
const User = require('../models/models');
const bcrypt=require('bcryptjs');

require("../db/conn")



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
router.get('/login',(req,res)=>{
    res.render('login');
});

router.get('/signup',(req,res)=>{
    res.render('register');
});

// Uploads image midle-ware

var storage=multer.diskStorage({
    destination:'public/backend/image',
    filename:(req,file,cb)=>{
        cb(null,file.originalname);
    }
})
var upload=multer({
    storage:storage,
}).single('image');
 
// to register the incoming data
router.post("/add",upload,async(req,res)=>{
                
    try{     
        const password=req.body.password;
        const Cpassword=req.body.Cpassword;
        if(password===Cpassword){
        const user=await new UserBio({
    name:req.body.name,
    email:req.body.email,
    phone:req.body.phone,
    password:req.body.password,
    image:req.file.filename
    })
    const token=await user.generateAutoToken();
    res.cookie("user_login",token,{
        expires:new Date(Date.now()+ 30000),
        httpOnly:true
    });
    user.save((err)=>{
    if(err){
           res.json({message:err.message, type:"danger"})
    }else{
    req.session.message ={
    type:"success",
    message:"User added Successfuly",
    };
     res.redirect("/");
     }
    });
}else{
    res.send('password dose not match ! please try again');
}                        
            }catch(err){
                    console.log(err);
                    }
       
    })
// login page
router.post('/login',async(req,res)=>{
    try{
       const email=req.body.email;
       const password=req.body.password;
       const useremail=await UserBio.findOne({email});

        const isMatch=await bcrypt.compare(password,useremail.password);
        if(isMatch){
            res.status(201).render('index');
        }else{
            res.status.send('Password or email is invalid')
        }

       //    console.log(useremail);
    //    res.redirect('/');
    }catch(err){
        res.render(err);
    }
})

router.get('*',(req,res)=>{
    res.render('error');
})


// export module
module.exports=router;