import { NextRequest, NextResponse } from "next/server";
import { requireAuth, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    const body = await request.json();
    const { username, password, ...customerData } = body;

    const customer = await prisma.customer.update({
      where: { id: params.id },
      data: customerData,
    });

    if (username || password) {
      const userUpdate: Record<string, string> = {};
      if (username) userUpdate.username = username;
      if (password) userUpdate.password = await hashPassword(password);
      await prisma.user.updateMany({
        where: { customerId: params.id },
        data: userUpdate,
      });
    }

    return NextResponse.json(customer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireAuth("ADMIN");
    await prisma.user.deleteMany({ where: { customerId: params.id } });
    await prisma.customer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
