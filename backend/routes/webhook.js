const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axios = require('axios');

router.post('/payment', async (req, res) => {
  try {
    const { transactionId, status } = req.body;
    
    if (status !== 'PAID') {
      return res.json({ success: true, message: 'Ignored' });
    }

    const transaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'PAID' },
      include: { product: true }
    });

    const supplierUrl = `${req.protocol}://${req.get('host')}/api/supplier/topup`;
    
    axios.post(supplierUrl, {
      user_id: transaction.userIdPubg,
      zone_id: transaction.zoneIdPubg,
      product_code: transaction.product.productCode,
      transaction_id: transaction.id
    }).catch(err => console.error("Supplier API call failed", err.message));

    res.json({ success: true, message: 'Webhook processed' });
  } catch (error) {
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

module.exports = router;
