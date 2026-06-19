import { jsPDF } from "jspdf";

interface ReceiptData {
  transactionId: string;
  paymentDate: string;
  customerName: string;
  propertyName: string;
  propertyAddress: string;
  rentMonth: string;
  rentAmount: number;
  fineAmount: number;
  totalPaid: number;
  paymentMethod: string;
  status: string;
}

export function generateReceiptPDF(data: ReceiptData): Buffer {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(30, 64, 175);
  doc.rect(0, 0, pageWidth, 40, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.text("Payment Receipt", pageWidth / 2, 18, { align: "center" });
  doc.setFontSize(10);
  doc.text("Rental House & Shop Management System", pageWidth / 2, 28, { align: "center" });

  doc.setTextColor(0, 0, 0);
  let y = 55;

  const addRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(11);
    doc.text(label, 20, y);
    doc.text(value, pageWidth - 20, y, { align: "right" });
    y += 10;
  };

  doc.setDrawColor(200, 200, 200);
  doc.line(20, 48, pageWidth - 20, 48);

  addRow("Transaction ID:", data.transactionId, true);
  addRow("Payment Date:", data.paymentDate);
  addRow("Status:", data.status);
  y += 5;
  doc.line(20, y - 3, pageWidth - 20, y - 3);
  y += 5;

  addRow("Customer:", data.customerName);
  addRow("Property:", data.propertyName);
  addRow("Address:", data.propertyAddress);
  y += 5;
  doc.line(20, y - 3, pageWidth - 20, y - 3);
  y += 5;

  addRow("Rent Month:", data.rentMonth);
  addRow("Rent Amount:", `Rs. ${data.rentAmount.toLocaleString("en-IN")}`);
  addRow("Fine Amount:", `Rs. ${data.fineAmount.toLocaleString("en-IN")}`);
  y += 3;
  doc.setDrawColor(30, 64, 175);
  doc.line(20, y, pageWidth - 20, y);
  y += 10;
  addRow("Total Paid:", `Rs. ${data.totalPaid.toLocaleString("en-IN")}`, true);
  addRow("Payment Method:", data.paymentMethod);

  y += 20;
  doc.setFontSize(9);
  doc.setTextColor(128, 128, 128);
  doc.text("This is a computer-generated receipt. No signature required.", pageWidth / 2, y, { align: "center" });
  doc.text(`Generated on ${new Date().toLocaleString("en-IN")}`, pageWidth / 2, y + 8, { align: "center" });

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
