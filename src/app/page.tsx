import HomePage from "./components/HomePage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Transform your mental health practice with PhotoTherapy. Professional training program teaching proven visual therapy techniques to increase client success, boost income, and reduce therapist burnout.",
  openGraph: {
    title: "F-STOP to Success | PhotoTherapy Training for Therapists",
    description: "Professional PhotoTherapy training for mental health professionals. Learn techniques to help more clients and grow your practice.",
    type: "website",
    url: "https://fstoptosuccess.com"
  }
};

export default function Home() {
  return <HomePage />;
}
