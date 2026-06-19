import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#080b12",
};

export const metadata: Metadata = {
  title: "Rental Manager",
  description: "Premium House & Shop Rental Management",
  formatDetection: { telephone: false },
  icons: { icon: "/icons/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${jakarta.className} bg-[#05070a] antialiased`}>{children}</body>
    </html>
  );
}
