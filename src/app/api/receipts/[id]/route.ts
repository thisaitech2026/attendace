import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateReceiptPDF } from "@/lib/receipt";
import { formatDate, paymentMethodLabel } from "@/lib/utils";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth();
    const payment = await prisma.payment.findUnique({
      where: { id: params.id },
      include: {
        rental: { include: { customer: true, property: true } },
      },
    });

    if (!payment) return NextResponse.json({ error: "Not found" }, { status: 404 });

    if (user.role === "CUSTOMER" && payment.rental.customerId !== user.customerId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const pdf = generateReceiptPDF({
      transactionId: payment.transactionId,
      paymentDate: formatDate(payment.paymentDate),
      customerName: payment.rental.customer.name,
      propertyName: payment.rental.property.name,
      propertyAddress: payment.rental.property.address,
      rentMonth: payment.rentMonth,
      rentAmount: payment.rentAmount,
      fineAmount: payment.fineAmount,
      totalPaid: payment.totalPaid,
      paymentMethod: paymentMethodLabel(payment.paymentMethod),
      status: payment.status,
    });

    return new NextResponse(new Uint8Array(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="receipt-${payment.transactionId}.pdf"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
