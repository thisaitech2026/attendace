import { NextRequest, NextResponse } from "next/server";
import { requireAuth, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAuth("ADMIN");
    const customers = await prisma.customer.findMany({
      include: { user: { select: { username: true } }, rentals: { include: { property: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(customers);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();
    const { username, password, ...customerData } = body;

    const hashedPassword = await hashPassword(password);
    const customer = await prisma.customer.create({
      data: {
        ...customerData,
        user: {
          create: { username, password: hashedPassword, role: "CUSTOMER" },
        },
      },
      include: { user: { select: { username: true } } },
    });
    return NextResponse.json(customer, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
