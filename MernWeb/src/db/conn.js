const mongoose=require('mongoose');
const url ="mongodb://127.0.0.1:27017/UserBio";

mongoose.set('strictQuery', false);
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology:true,
                    //    useCreateIndex:true, useFindAndModify:true  
         })
.then(()=>{
    console.log("connection created successfuly ...")
}).catch((err)=>{
    console.log(`${err} occurs`)
})

