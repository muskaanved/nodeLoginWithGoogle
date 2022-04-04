var express =  require('express');
var cors = require('cors')

var app = express();

var port = process.env.PORT || 3000

app.get('/',(req,res)=>{
    res.status(200).send("Working.......")
})

app.listen(port,()=>{
    console.log(`server is ready to port on ${port}`)
})