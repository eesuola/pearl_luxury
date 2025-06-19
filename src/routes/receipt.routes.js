import express from 'express';
import {registration, login, getAllReceipts, createReceipt, updateReceipt, deleteReceipt, getSalesBook, deleteAllReceipts, deleteAllSalesBookEntries } from '../controllers/receipt.controller.js';

const routes = express.Router();
// Route to create a new admin user
routes.post ('/register', registration);
// Route to login an admin user
routes.post ('/login', login);
// Route to create a new receipt
routes.post ('/create-receipt', createReceipt);
// Route to get all receipts
routes.get('/receipts', getAllReceipts);
// Routes to get all sales book entries
routes.get('/sales-book', getSalesBook);

// Route to delete a receipt
routes.delete('/receipts/:id', deleteReceipt);
// Route to update a receipt
routes.put('/receipts/:id', updateReceipt);
// Route to delete all receipts
routes.delete('/delete-all-receipts', deleteAllReceipts);

// Route to delete all sales book entries
routes.delete('/delete-all-sales-book-entries', deleteAllSalesBookEntries);

export default routes;