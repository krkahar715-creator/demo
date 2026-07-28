import express from 'express';
import 'dotenv/config';
const app = express()
const port = process.env.PORT || 4000

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get("/twitter",(req,res)=>{
    res.send("twiter.....");
})
app.get("/login",(req,res) =>{
    res.send("<h1>Welcome to backend development</h1>")
})
app.get("/youtube",(req,res)=>{
    res.send("<h2>Welcome to youtube </h2>")
})

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})