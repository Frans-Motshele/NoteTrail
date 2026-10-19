import express from 'express';
import notesRoutes from "./routes/notesRoute.js"
import { connectdb } from './config/db.js';
import  dotenv from  "dotenv";
import rateLimiter from './middleware/rateLimiter.js';

import cors from 'cors';
import path from 'path';

dotenv.config();

const app = express();
const port = process.env.Port
const __dirname = path.resolve(); //get the current directory

//middleware
app.use(express.json()) //parses JSON bodies: req.body
app.use(rateLimiter)

if(process.env.NODE_ENV !== "production"){// get rid pf cors in production mode, because the frontend and backend will be served from the same domain(localhost:5001)
    app.use(cors({  //this is to accept the requests from the frontend
    origin: 'http://localhost:5173', //  frontend URL
}))
}


app.use("/api/notes",notesRoutes)


if(process.env.NODE_ENV === "production"){ // this is for our application when it is deployed in production mode,server will serve the frontend files from the dist folder
    app.use(express.static(path.join(__dirname, "../frontend/dist")))//make the dist folder inside the frontend static

app.get("*",(req,res)=>{
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html")) //send the index.html file for any route that is not found
})}


connectdb().then(()=>{
    app.listen(port, () =>{
    console.log('Server is running on port:', port);
});
})



