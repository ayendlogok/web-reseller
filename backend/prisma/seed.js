const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: 'password123',
    },
  });

  const products = [
    { name: '60 UC', productCode: 'PUBG60', basePrice: 14000, markup: 2000 },
    { name: '120 UC', productCode: 'PUBG120', basePrice: 28000, markup: 3000 },
    { name: '325 UC', productCode: 'PUBG325', basePrice: 70000, markup: 5000 },
    { name: '660 UC', productCode: 'PUBG660', basePrice: 140000, markup: 10000 },
    { name: 'Royale Pass', productCode: 'PUBGRP', basePrice: 150000, markup: 15000 },
    { name: 'Elite Pass Plus', productCode: 'PUBGELITE', basePrice: 380000, markup: 20000 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { productCode: p.productCode },
      update: {},
      create: {
        ...p,
        totalPrice: p.basePrice + p.markup,
      },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
