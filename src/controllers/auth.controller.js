import User from "../model/admin.model.js";
import Customer from "../model/customer.model.js";
import Measurement from "../model/measurement.model.js";
import { AppError } from "../utils/appError.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"; // Use bcryptjs for compatibility

export const register = async (req, res, next) => {
  console.log("Register endpoint hit with body:", req.body);
  try {
    const { email, password, name, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("User already exists", 400);
    }

    if (!email || !password || !name || !role) {
      throw new AppError("Email, password, role, and name are required", 400);
    }
    const user = new User({ email, password, name, role });
    await user.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  console.log("Login endpoint hit with body:", req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError("Email and password are required", 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new AppError("Invalid email or password", 401);
    }
    req.session.user = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    res.status(200).json({
      message: "Login successful",
      user: req.session.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};
export const createCustomer = async (req, res, next) => {
  console.log("Create Customer endpoint hit with body:", req.body);
  try {
    const { phoneNumber, name, role } = req.body;

    if (!phoneNumber || !role || !name) {
      throw new AppError("Phone number, role, and name are required", 400);
    }

    // Check if customer already exists by phoneNumber
    const existingCustomer = await Customer.findOne({ name });
    if (existingCustomer) {
      throw new AppError("Customer already exists", 400);
    }

    // Create new customer (force role to "Customer" or accept role from request)
    const customer = new Customer({ phoneNumber, name, role: "Customer" });
    await customer.save();

    // Redirect to measurement page for this customer
    return res.redirect(`/measurement.html?customerId=${customer._id}`);
  } catch (error) {
    console.error("Create Customer error:", error);
    next(error);
  }
};
export const getCustomers = async (req, res, next) => {
  console.log("Get Customers endpoint hit");
  try {
    const customers = await Customer.find({});
    res.status(200).json({
      message: "Customers retrieved successfully",
      customers,
    });
  } catch (error) {
    console.error("Get Customers error:", error);
    next(error);
  }
};

export const deleteAccount = async (req, res, next) => {
  console.log("Delete All Users endpoint hit");
  try {
    const result = await User.deleteMany({});
    res.status(200).json({
      message: "All users deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Delete All Users error:", error);
    next(error);
  }
};

export const logout = async (req, res) => {
  console.log("Logout endpoint hit");
  try {
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destruction error:", err);
        return res.status(500).json({ message: "Logout failed" });
      }
      res.status(200).json({ message: "Logout successful" });
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Logout failed" });
  }
};

export const saveMeasurement = async (req, res) => {
  console.log("Save Measurement endpoint hit with body:", req.body);
  try {
    // Assuming you have a Measurement model for MongoDB/Mongoose or other DB ORM
    const measurementData = req.body;

    // Save measurementData to database
    const savedMeasurement = await Measurement.create(measurementData);

    res.status(201).json({ message: 'Measurement saved', data: savedMeasurement });
  } catch (error) {
    console.error('Error saving measurement:', error);
    res.status(500).json({ error: 'Failed to save measurement' });
  }
};

export const fetchCustomerById = async (req, res, next) => {
  console.log("Fetch Customer by ID endpoint hit with ID:", req.params.id);
  try {
    const customerId = req.params.id;
    const customer = await Customer.findById(customerId);
    if (!customer) {
      throw new AppError("Customer not found", 404);
    }
    res.status(200).json({
      message: "Customer retrieved successfully",
      customer,
    });
  }
  catch (error) {
    console.error("Fetch Customer by ID error:", error);
    next(error);
  }
}