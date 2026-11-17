import type { Metadata } from "next";
import { Inter, Marcellus, Noto_Sans_Sinhala, Noto_Serif_Sinhala } from "next/font/google";
import { TiltEffect } from "@/components/tilt-effect";
import "./globals.css";

const body = Inter({ variable: "--font-body", subsets: ["latin"] });
const display = Marcellus({ variable: "--font-display-en", subsets: ["latin"], weight: "400" });
const sinhala = Noto_Sans_Sinhala({ variable: "--font-sinhala", subsets: ["sinhala"] });
const sinhalaSerif = Noto_Serif_Sinhala({ variable: "--font-sinhala-serif", subsets: ["sinhala"] });

export const metadata: Metadata = {
  title: {
    default: "Sri Punyabhiwardhanaramaya, Kottawa | ශ්‍රී පුණ්‍යාභිවර්ධනාරාමය",
    template: "%s | Sri Punyabhiwardhanaramaya, Kottawa",
  },
  description:
    "Sri Punyabhiwardhanaramaya, Kottawa - temple activities, dana, pirith, bodhi puja, Siri Saddharmodaya Dhamma School and Udaya Lama Uyana Pre School.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="si"
      className={`${body.variable} ${display.variable} ${sinhala.variable} ${sinhalaSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <TiltEffect />
      </body>
    </html>
  );
}
