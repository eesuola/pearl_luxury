import Receipt from "../../model/receipt.model.js";
import mongoose from 'mongoose';
import SalesBook from "../../model/salesBook.model.js";
import User from "../../model/user.model.js";
import { getNextSequenceValueSimple } from "../../model/counter.model.js";
import { v4 as uuidv4 } from 'uuid';
import PDFDocument from "pdfkit";
import PDFTable from "pdfkit-table";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import moment from "moment";
import bcrypt from "bcrypt";
import Counter from "../../model/counter.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
// Create a new receipt

export const registration = async (req, res) => {
  try {
    const { name, email, userName, password, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !userName || !role) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({
      name,
      email,
      userName,
      password,
      role,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }
    req.session.loggedIn = true;
    req.session.userName = user.name; // Ensure this is set
    res.json({ success: true, name: user.name }); // Explicitly return name
  } catch (error) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
    //console.log(error);
  }
};

export const logout = (req, res) => {
  try {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// const generateOrderId = async (sequenceName) => {
// const counter = await Counter.findOneAndUpdate(
//     { _id: sequenceName },
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true }
//   );
//   return counter.sequence_value;
// };
// Improved createReceipt function with better error handling
export const createReceipt = async (req, res) => {
  try {
    const {
      customerName,
      customerPhoneNumber,
      description,
      items,
      totalAmount,
      paymentMethod,
      amountPaid,
      balanceToPay,
      paymentStatus,
    } = req.body;

    // Validation
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    if (totalAmount !== total) {
      return res.status(400).json({ error: "Total amount does not match items total" });
    }

    if (!customerName || !customerPhoneNumber || !description || !items || 
        totalAmount == null || amountPaid == null || balanceToPay == null || 
        !paymentStatus || !paymentMethod) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const paid = Number(amountPaid) || 0;
    const balance = Number(balanceToPay) || (Number(totalAmount) - paid);

    // Use transaction for atomic operations
    const session = await mongoose.startSession();
    
    try {
      const result = await session.withTransaction(async () => {
        // Get next sequence number within transaction
        const sequence = await getNextSequenceValueSimple('orderid');
        const today = moment().format("YYYYMMDD");
        const orderId = `ORD${today}-${String(sequence).padStart(4, '0')}`; // e.g. ORD20250711-0012
        // const orderId = `ORD${String(sequence).padStart(5, '0')}`;
        
        console.log("About to save receipt with ID:", orderId);
        
        // Create receipt
        const newReceipt = new Receipt({
          orderId,
          customerName,
          customerPhoneNumber,
          description,
          items,
          totalAmount,
          paymentMethod,
          amountPaid: paid,
          balanceToPay: balance,
          paymentStatus: paymentStatus || "unpaid",
          dateOfPurchase: new Date(),
        });
        
        await newReceipt.save({ session });
        
        // Create sales book entry
        const salesBookEntry = new SalesBook({
          orderId,
          receiptId: orderId,
          customerName,
          description,
          totalAmount,
          amountPaid: paid,
          balanceToPay: balance,
          paymentStatus: paymentStatus || "Unpaid",
          dateOfPurchase: newReceipt.dateOfPurchase,
        });
        
        await salesBookEntry.save({ session });
        
        console.log("Receipt created successfully:", orderId);
        return { orderId, newReceipt };
      });
      
      // Generate PDF (outside transaction since it's not database related)
      const { orderId, newReceipt } = result;
      
      const doc = new PDFDocument({ margin: 50 });
      const fontPath = path.join(__dirname, "../public/DejaVuSans.ttf");
      doc.registerFont("NairaFont", fontPath);
      doc.font("NairaFont");

      let buffers = [];
      doc.on("data", buffers.push.bind(buffers));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        res.set({
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=receipt-${orderId}.pdf`,
        });
        res.send(pdfData);
      });

      // Add logo
      const logoPath = path.join(__dirname, "../public/logo.png");
      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 50, 50, { width: 100, align: "center" });
        doc.moveDown(4);
      }

      // Company details
      doc.font("NairaFont").fontSize(16).text("Opaline Opaque", { align: "center" });
      doc.font("NairaFont").fontSize(12).text("12, Jehovah Witness Ashi-Bodija estate Ibadan", { align: "center" });
      doc.moveDown(1);

      // Receipt title
      doc.font("NairaFont").fontSize(20).text("Receipt", { align: "center" });
      doc.moveDown(1);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);

      // Receipt details
      doc.font("NairaFont").fontSize(12);
      doc.text(`Order ID: ${orderId}`, 50, doc.y);
      doc.text(`Customer: ${customerName}`, 50, doc.y + 20);
      doc.text(`Phone: ${customerPhoneNumber}`, 50, doc.y + 20);
      doc.text(`Description: ${description}`, 50, doc.y + 20);
      doc.text(`Paid: ₦${paid.toFixed(2)}`, 50, doc.y + 20);
      doc.text(`Balance to Pay: ₦${balance.toFixed(2)}`, 50, doc.y + 20);
      doc.text(`Payment Status: ${paymentStatus}`, 50, doc.y + 20);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 50, doc.y + 20);
      doc.text(`Payment Method: ${paymentMethod}`, 50, doc.y + 20);
      doc.moveDown(2);

      // Items table
      const table = {
        headers: ["Item", "Quantity", "Price", "Subtotal"],
        rows: items.map((item) => [
          item.itemsPurchased,
          item.quantity.toString(),
          `₦${item.price.toFixed(2)}`,
          `₦${(item.quantity * item.price).toFixed(2)}`,
        ]),
      };

      doc.table(table, {
        prepareHeader: () => doc.font("NairaFont").fontSize(12),
        prepareRow: () => doc.font("NairaFont").fontSize(10),
        width: 500,
        padding: 5,
        columnSpacing: 10,
        x: 50,
        y: doc.y,
        headerColor: "#e5e7eb",
        divider: {
          header: { disabled: false, width: 1, opacity: 1 },
          horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
        },
      });

      // Total
      doc.moveDown(2);
      doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(1);
      doc.font("NairaFont").fontSize(14).text(`Total: ₦${totalAmount.toFixed(2)}`, { align: "right" });

      doc.end();
      
    } finally {
      await session.endSession();
    }
    
  } catch (error) {
    console.error("Error creating receipt:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
export const downloadReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const receipt = await Receipt.findOne({ orderId });
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }
    const {
      customerName,
      customerPhoneNumber,
      description,
      items,
      totalAmount,
      paymentMethod,
      amountPaid,
      balanceToPay,
      paymentStatus,
      dateOfPurchase,
    } = receipt;
    // Generate PDF
    const doc = new PDFDocument({ margin: 50 });
    let buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", () => {
      const pdfData = Buffer.concat(buffers);
      res.set({
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=receipt-${orderId}.pdf`,
      });
      res.send(pdfData);
    });

    // Register custom font (optional, assuming NairaFont is available)
    const fontPath = path.join(__dirname, "../public/DejaVuSans.ttf");
    doc.registerFont("NairaFont", fontPath);

    // Add logo
    const logoPath = path.join(__dirname, "../public/logo.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 30, { width: 100, align: "center" });
      doc.moveDown(4);
    } else {
      console.warn("Logo file not found, skipping logo.");
    }

    // Company details
    doc
      .font("NairaFont")
      .fontSize(16)
      .text("Opaline Opaque", { align: "center" });
    doc
      .font("NairaFont")
      .fontSize(12)
      .text("12, Jehovah Witness Ashi-Bodija estate Ibadan", {
        align: "center",
      });

    doc.moveDown(1);

    // Receipt title
    doc.font("NairaFont").fontSize(20).text("Receipt", { align: "center" });
    doc.moveDown(1);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke(); // Horizontal line
    doc.moveDown(1);

    // Receipt details
    doc.font("NairaFont").fontSize(12);
    doc.text(`Order ID: ${orderId}`, 50, doc.y);
    doc.text(`Customer: ${customerName}`, 50, doc.y + 20);
    doc.text(`Phone: ${customerPhoneNumber}`, 50, doc.y + 20);
    doc.text(`Description: ${description}`, 50, doc.y + 20);
    doc.text(
      `Date: ${new Date(dateOfPurchase).toLocaleDateString()}`,
      50,
      doc.y + 20
    );
    doc.text(`Paid: ₦${amountPaid.toFixed(2)}`, 50, doc.y + 20);
    doc.text(`Balance to Pay: ₦${balanceToPay.toFixed(2)}`, 50, doc.y + 20);
    doc.text(`Payment Status: ${paymentStatus}`, 50, doc.y + 20);
    doc.text(`Payment Method: ${paymentMethod}`, 50, doc.y + 20);
    doc.moveDown(2);

    // Items table
    const table = {
      headers: ["Item", "Quantity", "Price", "Subtotal"],
      rows: items.map((item) => [
        item.itemsPurchased,
        item.quantity.toString(),
        `₦${item.price.toFixed(2)}`,
        `₦${(item.quantity * item.price).toFixed(2)}`,
      ]),
    };

    doc.table(table, {
      prepareHeader: () => doc.font("NairaFont").fontSize(12),
      prepareRow: () => doc.font("NairaFont").fontSize(10),
      width: 500,
      padding: 5,
      columnSpacing: 10,
      x: 50,
      y: doc.y,
      headerColor: "#e5e7eb",
      divider: {
        header: { disabled: false, width: 1, opacity: 1 },
        horizontal: { disabled: false, width: 0.5, opacity: 0.5 },
      },
    });

    // Total
    doc.moveDown(2);
    doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
    doc.moveDown(1);
    doc
      .font("NairaFont")
      .fontSize(14)
      .text(`Total: ₦${totalAmount.toFixed(2)}`, { align: "right" });

    doc.end();
  } catch (error) {
    console.error("Error downloading receipt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find().sort({ createdAt: -1 });
    res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getSalesBook = async (req, res) => {
  try {
    const salesBook = await SalesBook.find().sort({ dateOfPurchase: -1 });
    res.status(200).json(salesBook);
  } catch (error) {
    console.error("Error fetching sales book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const receipt = await Receipt.findByIdAndDelete(id);
    if (!receipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }
    await SalesBook.deleteOne({ orderId: receipt.orderId });
    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.error("Error deleting receipt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAllReceipts = async (req, res) => {
  try {
    await Receipt.deleteMany();
    await SalesBook.deleteMany();
    await Counter.deleteMany({});
    res.status(200).json({ message: "All receipts deleted successfully" });
  } catch (error) {
    console.error("Error deleting all receipts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAllSalesBookEntries = async (req, res) => {
  try {
    await SalesBook.deleteMany();
    res
      .status(200)
      .json({ message: "All sales book entries deleted successfully" });
  } catch (error) {
    console.error("Error deleting all sales book entries:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
export const updateReceipt = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerPhoneNumber,
      description,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus,
      amountPaid,
      balanceToPay,
    } = req.body;

    let updateFields = {
      paymentMethod,
      paymentStatus,
      amountPaid,
      balanceToPay,
    };

    if (customerName !== undefined) updateFields.customerName = customerName;
    if (customerPhoneNumber !== undefined)
      updateFields.customerPhoneNumber = customerPhoneNumber;
    if (description !== undefined) updateFields.description = description;

    // Only update items and totalAmount if items are provided
    if (items !== undefined && Array.isArray(items)) {
      const total = items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      if (totalAmount !== total) {
        return res
          .status(400)
          .json({ error: "Total amount does not match items total" });
      }
      updateFields.items = items;
      updateFields.totalAmount = totalAmount;
    }

    const updatedReceipt = await Receipt.findOneAndUpdate(
      { orderId: id },
      updateFields,
      { new: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ error: "Receipt not found" });
    }

    // Update the sales book entry to match the updated receipt
    await SalesBook.updateOne(
      { orderId: updatedReceipt.orderId },
      {
        customerName: updatedReceipt.customerName,
        description: updatedReceipt.description,
        totalAmount: updatedReceipt.totalAmount,
        dateOfPurchase: updatedReceipt.dateOfPurchase,
      }
    );

    res.status(200).json({
      message: "Receipt updated successfully",
      receipt: updatedReceipt,
    });
  } catch (error) {
    console.error("Error updating receipt:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// export const updateReceipt = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       customerName,
//       customerPhoneNumber,
//       items,
//       amountPaid,
//       paymentStatus,
//       balanceToPay,
//       totalAmount,
//       paymentMethod,
//     } = req.body;

//     // Validate required fields
//     if (
//       !customerName ||
//       !customerPhoneNumber ||
//       !items ||
//       !amountPaid ||
//       !paymentStatus ||
//       !balanceToPay ||
//       !totalAmount ||
//       !paymentMethod
//     ) {
//       return res.status(400).json({ error: "All fields are required" });
//     }

//     const updatedReceipt = await Receipt.findByIdAndUpdate(
//       id,
//       {
//         customerName,
//         customerPhoneNumber,
//         items,
//         amountPaid,
//         paymentStatus,
//         balanceToPay,
//         totalAmount,
//         paymentMethod,
//         dateOfPurchase: new Date(),
//       },
//       { new: true }
//     );

//     if (!updatedReceipt) {
//       return res.status(404).json({ error: "Receipt not found" });
//     }

// Update the sales book entry
// await SalesBook.updateOne(
//   { orderId: updatedReceipt.orderId },
//   {
//     customerName: updatedReceipt.customerName,
//     totalAmount: updatedReceipt.totalAmount,
//     dateOfPurchase: updatedReceipt.dateOfPurchase,
//       }
//     );

//     res.status(200).json({
//       message: "Receipt updated successfully",
//       receipt: updatedReceipt,
//     });
//   } catch (error) {
//     console.error("Error updating receipt:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };
