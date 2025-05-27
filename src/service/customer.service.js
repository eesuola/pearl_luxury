import Customer from '../model/customer.model.js';
import { AppError } from '../utils/appError.js';

export const createCustomer = async (customerData, user) => {
    console.log("CreateCustomer called with data:", customerData, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can create customers", 403);
    }

    const { name, email, phone } = customerData;
    if (!name || !email || !phone) {
        throw new AppError("Name, email, and phone are required", 400);
    }

    const existingCustomer = await Customer.findOne({ where: { email } });
    if (existingCustomer) {
        throw new AppError("Email already exists", 400);
    }

    const newCustomer = await Customer.create({
        name,
        email,
        phone,
    });

    return newCustomer;
};
export const updateCustomer = async (id, customerData, user) => {
    console.log("UpdateCustomer called with id:", id, "data:", customerData, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can update customers", 403);
    }

    const { name, email, phone } = customerData;
    if (!name || !email || !phone) {
        throw new AppError("Name, email, and phone are required", 400);
    }

    const customer = await Customer.findByPk(id);
    if (!customer) {
        throw new AppError("Customer not found", 404);
    }

    customer.name = name;
    customer.email = email;
    customer.phone = phone;
    await customer.save();

    return customer;
};

export const getCustomers = async () => {
    console.log("GetCustomers called");
    const customers = await Customer.findAll();
    return customers;
};
export const deleteCustomer = async (id, user) => {
    console.log("DeleteCustomer called with id:", id, "by user:", user);
    if (user && user.role !== 'admin') {
        throw new AppError("Only admins can delete customers", 403);
    }

    const customer = await Customer.findByPk(id);
    if (!customer) {
        throw new AppError("Customer not found", 404);
    }

    await customer.destroy();
    return { message: "Customer deleted successfully" };
}
export const getAllCustomers = async () => {
    console.log("GetAllCustomers called");
    const customers = await Customer.findAll();
    return customers;
}