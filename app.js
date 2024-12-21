import express from 'express';
import path from 'path';

const app = express();

app.use(express.static(path.resolve("./public")))

app.get('/',(req,res)=>{
    res.sendFile("index.html")
})

export default app;