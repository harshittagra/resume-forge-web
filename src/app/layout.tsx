import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ResumeForge — Free ATS Resume Tailor & Optimizer",
  description:
    "Tailor your resume for any job description in seconds using AI. Zero fabrication guarantee, ATS match scoring, weekend project builder, and Word/PDF exports.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased bg-[#050510] text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
