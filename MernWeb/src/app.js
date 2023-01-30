require('dotenv').config();

const express=require('express');
const app =express();
// importing the router
const Routers =require('./router/router')
const path=require('path');
const hbs=require('hbs')
// used to show variables in the html/hbs file
app.use(express.urlencoded({extended:false}))
const port =process.env.PORT || 80;
app.use(express.json());
const session=require('express-session')

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
// console.log(path.join(__dirname,'../public'));
const templatePath=path.join(__dirname,'../template/views')
const partialsPath=path.join(__dirname,'../template/partials');
const static_path=path.join(__dirname,'../public')
app.use(express.static(static_path))
//  to set view engine
app.set('view engine','hbs');
// to register the partials
hbs.registerPartials(partialsPath);
app.set('views',templatePath);


app.use(Routers);


app.listen(port,()=>{
    console.log(`listen from the port ${port} ....`);
})