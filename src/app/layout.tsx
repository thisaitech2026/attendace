import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rental House & Shop Management",
  description: "Manage rental houses and shops with admin and customer panels",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
