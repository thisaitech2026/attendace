import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateTransactionId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TXN${timestamp}${random}`;
}

export function propertyTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    HOUSE: "House",
    APARTMENT: "Apartment",
    VILLA: "Villa",
    SHOP: "Shop",
    COMMERCIAL_UNIT: "Commercial Unit",
  };
  return labels[type] || type;
}

export function paymentMethodLabel(method: string): string {
  const labels: Record<string, string> = {
    UPI: "UPI",
    GOOGLE_PAY: "Google Pay",
    PHONEPE: "PhonePe",
    PAYTM: "Paytm",
    DEBIT_CARD: "Debit Card",
    CREDIT_CARD: "Credit Card",
    NET_BANKING: "Net Banking",
  };
  return labels[method] || method;
}
