const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs').promises;

async function mergePDFs() {
  try {
    // Load the first PDF
    const pdfData1 = await fs.readFile('pdfs/dummy.pdf');
    const pdfDoc1 = await PDFDocument.load(pdfData1);

    // Load the second PDF
    const pdfData2 = await fs.readFile('pdfs/example.pdf');
    const pdfDoc2 = await PDFDocument.load(pdfData2);

    // Create a new PDF document for the merged PDF
    const mergedPdf = await PDFDocument.create();

    // Add pages from the first PDF
    const pages1 = await mergedPdf.copyPages(pdfDoc1, pdfDoc1.getPageIndices());
    pages1.forEach((page) => mergedPdf.addPage(page));

    // Add pages from the second PDF
    const pages2 = await mergedPdf.copyPages(pdfDoc2, pdfDoc2.getPageIndices());
    pages2.forEach((page) => mergedPdf.addPage(page));

    // Save the merged PDF to a file
    const mergedPdfBytes = await mergedPdf.save();
    await fs.writeFile('merged.pdf', mergedPdfBytes);

    console.log('PDFs merged successfully.');
  } catch (error) {
    console.error('PDF merging failed:', error);
  }
}

mergePDFs();
