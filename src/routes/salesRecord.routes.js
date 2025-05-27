import express from "express"; //Anytime you want to use a router , you have to import these two items
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
const routes = express.Router();

// Sales Record routes

//routes.get("/getAllSalesRecord", authMiddleware, orderController.getSalesRecords);




export default routes;