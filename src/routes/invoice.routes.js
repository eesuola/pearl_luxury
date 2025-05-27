import express from "express"; //Anytime you want to use a router , you have to import these two items
import * as invoiceController from "../controllers/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();

//Invoice routes

routes.post("/create-invoice", authMiddleware, invoiceController.createInvoice);




export default routes;