import Invoice from "../model/invoice.model.js";
import SalesRecord from "../model/sales.model..js";
import Receipt from "../model/receipt.model.js";
import { v4 as uuidv4 } from "uuid";
import Order from "../model/order.model.js";
import Counter from "../model/counter.model.js";

const id = uuidv4();

const getNextReceiptNumber = async () => {
  const counter = await Counter.findOneAndUpdate(
    { name: "receipt" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  return `RCP-${String(counter.seq).padStart(6, '0')}`; // e.g., RCP-000001
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

    //Sales Record

    const order = await Order.findById(invoice.orderId);
    const salesRecord = new SalesRecord({
      receiptId: receipt._id,
      amount: receipt.amountPaid,
      customerName: order.customerName,
      orderId: order._id,
      paymentMethod: receipt.paymentMethod,
    });
    await salesRecord.save();

    res.status(201).send({
      receipt,
      salesRecord,
    });
  } catch (error) {
    res.status(404).send(error);
  }
};
