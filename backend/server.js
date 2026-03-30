const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Define routes inline for now to avoid crashes before creating the actual files
const productRoutes = require('./routes/product');
const transactionRoutes = require('./routes/transaction');
const webhookRoutes = require('./routes/webhook');
const supplierRoutes = require('./routes/supplier');
const adminRoutes = require('./routes/admin');

app.use('/api/products', productRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/webhook', webhookRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.send('PUBG Top-Up API is running');
});

// For Vercel/similar serverless function support or just listen locally
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
