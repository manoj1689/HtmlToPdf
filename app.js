const express = require('express');
const app = express();
const port = 3001;
const { signToken, verifyToken } = require('./middleware/jwtMiddleware');
const jwtMiddleware = require('./middleware/jwtMiddleware');

// Middlewares
const bodyParser = require('body-parser');
const errorMiddleware = require('./middleware/errorMiddleware');
const requestLogger = require('./middleware/requestLogger');

app.use(bodyParser.json()); // Parse request body as JSON
app.use(requestLogger);

// Routes
const pdfRoutes = require('./routes/pdfRoutes');
app.use('/generate-pdf', pdfRoutes);

app.post('/login', (req, res) => {
  // Assuming the user sends a token in the request body
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  // Verify the token
  const user = jwtMiddleware.verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Example: Return a success response
  res.status(200).json({ message: 'Login successful', user });
});

// Error handling middleware
app.use(errorMiddleware);

const token = signToken({ userId: 123 });
console.log(token);

// Verify a token
const verifiedPayload = verifyToken(token);

if (verifiedPayload) {
  console.log('Token is valid');
  console.log(verifiedPayload);
} else {
  console.log('Token is invalid');
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
