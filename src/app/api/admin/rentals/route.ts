import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAuth("ADMIN");
    const rentals = await prisma.rentalMapping.findMany({
      include: { customer: true, property: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(rentals);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();

    const rental = await prisma.$transaction(async (tx) => {
      const created = await tx.rentalMapping.create({
        data: {
          ...body,
          rentStartDate: new Date(body.rentStartDate),
        },
        include: { customer: true, property: true },
      });
      await tx.property.update({
        where: { id: body.propertyId },
        data: { status: "OCCUPIED" },
      });
      return created;
    });

    return NextResponse.json(rental, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
