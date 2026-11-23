import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = "https://pizzahub-azure.vercel.app";
const siteTitle = "PizzaHub | Freshly Baked, Delivered Hot";
const siteDescription =
  "Discover delicious pizzas, explore restaurant menus and order your favourites from partner restaurants with PizzaHub.";
const socialImage = `${siteUrl}/assets/hero.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    url: `${siteUrl}/`,
    siteName: "PizzaHub",
    images: [
      {
        url: socialImage,
        width: 1600,
        height: 900,
        alt: "PizzaHub — freshly baked pizza, delivered hot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [socialImage],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        
        {/* shadcn/ui toast provider — sign in / sign up / logout notifications */}
        <Toaster>{children}</Toaster>
      </body>
    </html>
  );
}
