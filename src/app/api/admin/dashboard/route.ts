import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getAllOverdueAccounts } from "@/lib/due";

export async function GET() {
  try {
    await requireAuth("ADMIN");

    const [
      totalProperties,
      totalHouses,
      totalShops,
      occupiedProperties,
      vacantProperties,
      recentPayments,
      overdueAccounts,
      monthlyPayments,
      finePayments,
      duePayments,
    ] = await Promise.all([
      prisma.property.count(),
      prisma.property.count({ where: { type: { in: ["HOUSE", "APARTMENT", "VILLA"] } } }),
      prisma.property.count({ where: { type: { in: ["SHOP", "COMMERCIAL_UNIT"] } } }),
      prisma.property.count({ where: { status: "OCCUPIED" } }),
      prisma.property.count({ where: { status: "VACANT" } }),
      prisma.payment.findMany({
        take: 10,
        orderBy: { paymentDate: "desc" },
        include: {
          rental: { include: { customer: true, property: true } },
        },
      }),
      getAllOverdueAccounts(),
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { totalPaid: true },
      }),
      prisma.payment.aggregate({
        where: {
          status: "SUCCESS",
          paymentDate: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
        _sum: { fineAmount: true },
      }),
      getAllOverdueAccounts().then((accounts) =>
        accounts.reduce((sum, a) => sum + a.totalPayable, 0)
      ),
    ]);

    return NextResponse.json({
      totalProperties,
      totalHouses,
      totalShops,
      occupiedProperties,
      vacantProperties,
      monthlyCollections: monthlyPayments._sum.totalPaid || 0,
      fineCollections: finePayments._sum.fineAmount || 0,
      dueAmounts: duePayments,
      recentPayments,
      overdueAccounts,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 403 });
  }
}
