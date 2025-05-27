import express from "express"; //Anytime you want to use a router , you have to import these two items#
import * as customerController from "../controllers/customer.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
const routes = express.Router();

routes.post("/create-customer", authMiddleware, customerController.createCustomer);
routes.put("/update-customer/:id", authMiddleware, customerController.updateCustomer);
routes.get("/get-customers", authMiddleware, customerController.getCustomers);
routes.delete("/delete-customer/:id", authMiddleware, customerController.deleteCustomer);




export default routes;