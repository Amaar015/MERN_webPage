const express =require('express')
const Model=require('../models/models')
const router=new express.Router();



router.get('/',(req,res)=>{
    res.send('hello i am live from home page')
})



// export module
module.exports=router;