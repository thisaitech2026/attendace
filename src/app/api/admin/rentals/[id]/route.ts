import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();
    const data = { ...body };
    if (body.rentStartDate) data.rentStartDate = new Date(body.rentStartDate);

    const rental = await prisma.rentalMapping.update({
      where: { id: params.id },
      data,
      include: { customer: true, property: true },
    });
    return NextResponse.json(rental);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    const rental = await prisma.rentalMapping.findUnique({ where: { id: params.id } });
    if (!rental) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await prisma.$transaction(async (tx) => {
      await tx.rentalMapping.update({
        where: { id: params.id },
        data: { status: "TERMINATED" },
      });
      const activeCount = await tx.rentalMapping.count({
        where: { propertyId: rental.propertyId, status: "ACTIVE" },
      });
      if (activeCount === 0) {
        await tx.property.update({
          where: { id: rental.propertyId },
          data: { status: "VACANT" },
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
