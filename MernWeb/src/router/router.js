const express =require('express')
const UserBio=require('../models/models')
const router=new express.Router();
const multer =require('multer');
const path=require('path');
const fs=require('fs');
const { Console } = require('console');
const bcrypt=require('bcryptjs');
const cookieparser=require("cookie-parser")
const auth=require('../midleware/auth')
require("../db/conn")
const jwt=require('jsonwebtoken');

router.use(cookieparser());

router.get('/',(req,res)=>{
    console.log(`the cookies is the how are you`+req.cookies.jwt)

    res.render('index');
});
router.get('/about',auth,(req,res)=>{
    console.log(`the cookies is the ${req.cookies.jwt}`)
    res.render('about');
});
router.get('/services',auth,(req,res)=>{
    res.render('services');
});
router.get('/products',auth, (req,res)=>{
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
        const token= await useremail.generateAutoToken();
                // console.log(`the token is ${token}`)
                
                res.cookie("user_login",token,{
                    expires:new Date(Date.now()+ 3000000),
                    httpOnly:true
                });
        if(isMatch){
            res.status(201).render('index');
        }else{
            res.send("Email or Password is invalid")
        }
    }catch(err){
        res.status(404).send("Email or Password is invalid")
    }
 })

router.get('*',(req,res)=>{
    res.render('error');
})


// export module
module.exports=router;