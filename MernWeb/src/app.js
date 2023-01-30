// to include env file
require('dotenv').config();
const express= require('express');
const path=require('path')
const app=express();
const multer=require('multer')
// to initialize the port variable to env value from the env file
const port =process.env.PORT || 80 ;
// to include the handle bars
const hbs=require('hbs');
const session=require('express-session');
// to encrypt the password or secure data 
const bcrypt=require('bcryptjs');
const cookieparser=require("cookie-parser")
// to use auth methode
const auth=require('./midleware/auth');
// to include  database connection
require("./db/conn")
// to include/require the database schema
const UserBio=require('./models/models')

// use to resolve the json formate
app.use(express.json())
// use to get the html value from inputs
app.use(express.urlencoded({extended:false}))
// using a cookies
app.use(cookieparser());


app.use(
    session({
    secret:"my secret key",
    saveUninitialized:true,
    resave:false
})
)
app.use((req,res,next)=>{
    res.locals.message=req.session.message;
    delete req.session.message;
    next();
})
// select the path values
// console.log(path.join(__dirname,'../'));
const templatePath=path.join(__dirname,'../template/views')
const partialsPath=path.join(__dirname,'../template/partials');
const static_path=path.join(__dirname,'../public')
app.use(express.static(static_path))
//  to set view engine
app.set('view engine','hbs');
// to register the partials
hbs.registerPartials(partialsPath);
app.set('views',templatePath);



app.get('/',(req,res)=>{
    console.log(`the cookies is the how are you`+req.cookies.jwt)

    res.render('index');
});
app.get('/about',auth,(req,res)=>{
    console.log(`the cookies is the ${req.cookies.jwt}`)
    res.render('about');
});
app.get('/services',auth,(req,res)=>{
    res.render('services');
});
app.get('/products',auth, (req,res)=>{
    res.render('products');
});
app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/signup',(req,res)=>{
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
app.post("/add",upload,async(req,res)=>{
                
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
    res.cookie("jwt",token,{
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
app.post('/login',async(req,res)=>{
    try{
       const email=req.body.email;
       const password=req.body.password;
       const useremail=await UserBio.findOne({email});

        const isMatch=await bcrypt.compare(password,useremail.password);
        const token= await useremail.generateAutoToken();
                // console.log(`the token is ${token}`)
                
                res.cookie("jwt",token,{
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

 app.get('*',(req,res)=>{
    res.render('error');
})


app.listen(port,()=>{
    console.log(`listen from the port ${port} ....`);
})