const puppeteer = require('puppeteer');
const { jsPDF } = require('jspdf');
const NodeCache = require('node-cache');
const pdfCache = new NodeCache({ stdTTL: 600, checkperiod: 120 }); // Cache with a 10-minute TTL
const cacheKey = 'myCacheKey';
const cacheValue = 'Some cached value';

// Store the data in the cache
pdfCache.set(cacheKey, cacheValue);

// To verify that the data is in the cache, you can retrieve it
const cachedData = pdfCache.get(cacheKey);
console.log('Cached Data:', cachedData);

async function generatePDF(req, res) {
  const { lib,htmlContent, config,inputKey } = req.body;

  // Include an employee table in the HTML content
  // We can add htmlContent from  here or by post request in postman
  // const htmlContent = `
  //   <html>
  //     <body>
  //       <h1>Employee List</h1>
  //       <table border='1'>
  //         <tr>
  //           <th>ID</th>
  //           <th>Name</th>
  //           <th>Position</th>
  //         </tr>
  //         <tr>
  //           <td>1</td>
  //           <td>John Wick</td>
  //           <td>Manager</td>
  //         </tr>
  //         <tr>
  //           <td>2</td>
  //           <td>Will Smith</td>
  //           <td>Developer</td>
  //         </tr>
  //       </table>
  //     </body>
  //   </html>`;

  try {
    const cacheKey = JSON.stringify({ lib, htmlContent, config });
  
    // Check if the PDF exists in the cache
    const cachedPDF = pdfCache.get(cacheKey);
  
    if (cachedPDF) {
      console.log('Using cached PDF.');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
      res.send(cachedPDF);
    } else {
      // Generate the PDF
      let pdfBuffer;
  
      if (lib === 'puppeteer') {
        pdfBuffer = await generatePDFWithPuppeteer(htmlContent, config);
      } else if (lib === 'jspdf') {
        pdfBuffer = generatePDFWithJsPDF(htmlContent, config);
      } else {
        return res.status(400).json({ error: 'Invalid PDF library specified' });
      }
  
      // Store the generated PDF in the cache
      pdfCache.set(cacheKey, pdfBuffer, 60); // Cache for 60 seconds (adjust the TTL as needed)
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=generated.pdf');
      res.send(pdfBuffer);
    }
  } catch (error) {
    console.error('PDF generation failed:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
  
}

async function generatePDFWithPuppeteer(htmlContent, config) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(htmlContent);

  const buffer = await page.pdf(config);

  await browser.close();

  return buffer;
}

function generatePDFWithJsPDF(htmlContent, config) {
  const doc = new jsPDF({
    orientation: config.orientation || 'portrait',
    unit: 'mm',
    format: config.pageSize || 'a4',
  });

  doc.fromHTML(htmlContent, config.margins[0], config.margins[1]);
  if (config.includePageNumber) {
    for (let i = 1; i <= doc.getNumberOfPages(); i++) {
      doc.setPage(i);
      doc.text(10, 10, `Page ${i}`);
    }
  }

  return doc.output();
}

module.exports = {
  generatePDF,
};
