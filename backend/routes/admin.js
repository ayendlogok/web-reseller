const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const checkAdmin = (req, res, next) => {
  const token = req.headers.authorization;
  if (token === 'Bearer mock-admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const admin = await prisma.user.findUnique({ where: { username } });
  
  if (admin && admin.password === password) {
    res.json({ token: 'mock-admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

router.use(checkAdmin);

router.get('/stats', async (req, res) => {
  try {
    const totalTransactions = await prisma.transaction.count();
    const successTransactions = await prisma.transaction.count({ where: { status: 'SUCCESS' } });
    
    const txns = await prisma.transaction.findMany({
      where: { status: 'SUCCESS' },
      include: { product: true }
    });
    
    const totalRevenue = txns.reduce((sum, tx) => sum + tx.product.totalPrice, 0);
    const totalProfit = txns.reduce((sum, tx) => sum + tx.product.markup, 0);

    res.json({ totalTransactions, successTransactions, totalRevenue, totalProfit });
  } catch (e) {
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

router.get('/transactions', async (req, res) => {
  try {
    const txns = await prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: { product: true },
      take: 50
    });
    res.json(txns);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

router.put('/products/:id', async (req, res) => {
  if (process.env.IS_DEMO === 'true') {
    return res.status(403).json({ error: 'Fungsi ubah harga dinonaktifkan pada versi Live Demo.' });
  }

  try {
    const { markup } = req.body;
    const product = await prisma.product.findUnique({ where: { id: parseInt(req.params.id) } });
    
    if (!product) return res.status(404).json({ error: 'Not found' });

    const updated = await prisma.product.update({
      where: { id: parseInt(req.params.id) },
      data: {
        markup: parseInt(markup),
        totalPrice: product.basePrice + parseInt(markup)
      }
    });

    res.json(updated);
  } catch (e) {
    res.status(500).json({ error: 'Failed' });
  }
});

module.exports = router;
