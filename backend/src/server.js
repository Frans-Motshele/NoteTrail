import express from 'express';
import notesRoutes from "./routes/notesRoute.js"
import { connectdb } from './config/db.js';
import  dotenv from  "dotenv";
import rateLimiter from './middleware/rateLimiter.js';

import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.Port

//middleware
app.use(express.json()) //parses JSON bodies: req.body

app.use(cors({
    origin: 'http://localhost:5173', //  frontend URL
}))

app.use(rateLimiter)

app.use("/api/notes",notesRoutes)


connectdb().then(()=>{
    app.listen(port, () =>{
    console.log('Server is running on port:', port);
});
})



