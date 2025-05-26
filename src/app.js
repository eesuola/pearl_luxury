import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import rateLimit from 'express-rate-limit'

//Routes imports

import { connectDB } from "./routes/auth.routes.js";
import { connectDB } from "./routes/customer.routes.js";
import { connectDB } from "./routes/invoice.routes.js";
import { connectDB } from "./routes/order.routes.js";
import { connectDB } from "./routes/salesRecord.routes.js";





const app = express();

//Rate Limit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes
    max: 100 //limit each IP
})

//Middlewares

app.use(helmet())
app.use(compression())
app.use(cors())
app.use(limiter())
app.use(express.json({ limit: '10mb'}))
app.use(express.urlencoded({ extended: true}))

app.use('/uploads', express.static('./src/uploads'))

//API REQUEST
app.use('/api/sales', salesRoutes)
app.use('/api/product', productRoutes)
app.use('/api/report', reportRoutes)
app.use('/api/invoice', invoiceRoutes)
app.use('/api/receipt', receiptRoutes)
app.use('/api/auth', authRoutes)


//Check endpoint

app.get ('/health', (req, res) =>{
    res.status(200).json({
        status: 'OK',
        timeStamp: new Date().toISOString(),
        service: 'Fashion Receipt API'
    })
})

app.use('*', (req,res) =>{
    res.status(404).json({
        error: 'Routes not define',
        path: req.originalUrl,
        method: req.method
    })
})



export default app
