import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

//Routes imports

import authRoutes from "./routes/auth.routes.js";
import customerRoutes from "./routes/customer.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import orderRoutes from "./routes/order.routes.js";
import salesRecordRoutes from "./routes/salesRecord.routes.js";

const app = express();

//Middlewares

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("./src/uploads"));

//API REQUEST
//app.use("/", productsRoute);

app.use("/sales", salesRecordRoutes);
app.use("/order", orderRoutes);
app.use("/customer", customerRoutes);
app.use("/invoice", invoiceRoutes);
app.use("/auth", authRoutes);
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
