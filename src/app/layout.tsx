import type { Metadata, Viewport } from "next";
import { Instrument_Sans } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const instrumentSans = Instrument_Sans({
  variable: "--font-instrument-sans",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Three Sigma Coaching",
  description:
    "A five-week, hands-on class where gifted teens learn to build real websites, apps, and games with AI.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${instrumentSans.variable} antialiased`}>
      <body className="min-h-dvh font-sans">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
