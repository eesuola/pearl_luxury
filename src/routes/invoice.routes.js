import express from "express"; //Anytime you want to use a router , you have to import these two items
import * as invoiceController from "../controllers/invoice.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();

//Invoice routes

routes.post("/create-invoice", invoiceController.createInvoice);
routes.post("/invoice/:invoiceId/receipt", authMiddleware, invoiceController.createInvoice);
//routes.post("/create-receipt", authMiddleware, invoiceController.createReceipt);




export default routes;