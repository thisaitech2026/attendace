import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    await requireAuth("ADMIN");
    const properties = await prisma.property.findMany({
      include: { utility: true, rentals: { where: { status: "ACTIVE" }, include: { customer: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(properties);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();
    const { utility, ...propertyData } = body;

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        utility: utility
          ? {
              create: {
                ebServiceNumber: utility.ebServiceNumber || null,
                ebConsumerName: utility.ebConsumerName || null,
                waterConnectionNumber: utility.waterConnectionNumber || null,
                waterConsumerName: utility.waterConsumerName || null,
              },
            }
          : undefined,
      },
      include: { utility: true },
    });
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
