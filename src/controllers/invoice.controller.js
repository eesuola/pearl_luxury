import Invoice from "../model/invoice.model.js";
import SalesRecord from "../model/sales.model.js";
import Receipt from "../model/receipt.model.js";
import Order from "../model/order.model.js";
import Counter from "../model/counter.model.js";


const getNextReceiptNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "receipt" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `RCP-${String(counter.seq).padStart(6, '0')}`;
};

export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).send({ error: "Invoice not found" });
    }
    if (invoice.paid) {
      return res.status(400).send({ error: "Invoice already paid" });
    }
    const receiptNumber = await getNextReceiptNumber();
    const receipt = new Receipt({
      invoiceId: invoice._id,
      receiptNumber,
      paymentDate: new Date(),
      amountPaid: invoice.total,
      paymentMethod: req.body.paymentMethod || "bank_transfer",
      notes: req.body.notes,
    });
    await receipt.save();
    invoice.paid = true;
    await invoice.save();
    const order = await Order.findById(invoice.orderId);
    const salesRecord = new SalesRecord({
      receiptId: receipt._id,
      amount: receipt.amountPaid,
      customerName: order.customerName,
      orderId: order._id,
      paymentMethod: receipt.paymentMethod,
    });
    await salesRecord.save();
    res.status(201).send({ receipt, salesRecord });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

export const createReceipt = async (req, res) => {
  try {
    const { customer, amountPaid, paymentMethod, notes, invoiceId } = req.body;
    if (!customer || !amountPaid || !paymentMethod) {
      return res.status(400).send({ error: "Customer, amount paid, and payment method are required" });
    }
    let invoice = null;
    if (invoiceId) {
      invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).send({ error: "Invoice not found" });
      }
    }
    const receiptNumber = await getNextReceiptNumber();
    const receipt = new Receipt({
      invoiceId: invoice?._id,
      receiptNumber,
      paymentDate: new Date(),
      amountPaid,
      paymentMethod,
      notes,
    });
    await receipt.save();
    if (invoice) {
      invoice.paid = true;
      await invoice.save();
      const order = await Order.findById(invoice.orderId);
      const salesRecord = new SalesRecord({
        receiptId: receipt._id,
        amount: receipt.amountPaid,
        customerName: order.customerName,
        orderId: order._id,
        paymentMethod: receipt.paymentMethod,
      });
      await salesRecord.save();
      res.status(201).send({ receipt, salesRecord });
    } else {
      res.status(201).send({ receipt });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};