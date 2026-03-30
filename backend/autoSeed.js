const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedOnStartup() {
  try {
    const admin = await prisma.user.upsert({
      where: { username: 'admin' },
      update: {},
      create: {
        username: 'admin',
        password: 'password123',
      },
    });

    const products = [
      { name: '60 UC', productCode: 'PUBG60', basePrice: 14000, markup: 2000, totalPrice: 16000 },
      { name: '120 UC', productCode: 'PUBG120', basePrice: 28000, markup: 3000, totalPrice: 31000 },
      { name: '325 UC', productCode: 'PUBG325', basePrice: 70000, markup: 5000, totalPrice: 75000 },
      { name: '660 UC', productCode: 'PUBG660', basePrice: 140000, markup: 10000, totalPrice: 150000 },
      { name: 'Royale Pass', productCode: 'PUBGRP', basePrice: 150000, markup: 15000, totalPrice: 165000 },
      { name: 'Elite Pass Plus', productCode: 'PUBGELITE', basePrice: 380000, markup: 20000, totalPrice: 400000 },
    ];

    for (const p of products) {
      await prisma.product.upsert({
        where: { productCode: p.productCode },
        update: {},
        create: {
          ...p,
          isActive: true
        },
      });
    }
    console.log('--- Initial Data Seeded Automatically ---');
  } catch (error) {
    console.error('--- Seed On Startup Failed ---', error.message);
  }
}

module.exports = { seedOnStartup };
