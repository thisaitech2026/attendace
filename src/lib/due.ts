import {
  differenceInDays,
  startOfMonth,
  addMonths,
  format,
  isBefore,
  isAfter,
  setDate,
} from "date-fns";
import { prisma } from "./db";
import type { RentalMapping } from "@/generated/prisma/client";

export interface DueCalculation {
  rentMonth: string;
  rentAmount: number;
  dueDate: Date;
  graceEndDate: Date;
  lateDays: number;
  fineAmount: number;
  totalPayable: number;
  isOverdue: boolean;
}

export function getDueDateForMonth(rental: RentalMapping, month: Date): Date {
  const dueDay = Math.min(rental.dueDate, 28);
  return setDate(startOfMonth(month), dueDay);
}

export function calculateDueForMonth(
  rental: RentalMapping,
  month: Date,
  referenceDate: Date = new Date()
): DueCalculation {
  const rentMonth = format(month, "yyyy-MM");
  const dueDate = getDueDateForMonth(rental, month);
  const actualGraceEnd = new Date(dueDate);
  actualGraceEnd.setDate(actualGraceEnd.getDate() + rental.gracePeriod);

  let lateDays = 0;
  if (isAfter(referenceDate, actualGraceEnd)) {
    lateDays = differenceInDays(referenceDate, actualGraceEnd);
  }

  const fineAmount = lateDays * rental.finePerDay;
  const totalPayable = rental.monthlyRent + fineAmount;
  const isOverdue = isAfter(referenceDate, dueDate);

  return {
    rentMonth,
    rentAmount: rental.monthlyRent,
    dueDate,
    graceEndDate: actualGraceEnd,
    lateDays,
    fineAmount,
    totalPayable,
    isOverdue,
  };
}

export async function getUnpaidMonths(rental: RentalMapping): Promise<DueCalculation[]> {
  const now = new Date();
  const paidMonths = await prisma.payment.findMany({
    where: { rentalId: rental.id, status: "SUCCESS" },
    select: { rentMonth: true },
  });
  const paidSet = new Set(paidMonths.map((p) => p.rentMonth));

  const unpaid: DueCalculation[] = [];
  let current = startOfMonth(rental.rentStartDate);

  while (isBefore(current, addMonths(startOfMonth(now), 1))) {
    const calc = calculateDueForMonth(rental, current, now);
    if (!paidSet.has(calc.rentMonth)) {
      unpaid.push(calc);
    }
    current = addMonths(current, 1);
  }

  return unpaid;
}

export async function getRentalOutstanding(rentalId: string) {
  const rental = await prisma.rentalMapping.findUnique({
    where: { id: rentalId },
    include: { customer: true, property: true },
  });
  if (!rental) return null;

  const unpaidMonths = await getUnpaidMonths(rental);
  const totalRent = unpaidMonths.reduce((sum, m) => sum + m.rentAmount, 0);
  const totalFine = unpaidMonths.reduce((sum, m) => sum + m.fineAmount, 0);
  const totalPayable = totalRent + totalFine;

  return {
    rental,
    unpaidMonths,
    totalRent,
    totalFine,
    totalPayable,
  };
}

export async function getAllOverdueAccounts() {
  const activeRentals = await prisma.rentalMapping.findMany({
    where: { status: "ACTIVE" },
    include: { customer: true, property: true },
  });

  const overdue = [];
  for (const rental of activeRentals) {
    const outstanding = await getRentalOutstanding(rental.id);
    if (outstanding && outstanding.totalPayable > 0) {
      const hasOverdue = outstanding.unpaidMonths.some((m) => m.isOverdue);
      if (hasOverdue) {
        overdue.push(outstanding);
      }
    }
  }
  return overdue;
}
