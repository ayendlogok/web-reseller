const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/create', async (req, res) => {
  try {
    const { userIdPubg, zoneIdPubg, productId } = req.body;
    
    if (!userIdPubg || !zoneIdPubg || !productId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const transaction = await prisma.transaction.create({
      data: {
        userIdPubg,
        zoneIdPubg,
        productId: product.id,
        price: product.totalPrice,
        status: 'PENDING'
      }
    });

    const qrisUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=MOCK_QRIS_${transaction.id}`;

    res.json({
      success: true,
      transactionId: transaction.id,
      qrisUrl,
      totalPrice: product.totalPrice
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const transaction = await prisma.transaction.findUnique({
      where: { id: req.params.id },
      include: { product: true }
    });
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;
