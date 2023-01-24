const express=require('express');
const app =express();
// importing the router
const Routers =require('./router/router')

require('dotenv').config();

const port =process.env.PORT;
app.use(express.json());

app.use(Routers);


app.listen(port,()=>{
    console.log(`listen from the port ${port} ....`);
})