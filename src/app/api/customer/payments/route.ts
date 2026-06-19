import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const user = await requireAuth("CUSTOMER");
    if (!user.customerId) {
      return NextResponse.json({ error: "No customer profile" }, { status: 404 });
    }

    const payments = await prisma.payment.findMany({
      where: { rental: { customerId: user.customerId } },
      include: { rental: { include: { property: true } } },
      orderBy: { paymentDate: "desc" },
    });

    return NextResponse.json(payments);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
