import express from "express"; //Anytime you want to use a router , you have to import these two items
import rateLimit from 'express-rate-limit'


const routes = express.Router();

//Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 //limit each IP
})




export default routes;