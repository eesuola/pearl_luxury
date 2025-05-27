const { default: PDFDocument } = await import('pdfkit');
import fs from 'fs';



export const generateInvoicePdf = async (invoice, order, outputPath) =>{
    const doc = new PDFDocument();
    
    doc.fontSize(20).text('INVOICE', {align: 'center'});
    doc.moveDown();

    doc.pipe(fs.createWriteStream(outputPath));
    
    // Header
    doc.fontSize(20).text('INVOICE', { align: 'center' });
    doc.moveDown();
    
    //Invoice details

    doc.fontSize(12).text(`Invoice Number: ${invoice.invoiceNumber}`);
    doc.text (`Date: ${invoice.issueDate.toLocaleDateString()}`);
    doc.text(`Customer: ${order.customerName}`);
    doc.moveDown();
    //Table Header
    doc.font ('Helvetica-Bold').text('Description', 50,200);
    doc.text('Qty', 250, 200);
    doc.text('Price', 300, 200);
    doc.text('Amount', 350, 200);
    doc.font('Helvetica');

    //item
    let y = 220;
    invoice.items.forEach(item => {
        doc.text(item.description, 50, y)
        doc.text(item.quantity.toString(), 250, y);
        doc.text(`$${item.price.toFixed(2)}`, 300, y);
        doc.text(`$${item.amount.toFixed(2)}`, 350, y);

        y += 20;
    });
    
    //Total
    doc.moveDown();
    doc.font('Helvetica-Bold').text(`Total: $${invoice.total.toFixed(2)}`, {align: 'right'});

    doc.end();
    return outputPath;
}
