// import Customer from '../models/customer.model.js';
import * as customerService from '../service/customer.service.js';
import { AppError } from '../utils/appError.js';


export const createCustomer = async (req, res, next) => {
    console.log("CreateCustomer endpoint hit with body:", req.body);
    try {
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
        throw new AppError("Name, email, and phone are required", 400);
        }
        const customer = await customerService.createCustomer({ name, email, phone });
        res.status(201).json({
        message: "Customer created successfully",
        customer,
        });
    } catch (error) {
        console.error("CreateCustomer error:", error);
        next(error);
    }
};
export const updateCustomer = async (req, res, next) => {
    console.log("UpdateCustomer endpoint hit with body:", req.body);
    try {
        const { id } = req.params;
        const { name, email, phone } = req.body;
        if (!name || !email || !phone) {
            throw new AppError("Name, email, and phone are required", 400);
        }
        const updatedCustomer = await customerService.updateCustomer(id, { name, email, phone });
        res.status(200).json({
            message: "Customer updated successfully",
            customer: updatedCustomer,
        });
    } catch (error) {
        console.error("UpdateCustomer error:", error);
        next(error);
    }
};



export const getCustomers = async (req, res, next) => {
    console.log("GetCustomers endpoint hit");
    try {
        const customers = await customerService.getCustomers();
        res.status(200).json({
            message: "Customers retrieved successfully",
            customers,
        });
    } catch (error) {
        console.error("GetCustomers error:", error);
        next(error);
    }
};

export const deleteCustomer = async (req, res, next) => {
    console.log("DeleteCustomer endpoint hit with id:", req.params.id);
    try {
        const { id } = req.params;
        await customerService.deleteCustomer(id);
        res.status(200).json({
            message: "Customer deleted successfully",
        });
    } catch (error) {
        console.error("DeleteCustomer error:", error);
        next(error);
    }
}

export const searchCustomers = async (req, res, next) => {
    console.log("SearchCustomers endpoint hit with query:", req.query);
    try {
        const { query } = req.query;
        if (!query) {
            throw new AppError("Search query is required", 400);
        }
        const customers = await customerService.searchCustomers(query);
        res.status(200).json({
            message: "Customers retrieved successfully",
            customers,
        });
    } catch (error) {
        console.error("SearchCustomers error:", error);
        next(error);
    }
}

export const getAllCustomers = async (req, res, next) => {
    console.log("GetAllCustomers endpoint hit");
    try {
        const customers = await customerService.getAllCustomers();
        res.status(200).json({
            message: "All customers retrieved successfully",
            customers,
        });
    } catch (error) {
        console.error("GetAllCustomers error:", error);
        next(error);
    }
}