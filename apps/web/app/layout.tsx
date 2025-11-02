import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Carefree Hub",
  description: "Carefree Hub is a platform for creating and sharing carefree life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
