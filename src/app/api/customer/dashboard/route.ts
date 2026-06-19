import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getRentalOutstanding } from "@/lib/due";
import { generateTransactionId } from "@/lib/utils";

export async function GET() {
  try {
    const user = await requireAuth("CUSTOMER");
    if (!user.customerId) {
      return NextResponse.json({ error: "No customer profile" }, { status: 404 });
    }

    const customer = await prisma.customer.findUnique({
      where: { id: user.customerId },
      include: {
        rentals: {
          where: { status: "ACTIVE" },
          include: { property: { include: { utility: true } } },
        },
      },
    });

    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const rental = customer.rentals[0];
    if (!rental) {
      return NextResponse.json({ customer, rental: null, outstanding: null });
    }

    const outstanding = await getRentalOutstanding(rental.id);
    return NextResponse.json({ customer, rental, outstanding });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth("CUSTOMER");
    if (!user.customerId) {
      return NextResponse.json({ error: "No customer profile" }, { status: 404 });
    }

    const { rentalId, rentMonth, paymentMethod } = await request.json();
    const outstanding = await getRentalOutstanding(rentalId);
    if (!outstanding) {
      return NextResponse.json({ error: "Rental not found" }, { status: 404 });
    }

    const monthDue = outstanding.unpaidMonths.find((m) => m.rentMonth === rentMonth);
    if (!monthDue) {
      return NextResponse.json({ error: "Month already paid or invalid" }, { status: 400 });
    }

    const transactionId = generateTransactionId();

    const payment = await prisma.payment.create({
      data: {
        rentalId,
        transactionId,
        rentMonth,
        rentAmount: monthDue.rentAmount,
        fineAmount: monthDue.fineAmount,
        totalPaid: monthDue.totalPayable,
        status: "SUCCESS",
        paymentMethod,
      },
      include: {
        rental: { include: { customer: true, property: true } },
      },
    });

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
