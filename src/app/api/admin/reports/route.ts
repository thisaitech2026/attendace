import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllOverdueAccounts } from "@/lib/due";

export async function GET(request: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "property";

    switch (type) {
      case "property": {
        const properties = await prisma.property.findMany({
          include: {
            utility: true,
            rentals: { where: { status: "ACTIVE" }, include: { customer: true } },
          },
        });
        return NextResponse.json(properties);
      }
      case "occupancy": {
        const occupied = await prisma.property.count({ where: { status: "OCCUPIED" } });
        const vacant = await prisma.property.count({ where: { status: "VACANT" } });
        const byType = await prisma.property.groupBy({
          by: ["type", "status"],
          _count: true,
        });
        return NextResponse.json({ occupied, vacant, byType });
      }
      case "customer": {
        const customers = await prisma.customer.findMany({
          include: {
            rentals: { include: { property: true } },
            user: { select: { username: true } },
          },
        });
        return NextResponse.json(customers);
      }
      case "daily": {
        const date = searchParams.get("date") || new Date().toISOString().split("T")[0];
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        const payments = await prisma.payment.findMany({
          where: { paymentDate: { gte: start, lt: end }, status: "SUCCESS" },
          include: { rental: { include: { customer: true, property: true } } },
        });
        const total = payments.reduce((s, p) => s + p.totalPaid, 0);
        return NextResponse.json({ payments, total, date });
      }
      case "monthly": {
        const month = searchParams.get("month") || new Date().toISOString().slice(0, 7);
        const [year, mon] = month.split("-").map(Number);
        const start = new Date(year, mon - 1, 1);
        const end = new Date(year, mon, 1);
        const payments = await prisma.payment.findMany({
          where: { paymentDate: { gte: start, lt: end }, status: "SUCCESS" },
          include: { rental: { include: { customer: true, property: true } } },
        });
        const total = payments.reduce((s, p) => s + p.totalPaid, 0);
        const fineTotal = payments.reduce((s, p) => s + p.fineAmount, 0);
        return NextResponse.json({ payments, total, fineTotal, month });
      }
      case "due": {
        const overdue = await getAllOverdueAccounts();
        return NextResponse.json(overdue);
      }
      case "fine": {
        const payments = await prisma.payment.findMany({
          where: { fineAmount: { gt: 0 }, status: "SUCCESS" },
          include: { rental: { include: { customer: true, property: true } } },
          orderBy: { paymentDate: "desc" },
        });
        const total = payments.reduce((s, p) => s + p.fineAmount, 0);
        return NextResponse.json({ payments, total });
      }
      case "outstanding": {
        const activeRentals = await prisma.rentalMapping.findMany({
          where: { status: "ACTIVE" },
          include: { customer: true, property: true },
        });
        const { getRentalOutstanding } = await import("@/lib/due");
        const outstanding = [];
        for (const rental of activeRentals) {
          const data = await getRentalOutstanding(rental.id);
          if (data && data.totalPayable > 0) outstanding.push(data);
        }
        const grandTotal = outstanding.reduce((s, o) => s + o.totalPayable, 0);
        return NextResponse.json({ outstanding, grandTotal });
      }
      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
