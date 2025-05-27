import express from "express";
import * as courseController from "../controllers/course.controller.js";
import * as invoiceController from "../controllers/invoice.controller.js";
import * as orderController from "../controllers/order.controller.js";
import * as salesController from "../controllers/sales.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const routes = express.Router();

//customers

routes.post("/create-customer", authMiddleware, courseController.createCustomer);
routes.put("/update-customer/:id", authMiddleware, courseController.updateCustomer);
routes.get("/get-customers", authMiddleware, courseController.getCustomers);
routes.delete("/delete-customer/:id", authMiddleware, courseController.deleteCustomer);

//sales
routes.post("/create-sale", authMiddleware, salesController.createSale);
routes.put("/update-sale/:id", authMiddleware, salesController.updateSale);
routes.get("/get-sales", authMiddleware, salesController.getSales);
routes.delete("/delete-sale/:id", authMiddleware, salesController.deleteSale);

//invoices
routes.post("/create-invoice", authMiddleware, invoiceController.createInvoice);
routes.put("/update-invoice/:id", authMiddleware, invoiceController.updateInvoice);
routes.get("/get-invoices", authMiddleware, invoiceController.getInvoices);
routes.delete("/delete-invoice/:id", authMiddleware, invoiceController.deleteInvoice);
//orders
routes.post("/create-order", authMiddleware, orderController.createOrder);
routes.put("/update-order/:id", authMiddleware, orderController.updateOrder);  
routes.get("/get-orders", authMiddleware, orderController.getOrders);
routes.delete("/delete-order/:id", authMiddleware, orderController.deleteOrder);

export default routes;