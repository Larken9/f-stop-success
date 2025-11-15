import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import StructuredData from "./components/StructuredData";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "F-STOP to Success | PhotoTherapy Training for Mental Health Professionals",
    template: "%s | F-STOP to Success"
  },
  description: "Transform your mental health practice with professional PhotoTherapy training. Learn proven techniques to help more clients, increase income, and reduce burnout. 12-week online course for therapists and counselors.",
  keywords: [
    "phototherapy training",
    "visual therapy",
    "mental health professional development",
    "therapy techniques",
    "therapist training",
    "photography in therapy",
    "art therapy",
    "counseling techniques",
    "therapeutic photography",
    "mental health practice growth"
  ],
  authors: [{ name: "Kelly Gauthier" }],
  creator: "Kelly Gauthier",
  publisher: "F-STOP to Success",
  metadataBase: new URL("https://fstoptosuccess.com"),
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fstoptosuccess.com",
    siteName: "F-STOP to Success",
    title: "PhotoTherapy Training for Mental Health Professionals",
    description: "Transform your mental health practice with professional PhotoTherapy training. Learn proven techniques to increase client success and income.",
    images: [
      {
        url: "/images/home-hero-new.avif",
        width: 1200,
        height: 630,
        alt: "F-STOP to Success PhotoTherapy Training"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "PhotoTherapy Training for Mental Health Professionals",
    description: "Transform your practice with proven PhotoTherapy techniques. 12-week training program for therapists.",
    images: ["/images/home-hero-new.avif"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  },
  verification: {
    google: "your-google-verification-code",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <StructuredData />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} ${cormorantGaramond.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
