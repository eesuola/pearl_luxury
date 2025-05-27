import express from "express"; //Anytime you want to use a router , you have to import these two items
import * as orderController from "../controllers/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();

// Order routes
routes.post("/create-order", authMiddleware, orderController.createOrder);





export default routes;