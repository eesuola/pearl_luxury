import Order from "../model/order.model.js";
import Invoice from "../model/invoice.model.js";
import { v4 as uuidv4 } from "uuid";
const id = uuidv4();

export const createOrder = async (req, res) => {
  console.log("Register endpoint hit with body:", req.body);
  try {
    const order = new Order({
      customerName: req.body.customerName,
      items: req.body.items,
      totalAmount: req.body.totalAmount,
      status: "pending",
    });
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
export const generateInvoicePdf = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).send({ error: "Order not found" });
    }
    if (!order.customerName) {
      return res.status(400).send({ error: "Order is missing customerName" });
    }
    const invoice = new Invoice({
      orderId: order._id,
      customer: order.customerName,
      invoiceNumber: `INV-${uuidv4().substring(0, 8)}`,
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days time
      items: order.items.map((item) => ({
        description: item.description,
        quantity: item.quantity,
        price: item.price,
        amount: item.quantity * item.price,
      })),
      subtotal: order.items.reduce(
        (sum, item) => sum + item.quantity * item.price,
        0
      ),
      tax: 0,
      total: order.totalAmount,
    });
    await invoice.save();
    res.status(201).send(invoice);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};


export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("customer");
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
}
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("customer");
    if (!order) {
      return res.status(404).send({ message: "Order not found" });
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};