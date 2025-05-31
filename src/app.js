import express from "express";
import cors from "cors";
import helmet from "helmet";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import compression from "compression";
import path from 'path';
import session from "express-session";


//Routes imports

import authRoutes from "./routes/auth.routes.js";
//import customerRoutes from "./routes/customer.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import orderRoutes from "./routes/order.routes.js";
import salesRecordRoutes from "./routes/salesRecord.routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
//Middlewares
//session middleware
app.use(session({
  secret: "yourSecretKeyHere", // change to a secure key in production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));


//API REQUEST
//app.use("/", productsRoute);

app.use("/sales", salesRecordRoutes);
app.use("/order", orderRoutes);
//app.use("/customer", customerRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/api", authRoutes);
//Check endpoint

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timeStamp: new Date().toISOString(),
    service: "Pearl and Luxury API",
  });
});
app.get("/", (req, res) => {
  res.send(" Pearl and Luxury API");
});
// app.use('*', (req,res) =>{
//     res.status(404).json({
//         error: 'Routes not define',
//         path: req.originalUrl,
//         method: req.method
//     })
// })

export default app;
