import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "L2W Knowledge Hub",
  description: "Internal wiki for SALC staff",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fonts/geist.css" />
      </head>
      <body>{children}</body>
    </html>
  );
}
