const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.post('/topup', async (req, res) => {
  const { user_id, zone_id, product_code, transaction_id } = req.body;
  
  if (!user_id || !zone_id || !product_code || !transaction_id) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  setTimeout(async () => {
    try {
      const isSuccess = Math.random() > 0.1;
      const finalStatus = isSuccess ? 'SUCCESS' : 'FAILED';
      
      await prisma.transaction.update({
        where: { id: transaction_id },
        data: { status: finalStatus }
      });
      
      console.log(`[Supplier Mock] Topup ${finalStatus} for txn ${transaction_id}`);
    } catch (e) {
      console.error('[Supplier Mock] DB Update failed', e);
    }
  }, 3000);

  res.json({ status: 'processing', message: 'Topup request received by supplier' });
});

module.exports = router;
