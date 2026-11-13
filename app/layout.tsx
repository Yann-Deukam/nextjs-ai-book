import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import NavBar from "@/components/NavBar";

const satoshi = localFont({
  src: [
    {
      path: "./fonts/Satoshi-Variable.woff2",
      style: "normal",
      weight: "300 900",
    },
    {
      path: "./fonts/Satoshi-VariableItalic.woff2",
      style: "italic",
      weight: "300 900",
    },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bookidy",
  description: "Talk to your books",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${satoshi.variable} relative font-sans antialiased`}>
        <ClerkProvider>
          <NavBar />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}