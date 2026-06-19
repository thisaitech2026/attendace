import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#1565C0",
};

export const metadata: Metadata = {
  title: "Rental Manager",
  description: "House & Shop Rental Management",
  formatDetection: { telephone: false },
  icons: { icon: "/icons/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${roboto.className} bg-gray-200 antialiased`}>{children}</body>
    </html>
  );
}
