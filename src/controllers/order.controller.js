import Order from '../model/order.model.js';
import Invoice from '../model/invoice.model.js';
import { v4 as uuidv4 } from 'uuid';
const id = uuidv4();

export const createOrder = async(req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.status(201).send(order);
    } catch (error) {
        res.status(403).json({ message: error.message });
        
    }
};

export const generateInvoicePdf = async(req,res) => {
    try {
    const order =await Order.findById(req.params.orderId);
    if(!order) {
        return res.status(404).send({error: 'Order not found'})
    }
    const invoice = new Invoice({
        orderId: order._id,
        invoiceNumber: `INV-${uuidv4().substring(0, 8)}`,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), //7 days time
        items: order.items.map(item=>({
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            amount: item.quantity * item.price
        })),
        subtotal: order.items.reduce((sum, item) => sum + (item.quantity * item.price), 0),
        tax: 0,
        total: order.totalAmount
    });
    await invoice.save();
    res.status(201).send(invoice);
} catch(error) {
    res.status(400).send({ message: error.message });
}
}

