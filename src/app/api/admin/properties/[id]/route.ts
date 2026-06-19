import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: { utility: true, rentals: { include: { customer: true } } },
    });
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(property);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();
    const { utility, ...propertyData } = body;

    const property = await prisma.property.update({
      where: { id: params.id },
      data: propertyData,
      include: { utility: true },
    });

    if (utility) {
      await prisma.utility.upsert({
        where: { propertyId: params.id },
        create: { propertyId: params.id, ...utility },
        update: utility,
      });
    }

    return NextResponse.json(property);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    await prisma.property.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
