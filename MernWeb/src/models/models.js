const mongoose=require("mongoose");
const validator=require("validator")
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const UserBioSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        minlength:3
    },
    email:{
        type:String,
        required:true,
        unique:[true,"Email is already present! please enter new email Id"],
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is Invalid")
            }
        }
        },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
   image:{
       type:String,
       required:true
   },
   Created:{
    type:Date,
    required:true,
    default:Date.now, 
   },
   tokens:[{
    token:[{
    type:String,
    required:true,
}]
}]

    
})

// to generate token 
UserBioSchema.methods.generateAutoToken =async function(){
    try{
       // console.log(this._id)
       const token=jwt.sign({_id:this._id.toString()}, "mynameistheamaarandiamundergraduatestudent")
       this.tokens=this.tokens.concat({token:token});
       await this.save();
       return token;
    }catch(err){
            res.send(`the error is ${err}`)
           //  console.log(`the error is ${err}`);
    }
}


UserBioSchema.pre("save", async function(next){
   if(this.isModified("password")){
    //    console.log(`before current password is ${this.password}`);
       this.password=await bcrypt.hash(this.password,10)
    //    console.log(`current password is ${this.password}`);
   }
   next();
})
// create a new collection 

const UserBio=new mongoose.mongoose.model("UserBio",UserBioSchema);

module.exports=UserBio;