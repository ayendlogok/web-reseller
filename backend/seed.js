const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: '60 UC', productCode: 'PUBG_60', basePrice: 14000, markup: 1000, totalPrice: 15000 },
    { name: '325 UC', productCode: 'PUBG_325', basePrice: 70000, markup: 5000, totalPrice: 75000 },
    { name: '660 UC', productCode: 'PUBG_660', basePrice: 140000, markup: 10000, totalPrice: 150000 },
    { name: '1800 UC', productCode: 'PUBG_1800', basePrice: 380000, markup: 20000, totalPrice: 400000 },
    { name: '3850 UC', productCode: 'PUBG_3850', basePrice: 800000, markup: 50000, totalPrice: 850000 },
    { name: '8100 UC', productCode: 'PUBG_8100', basePrice: 1600000, markup: 100000, totalPrice: 1700000 },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { productCode: p.productCode },
      update: {},
      create: p,
    });
  }
  console.log('Database seeded with products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
