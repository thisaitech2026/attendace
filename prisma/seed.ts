import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL?.startsWith("file:")
    ? process.env.DATABASE_URL
    : `file:${dbPath}`,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: adminPassword, role: "ADMIN" },
    create: {
      username: "admin",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  const customerPassword = await bcrypt.hash("customer123", 12);

  const customer1 = await prisma.customer.upsert({
    where: { id: "seed-customer-1" },
    update: {
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh@email.com",
    },
    create: {
      id: "seed-customer-1",
      name: "Rajesh Kumar",
      mobile: "9876543210",
      email: "rajesh@email.com",
      address: "12 MG Road, Bangalore",
      aadhaar: "1234-5678-9012",
      occupation: "Software Engineer",
      emergencyContact: "9876543211",
      user: {
        create: {
          username: "rajesh",
          password: customerPassword,
          role: "CUSTOMER",
        },
      },
    },
  });

  const customer2 = await prisma.customer.upsert({
    where: { id: "seed-customer-2" },
    update: {},
    create: {
      id: "seed-customer-2",
      name: "Priya Sharma",
      mobile: "9876543220",
      email: "priya@email.com",
      address: "45 Park Street, Mumbai",
      aadhaar: "2345-6789-0123",
      occupation: "Business Owner",
      emergencyContact: "9876543221",
      user: {
        create: {
          username: "priya",
          password: customerPassword,
          role: "CUSTOMER",
        },
      },
    },
  });

  await prisma.user.updateMany({
    where: { username: { in: ["rajesh", "priya"] } },
    data: { password: customerPassword },
  });

  const properties = [
    {
      propertyId: "PROP-001",
      name: "Sunrise Villa",
      address: "101 Green Valley, Bangalore",
      description: "3BHK villa with garden",
      monthlyRent: 25000,
      securityDeposit: 50000,
      type: "VILLA" as const,
      status: "OCCUPIED" as const,
      utility: {
        ebServiceNumber: "EB-12345678",
        ebConsumerName: "Rajesh Kumar",
        waterConnectionNumber: "WC-87654321",
        waterConsumerName: "Rajesh Kumar",
      },
    },
    {
      propertyId: "PROP-002",
      name: "Lake View Apartment",
      address: "202 Lake Road, Bangalore",
      description: "2BHK apartment with lake view",
      monthlyRent: 18000,
      securityDeposit: 36000,
      type: "APARTMENT" as const,
      status: "VACANT" as const,
      utility: {
        ebServiceNumber: "EB-23456789",
        ebConsumerName: "Lake View Society",
        waterConnectionNumber: "WC-76543210",
        waterConsumerName: "Lake View Society",
      },
    },
    {
      propertyId: "PROP-003",
      name: "Corner Shop",
      address: "Shop 5, Main Market, Bangalore",
      description: "Ground floor commercial shop",
      monthlyRent: 15000,
      securityDeposit: 30000,
      type: "SHOP" as const,
      status: "OCCUPIED" as const,
      utility: {
        ebServiceNumber: "EB-34567890",
        ebConsumerName: "Priya Sharma",
        waterConnectionNumber: "WC-65432109",
        waterConsumerName: "Priya Sharma",
      },
    },
    {
      propertyId: "PROP-004",
      name: "Green House",
      address: "303 Garden Lane, Bangalore",
      description: "Independent house with parking",
      monthlyRent: 20000,
      securityDeposit: 40000,
      type: "HOUSE" as const,
      status: "VACANT" as const,
      utility: {
        ebServiceNumber: "EB-45678901",
        ebConsumerName: "Green House",
        waterConnectionNumber: "WC-54321098",
        waterConsumerName: "Green House",
      },
    },
    {
      propertyId: "PROP-005",
      name: "Tech Park Unit",
      address: "Unit 12, IT Park, Bangalore",
      description: "Commercial office unit",
      monthlyRent: 35000,
      securityDeposit: 70000,
      type: "COMMERCIAL_UNIT" as const,
      status: "VACANT" as const,
    },
  ];

  const createdProperties = [];
  for (const prop of properties) {
    const { utility, ...propData } = prop;
    const created = await prisma.property.upsert({
      where: { propertyId: prop.propertyId },
      update: {},
      create: {
        ...propData,
        utility: utility ? { create: utility } : undefined,
      },
    });
    createdProperties.push(created);
  }

  const rental1 = await prisma.rentalMapping.upsert({
    where: { id: "seed-rental-1" },
    update: {},
    create: {
      id: "seed-rental-1",
      customerId: customer1.id,
      propertyId: createdProperties[0].id,
      rentStartDate: new Date("2025-10-01"),
      monthlyRent: 25000,
      dueDate: 5,
      gracePeriod: 5,
      finePerDay: 100,
      depositAmount: 50000,
      status: "ACTIVE",
    },
  });

  const rental2 = await prisma.rentalMapping.upsert({
    where: { id: "seed-rental-2" },
    update: {},
    create: {
      id: "seed-rental-2",
      customerId: customer2.id,
      propertyId: createdProperties[2].id,
      rentStartDate: new Date("2025-11-01"),
      monthlyRent: 15000,
      dueDate: 10,
      gracePeriod: 3,
      finePerDay: 50,
      depositAmount: 30000,
      status: "ACTIVE",
    },
  });

  await prisma.payment.upsert({
    where: { transactionId: "TXNSEED001" },
    update: {},
    create: {
      rentalId: rental1.id,
      transactionId: "TXNSEED001",
      paymentDate: new Date("2025-10-08"),
      rentMonth: "2025-10",
      rentAmount: 25000,
      fineAmount: 0,
      totalPaid: 25000,
      status: "SUCCESS",
      paymentMethod: "UPI",
    },
  });

  console.log("Seed completed!");
  console.log("Admin: admin / admin123");
  console.log("Customer: rajesh / customer123");
  console.log("Customer: priya / customer123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
