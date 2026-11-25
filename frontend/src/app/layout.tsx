import type { Metadata } from "next";
import { Lora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bandora — IELTS Learning Dashboard",
  description:
    "Train your English skills, build daily study habits, and feel ready for IELTS.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${jakarta.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full bg-cream text-ink font-sans flex flex-col">
        {children}
      </body>
    </html>
  );
}
