import Invoice from "../model/invoice.model.js";
import SalesRecord from "../model/sales.model..js";
import Receipt from "../model/receipt.model.js";
import { v4 as uuidv4 } from "uuid";
import Order from "../model/order.model.js";

const id = uuidv4();

export const createInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.invoiceId);
    if (!invoice) {
      return res.status(404).send({ error: "Invoice not found" });
    }
    if (invoice.paid) {
      return res.status(400).send({ error: "Invoice already paid" });
    }
    const receipt = new Receipt({
      invoiceId: invoice._id,
      receiptNumber: `RCP-${uuidv4().substring(0, 8)}`,
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
