const express = require('express');
const app = express();
const port = 3000;

// Middlewares
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/errorMiddleware');
const requestLogger = require('./middleware/requestLogger');

app.use(bodyParser.json()); // Parse request body as JSON
app.use(requestLogger);

// Routes
const pdfRoutes = require('./routes/pdfRoutes');
app.use('/generate-pdf', pdfRoutes);

// Error handling middleware
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
