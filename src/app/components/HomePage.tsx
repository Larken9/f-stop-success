"use client";
import { useState, useEffect } from "react";
import {
  Camera,
  LogIn,
  LogOut,
  BookOpen,
  Play,
  Users,
  Award,
  Heart,
  Star,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentImageSet, setCurrentImageSet] = useState(0);
  const [revealedImage1, setRevealedImage1] = useState(false);
  const [revealedImage2, setRevealedImage2] = useState(false);

  // Image sets data
  const imageSets = [
    {
      leftImage: null, // No image, just text
      rightImage: null, // No image, just text
      leftText: {
        title: "Struggling Client",
        quote: "What do you think and feel when you read this?",
        isTextOnly: true,
      },
      rightText: {
        title: "A Grateful client",
        quote: "What do you think and feel when you read this?",
        isTextOnly: true,
      },
    },
    {
      leftImage: "/images/thoughts.jpg",
      rightImage: "/images/thanksful.jpg",
      leftText: {
        isTextOnly: false,
      },
      rightText: {
        isTextOnly: false,
      },
    },
  ];

  const signInWithGoogle = async () => {
    try {
      const { auth, googleProvider } = await import("../lib/firebase");
      const { signInWithPopup } = await import("firebase/auth");

      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const signOut = async () => {
    try {
      const { auth } = await import("../lib/firebase");
      const { signOut: firebaseSignOut } = await import("firebase/auth");

      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageSet((prev) => (prev + 1) % imageSets.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageSets.length, currentImageSet]); // Reset timer when currentImageSet changes

  // Manual rotation function
  const manualRotate = () => {
    setCurrentImageSet((prev) => (prev + 1) % imageSets.length);
  };

  useEffect(() => {
    const setupAuthListener = async () => {
      const { auth } = await import("../lib/firebase");
      const { onAuthStateChanged } = await import("firebase/auth");

      const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return unsubscribe;
    };

    if (mounted) {
      setupAuthListener();
    }
  }, [mounted]);

  if (!mounted || loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(135deg, #FAFAFA 0%, #f5f5f5 50%, #e8e8e8 100%)",
      }}
    >
      {/* Navigation Bar */}
      <nav
        className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-sm z-50 transition-all duration-300"
        style={{ borderBottom: "1px solid rgba(128, 128, 128, 0.1)" }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center group">
              <div
                className="rounded-2xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105"
                style={{
                  background:
                    "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                }}
              >
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span
                className="text-2xl font-bold"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                F-STOP to Success
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="/"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Home
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>
              <a
                href="#about"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                About
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>
              <a
                href="/enroll"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Enroll
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>
              <a
                href="#instructor"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Instructor
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>
              <a
                href="#testimonials"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Success Stories
                <span
                  className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>

              {user ? (
                <div className="flex items-center gap-4">
                  <a
                    href="/dashboard"
                    className="text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <BookOpen className="h-4 w-4" />
                    My Dashboard
                  </a>
                  <button
                    onClick={signOut}
                    className="border-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 hover:bg-red-50"
                    style={{
                      borderColor: "#E5E7EB",
                      color: "#666666",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-700 hover:text-sky-600 transition-colors p-2 rounded-lg hover:bg-slate-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-200/50 bg-white/95 backdrop-blur-md">
              <div className="flex flex-col space-y-3">
                <a
                  href="/"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Home
                </a>
                <a
                  href="#about"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  About
                </a>
                <a
                  href="/enroll"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Enroll
                </a>
                <a
                  href="#instructor"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Instructor
                </a>
                <a
                  href="#testimonials"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Success Stories
                </a>

                {user ? (
                  <div className="flex flex-col space-y-3 pt-2">
                    <a
                      href="/dashboard"
                      className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-fit shadow-lg"
                    >
                      <BookOpen className="h-4 w-4" />
                      My Dashboard
                    </a>
                    <button
                      onClick={signOut}
                      className="border-2 border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-600 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-fit hover:bg-rose-50"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="bg-gradient-to-r from-sky-500 to-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 w-fit shadow-lg mt-2"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-28 pb-20 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-6">
              {/* Main Heading */}
              <h1
                className="text-3xl md:text-4xl lg:text-5xl font-light leading-tight animate-fade-in"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                <span className="block">Transform Your</span>
                <span className="block font-medium">
                  Mental Health Practice
                </span>
                <span className="block" style={{ color: "#4B5563" }}>
                  into a thriving success for both you and your clients
                </span>
              </h1>

              {/* Subtitle */}
              <div className="space-y-6">
                <p
                  className="text-xl md:text-2xl leading-relaxed"
                  style={{
                    color: "#666666",
                    fontFamily: "Inter, sans-serif",
                    fontWeight: "300",
                  }}
                >
                  Discover the power of{" "}
                  <span style={{ color: "#374151", fontWeight: "500" }}>
                    PhotoTherapy
                  </span>{" "}
                  – where photographs become healing tools!
                </p>
                <p
                  className="text-lg leading-relaxed max-w-lg"
                  style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
                >
                  Learn professional techniques proven to elevate your practice
                  increase your income, reduce burnout, and improve the outcome
                  and overall success of your clients.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/enroll"
                  className="text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <BookOpen className="h-5 w-5" />
                  {user ? "Continue Learning" : "Enroll Now"}
                </a>
                <button
                  className="border-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 bg-white/50 backdrop-blur-sm"
                  style={{
                    borderColor: "#6B7280",
                    color: "#1a1a1a",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  <Play className="h-5 w-5" />
                  Watch Preview
                </button>
              </div>

              {user && (
                <div className="animate-fade-in">
                  <div
                    className="inline-flex items-center gap-3 bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg"
                    style={{ border: "1px solid rgba(0, 48, 39, 0.2)" }}
                  >
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: "#9CA3AF" }}
                    ></div>
                    <p
                      style={{
                        color: "#666666",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Welcome back,{" "}
                      <span style={{ fontWeight: "600", color: "#374151" }}>
                        {user.displayName}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Visual Element */}
            <div className="relative">
              <div className="relative">
                {/* Main Image */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                  <Image
                    src="/images/home-hero-new.avif"
                    alt="Professional PhotoTherapy session showcasing healing through imagery"
                    width={600}
                    height={700}
                    className="object-cover w-full h-[500px] lg:h-[600px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Floating Elements */}
                <div
                  className="absolute -top-6 -left-6 w-24 h-24 rounded-2xl shadow-xl animate-float"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                  }}
                >
                  <div className="flex items-center justify-center h-full">
                    <Camera className="h-12 w-12 text-white" />
                  </div>
                </div>

                <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl p-6 shadow-xl">
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold"
                      style={{
                        color: "#1a1a1a",
                        fontFamily: "Cormorant Garamond, serif",
                      }}
                    >
                      200+
                    </div>
                    <div
                      className="text-sm"
                      style={{
                        color: "#666666",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Lives Transformed
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Photography Showcase Section */}
      <section className="py-32" style={{ backgroundColor: "#FAFAFA" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2
              className="text-5xl md:text-6xl font-light mb-8 animate-fade-in"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "#374151",
                lineHeight: "1.1",
              }}
            >
              The Power of Visual Retelling
            </h2>
            <div
              className="w-24 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#6B7280" }}
            ></div>
            <p
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: "#666666",
                fontFamily: "Inter, sans-serif",
                fontWeight: "300",
              }}
            >
              Every image tells a story and every photograph holds the power to
              heal, inspire, and transform that story.{" "}
              <span style={{ color: "#374151", fontWeight: "500" }}>
                Discover how visual therapy can revolutionize your practice.
              </span>
            </p>
          </div>

          <div className="text-center mb-12">
            <p
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
                fontWeight: "500",
              }}
            >
              What if your clients could see their thoughts for what they are...
              just thoughts.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 40px rgba(0, 48, 39, 0.1)" }}
            >
              <Image
                src="/images/thoughts.jpg"
                alt="Professional photography showcasing therapeutic visual techniques"
                width={400}
                height={500}
                className="object-cover w-full h-80 lg:h-96 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-6 left-6 text-white">
                  <p
                    className="font-medium text-lg mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Visual Connection
                  </p>
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Building bridges through imagery
                  </p>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 40px rgba(0, 48, 39, 0.1)" }}
            >
              <Image
                src="/images/thoughts2.jpg"
                alt="Therapeutic photography demonstrating emotional expression techniques"
                width={400}
                height={500}
                className="object-cover w-full h-80 lg:h-96 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-6 left-6 text-white">
                  <p
                    className="font-medium text-lg mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Emotional Expression
                  </p>
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Unlocking feelings through photos
                  </p>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 40px rgba(0, 48, 39, 0.1)" }}
            >
              <Image
                src="/images/thoughts3.jpg"
                alt="PhotoTherapy session showing client engagement with visual materials"
                width={400}
                height={500}
                className="object-cover w-full h-80 lg:h-96 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-6 left-6 text-white">
                  <p
                    className="font-medium text-lg mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Therapeutic Process
                  </p>
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Guided visual exploration
                  </p>
                </div>
              </div>
            </div>

            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 40px rgba(0, 48, 39, 0.1)" }}
            >
              <Image
                src="/images/thoughts4.jpg"
                alt="Success story showcasing transformation through PhotoTherapy techniques"
                width={400}
                height={500}
                className="object-cover w-full h-80 lg:h-96 group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <div className="absolute bottom-6 left-6 text-white">
                  <p
                    className="font-medium text-lg mb-1"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Transformation
                  </p>
                  <p
                    className="text-sm opacity-90"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Witnessing positive change
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12 mb-20">
            <p
              className="text-xl md:text-2xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: "#374151",
                fontFamily: "Inter, sans-serif",
                fontWeight: "500",
              }}
            >
              And not the cognitive distortions or manifestations of anxiety
              <br />
              we too often make them out to be.
            </p>
          </div>

          <div className="text-center">
            <div
              className="rounded-3xl p-12 max-w-[1600px] mx-auto"
              style={{
                backgroundColor: "#F7F5F3",
                border: "1px solid rgba(0, 48, 39, 0.1)",
              }}
            >
              <h3
                className="text-3xl font-light mb-6"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                Why Visual Therapy Works
              </h3>
              <p
                className="text-lg leading-relaxed mb-12"
                style={{
                  color: "#666666",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "300",
                }}
              >
                Images bypass the analytical mind and speak directly to our
                emotions. In PhotoTherapy, we harness this natural connection
                <br />
                to facilitate healing, self-discovery, and personal growth. It&apos;s not about taking perfect photos —
                <br />
                <span style={{ color: "#374151", fontWeight: "500" }}>
                  it&apos;s about uncovering perfect moments of clarity using photographs.
                </span>
              </p>

              {/* 4-Block Image Reveal Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Block 1: Struggling Client Text */}
                <div
                  className="rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square"
                  style={{
                    backgroundColor: "#374151",
                  }}
                >
                  <h3
                    className="text-xl md:text-2xl font-light mb-3"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      color: "white",
                    }}
                  >
                    &quot;A Client Struggling With Depression&quot;
                  </h3>
                  <p
                    className="text-base md:text-lg"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    What do you think and feel when you READ this?
                  </p>
                </div>

                {/* Block 2: Struggling Client Image */}
                <button
                  onClick={() => setRevealedImage1(!revealedImage1)}
                  className="rounded-2xl shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow aspect-square"
                >
                  {!revealedImage1 ? (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center hover:bg-opacity-90 transition-all p-4"
                      style={{ backgroundColor: "#374151" }}
                    >
                      <p
                        className="text-white text-base md:text-lg mb-4 text-center"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        What do you think and feel when you SEE this image?
                      </p>
                      <span
                        className="text-white text-lg md:text-xl font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Click to Reveal
                      </span>
                    </div>
                  ) : (
                    <Image
                      src="/images/struggling-client.jpg"
                      alt="A client struggling with depression"
                      fill
                      className="object-cover"
                    />
                  )}
                </button>

                {/* Block 3: Successful Session Text */}
                <div
                  className="rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center aspect-square"
                  style={{
                    backgroundColor: "#374151",
                  }}
                >
                  <h3
                    className="text-xl md:text-2xl font-light mb-3"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      color: "white",
                    }}
                  >
                    &quot;A Successful Therapy Session&quot;
                  </h3>
                  <p
                    className="text-base md:text-lg"
                    style={{
                      fontFamily: "Inter, sans-serif",
                      color: "rgba(255, 255, 255, 0.9)",
                    }}
                  >
                    What do you think and feel when you READ this?
                  </p>
                </div>

                {/* Block 4: Successful Session Image */}
                <button
                  onClick={() => setRevealedImage2(!revealedImage2)}
                  className="rounded-2xl shadow-lg overflow-hidden relative cursor-pointer hover:shadow-xl transition-shadow aspect-square"
                >
                  {!revealedImage2 ? (
                    <div
                      className="absolute inset-0 flex flex-col items-center justify-center hover:bg-opacity-90 transition-all p-4"
                      style={{ backgroundColor: "#374151" }}
                    >
                      <p
                        className="text-white text-base md:text-lg mb-4 text-center"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        What do you think and feel when you SEE this image?
                      </p>
                      <span
                        className="text-white text-lg md:text-xl font-medium"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Click to Reveal
                      </span>
                    </div>
                  ) : (
                    <Image
                      src="/images/successful-session.jpg"
                      alt="A successful therapy session"
                      fill
                      className="object-cover"
                    />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Course Section */}
      <section
        id="about"
        className="py-32"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <h2
              className="text-5xl md:text-6xl font-light mb-8 animate-fade-in"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "#374151",
                lineHeight: "1.1",
              }}
            >
              Why PhotoTherapy?
            </h2>
            <div
              className="w-24 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#6B7280" }}
            ></div>
            <p
              className="text-xl md:text-2xl max-w-6xl mx-auto leading-relaxed"
              style={{
                color: "#666666",
                fontFamily: "Inter, sans-serif",
                fontWeight: "300",
              }}
            >
              Because PhotoTherapy allows us to see what our concerns look
              like so we can change what they feel like.
              <span style={{ color: "#374151", fontWeight: "500" }}>
                {" "}
                When we can change how they feel we can change how they impact
                us. <br />
                This is where healing resides.
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20 items-center">
            {/* Left Column - Goals of Therapy in General */}
            <div
              className="p-6 rounded-3xl h-full flex flex-col justify-center"
              style={{
                backgroundColor: "#1a1a1a",
                boxShadow: "0 10px 30px rgba(26, 26, 26, 0.4)",
              }}
            >
              <h3
                className="text-2xl font-light mb-4 text-center"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#D1D5DB",
                }}
              >
                Goals of Therapy in General
              </h3>
              <ul className="space-y-3">
                <li
                  className="flex items-start"
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }}></span>
                  Reduce emotional distress
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }}></span>
                  Develop healthy coping skills
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }}></span>
                  Improve self-awareness
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }}></span>
                  Change negative behaviors
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: "#D1D5DB" }}></span>
                  Improve overall well-being & relations
                </li>
              </ul>
            </div>

            {/* Center Column - Image */}
            <div className="relative overflow-hidden rounded-3xl shadow-xl h-full">
              <Image
                src="/images/reflection.jpg"
                alt="PhotoTherapy session demonstration"
                width={400}
                height={600}
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Right Column - Goals of PhotoTherapy & This Course */}
            <div
              className="p-6 rounded-3xl h-full flex flex-col justify-center"
              style={{
                backgroundColor: "#374151",
                boxShadow: "0 10px 30px rgba(55, 65, 81, 0.2)",
              }}
            >
              <h3
                className="text-2xl font-light mb-4 text-center"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "white",
                }}
              >
                Goals of PhotoTherapy & This Course
              </h3>
              <ul className="space-y-3">
                <li
                  className="flex items-start"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                  Reduce the stress of owning a practice
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                  Develop your skills as a therapist by adding proven theraputic
                  techniques to your skillset
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                  Improve client awareness for self and others
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                  Change how clients see process and react to their experiences
                </li>
                <li
                  className="flex items-start"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                    fontFamily: "Inter, sans-serif",
                    fontSize: "16px",
                  }}
                >
                  <span className="mr-3 mt-1.5 w-2 h-2 rounded-full bg-gray-300 flex-shrink-0"></span>
                  Improve the overall therapeutic experience and outcome
                </li>
              </ul>
            </div>
          </div>

          {/* Just Picture It Section */}
          <div className="mb-32">
            <div className="text-center mb-16">
              <h2
                className="text-4xl md:text-5xl font-light mb-8"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#374151",
                  lineHeight: "1.1",
                }}
              >
                Just Picture It!
              </h2>
              <p
                className="text-xl max-w-3xl mx-auto"
                style={{
                  color: "#666666",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "300",
                }}
              >
                How photographs can transform your practice and your clients&apos; lives.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
              {/* Polaroid 1 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(-1deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/struggling-client-5.jpg"
                    alt="Revisualize positive outcomes"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Helping your clients become more aware of inaccurate and
                  harmful ways of thinking by showing them
                  <br />
                  how to revisualize positive outcomes.
                </p>
              </div>

              {/* Polaroid 2 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(1deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/photos-5.jpg"
                    alt="Foster positive behaviour change"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Helping your clients foster positive behaviour change and
                  personal growth by helping them &apos;see&apos; how cognitive
                  distortions cause negative actions and reactions.
                </p>
              </div>

              {/* Polaroid 3 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(-0.5deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/holding-photos-5.jpg"
                    alt="Improve success stories"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Help your clients improve their own success stories by
                  showing them how retelling a story visually can uncover the
                  obstacles keeping them stuck and put them on the road to a
                  changed and fulfilling life.
                </p>
              </div>

              {/* Polaroid 4 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(0.5deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/therapist-happy-5.jpg"
                    alt="Reduce stress and anxiety"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Help you reduce your stress and anxiety that comes with
                  owning a very busy practice and caring for your clients.
                </p>
              </div>

              {/* Polaroid 5 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:-rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(-1.5deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/talking-5.jpg"
                    alt="Improve client outcomes"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Help you improve the outcomes of your clients&apos; experience in
                  therapy so they can&apos;t wait to tell all their family and
                  friends about you, improving your numbers and income exponentially.
                </p>
              </div>

              {/* Polaroid 6 */}
              <div
                className="bg-white p-4 pb-16 shadow-2xl transform hover:scale-105 hover:rotate-1 transition-all duration-300"
                style={{
                  boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2), 0 0 10px rgba(0, 0, 0, 0.1)",
                  transform: "rotate(1.5deg)"
                }}
              >
                <div className="bg-gray-100 mb-4 overflow-hidden h-64 flex items-center justify-center">
                  <Image
                    src="/images/looking-at-photo-5.jpg"
                    alt="Grow personally and professionally"
                    width={300}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
                <p
                  className="text-center leading-relaxed px-2"
                  style={{
                    color: "#374151",
                    fontFamily: "Permanent Marker, cursive",
                    fontSize: "13px",
                  }}
                >
                  Help you grow both personally and
                  <br />
                  professionally by learning how to apply PhotoTherapy
                  <br />
                  techniques to your own life so you too can
                  <br />
                  experience your own success story.
                </p>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="text-center mb-16">
            <h2
              className="text-4xl md:text-5xl font-light mb-8"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "#374151",
                lineHeight: "1.1",
              }}
            >
              The Benefits of PhotoTherapy
            </h2>
            <div
              className="w-24 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#6B7280" }}
            ></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div
              className="group text-center p-10 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: "#FAFAFA",
                border: "1px solid rgba(0, 48, 39, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 48, 39, 0.05)",
              }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="/images/happyclientphoto.jpg"
                    alt="Help More Clients"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3
                className="text-2xl font-light mb-6 transition-colors"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                Help More Clients
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Address all concerns with all clients using the universal
                language of pictures. Break through barriers that traditional
                therapy cannot reach.
              </p>
            </div>

            <div
              className="group text-center p-10 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: "#FAFAFA",
                border: "1px solid rgba(0, 48, 39, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 48, 39, 0.05)",
              }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="/images/mortgage-concept.webp"
                    alt="Increase Your Income"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3
                className="text-2xl font-light mb-6 transition-colors"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                Increase Your Income
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                The power of a client&apos;s success is the foundation for a practice&apos;s remuneration.
              </p>
            </div>

            <div
              className="group text-center p-10 rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{
                backgroundColor: "#FAFAFA",
                border: "1px solid rgba(0, 48, 39, 0.1)",
                boxShadow: "0 10px 30px rgba(0, 48, 39, 0.05)",
              }}
            >
              <div className="relative mb-8">
                <div className="w-24 h-24 mx-auto overflow-hidden rounded-2xl transition-all duration-300 group-hover:scale-110">
                  <Image
                    src="/images/happytherapist.webp"
                    alt="Reduce Burnout"
                    width={96}
                    height={96}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <h3
                className="text-2xl font-light mb-6 transition-colors"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                Reduce Burnout
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Work smarter, not harder. Set your own hours, see clients online
                from home,
                <br />
                and design the freedom and practice you want.
              </p>
            </div>
          </div>

          <div
            className="rounded-3xl p-12"
            style={{ backgroundColor: "#374151", color: "#FFFFFF" }}
          >
            <h3
              className="text-3xl font-light mb-12 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The PhotoTherapy Advantage
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#D1D5DB",
                  }}
                >
                  Universal Language
                </h4>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Pictures speak to everyone, regardless of race, culture, age,
                  gender, or verbal ability. The impact of an image or
                  photograph needs no words.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#D1D5DB",
                  }}
                >
                  Unlock Repressed Emotions
                </h4>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Photographs help clients access memories and feelings that
                  might otherwise have gone unnoticed. It&apos;s the noticing that
                  leads to awareness, self-compassion, and understanding for
                  change.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#D1D5DB",
                  }}
                >
                  Symbolic Communication
                </h4>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Images communicate symbolically, making therapy less intrusive
                  and more effective.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "#1a1a1a" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#D1D5DB",
                  }}
                >
                  Personal Growth
                </h4>
                <p
                  style={{
                    color: "#D1D5DB",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Not just for clients - transform your own life while becoming
                  a better therapist. A great therapist grows out of a deep
                  commitment to ongoing learning and personal growth.
                </p>
              </div>
            </div>

            {/* Visual Path Text - Centered Below */}
            <h3
              className="text-3xl font-light mt-12 text-center"
              style={{ fontFamily: "Cormorant Garamond, serif" }}
            >
              The Visual Path Is Paved With Positive Outcomes
            </h3>
          </div>
        </div>
      </section>

      {/* About the Instructor Section */}
      <section
        id="instructor"
        className="py-16"
        style={{ backgroundColor: "#3B82F6" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Meet Your Instructor
            </h2>
            <p className="text-xl text-white">
              Kelly Gauthier - PhotoTherapy Specialist & Practitioner
            </p>
          </div>

          <div className="rounded-2xl shadow-lg p-8 max-w-4xl mx-auto" style={{ backgroundColor: "#3B82F6" }}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="w-64 h-64 mx-auto mb-6 rounded-full overflow-hidden shadow-xl">
                  <Image
                    src="/images/profile.png"
                    alt="Kelly Gauthier - PhotoTherapy Specialist"
                    width={256}
                    height={256}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  Kelly Gauthier
                </h3>
                <p className="text-white mb-4">
                  Kelly has walked in your shoes and faced the same challenges
                  you have. After graduating with an honours BA in Photography,
                  Kelly set out to change the world visually, only to encounter
                  one roadblock after another. Between the financial stresses
                  that came with owning her own business, to the long hours
                  worked just to try and make ends meet, to a real lack of
                  connection and fulfillment from and with her clients. It
                  wasn’t until a bad bike accident rendered Kelly unable to
                  continue running Camp Camera that she turned to photographs
                  and photography for her own recovery and healing.
                </p>
                <p className="text-white mb-4">
                  It was through this experience that Kelly found her calling!
                  She is now a Registered Art Therapist operating a highly
                  successful PhotoTherapy based practice, earning a 6-figure
                  income, and offering her colleagues and mental health workers
                  the same opportunity to learn the ins and outs of PhotoTherapy
                  to positively impact their practices, their client outcomes,
                  and their own lives and financial independence.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">20+</div>
                    <div className="text-sm text-white">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      1000+
                    </div>
                    <div className="text-sm text-white">Clients Helped</div>
                  </div>
                  <div className="text-center">
                    <div
                      className="text-2xl font-bold text-white"
                    >
                      $$$$$$
                    </div>
                    <div className="text-sm text-white">Income Achieved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 rounded-xl" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
              <h4 className="font-bold text-white mb-3">
                Kelly's Philosophy:
              </h4>
              <blockquote className="text-white italic">
                "For you to become the best at what you do, you need to be the
                best at who you are first. You need to walk your PhotoTherapy
                talk! The greatest of therapists have done the work they're
                asking their clients to do."
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Course Details Section */}
      <section id="course" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              What You'll Master in 12 Weeks
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive program designed to fit into your busy schedule
              while transforming your practice and your life.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {[
              "What PhotoTherapy Is & Why It Works",
              "How to Use Photos in Therapy Sessions",
              "Understanding Your Internal Lens",
              "Working with Client's Visual Memories",
              "Creative PhotoTherapy Activities",
              "Building Your PhotoTherapy Practice",
              "Increasing Session Effectiveness",
              "Working from Home Strategies",
              "Setting Your Own Schedule",
            ].map((topic, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-2xl font-bold text-blue-600 mb-3">
                  {index + 1}
                </div>
                <h4 className="font-semibold text-gray-900">{topic}</h4>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              12-Week Transformation Program
            </h3>
            <p className="text-gray-200 mb-6 max-w-2xl mx-auto">
              Designed for mental health professionals and practitioners looking
              to improve. Each module takes just 3-4 hours per week. You'll have
              lifetime access plus ongoing support through our community.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-gray-200">Weekly Modules</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">3-4</div>
                <div className="text-gray-200">Hours per Week</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-gray-200">Lifetime Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section
        id="testimonials"
        className="py-16"
        style={{ backgroundColor: "#FAFAFA" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Join hundreds of mental health professionals who have transformed
              their practices
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "P. Anderson",
                role: "",
                quote:
                  "If you're on the fence about taking this course, I suggest you get off the fence and sign up now! It was literally a godsend for both myself and my practice.",
                rating: 5,
              },
              {
                name: "C. Foote",
                role: "",
                quote:
                  "Adding Phototherapy to my existing skills has not only doubled my income, but it's also doubled my client success stories. I'd say that's a HUGE win-win.",
                rating: 5,
              },
              {
                name: "D. Davis",
                role: "",
                quote:
                  "I always knew photographs could move people more than words. I just never realized, until taking this course, just how important and instrumental visuals are to a client's self-awareness and overall healing. Can't thank you enough Kelly for creating this course!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="rounded-2xl shadow-lg p-8" style={{ backgroundColor: "#374151" }}>
                <div className="flex items-center justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="mb-6 italic" style={{ color: "#3B82F6" }}>
                  "{testimonial.quote}"
                </p>
                <div className="text-center">
                  <div className="font-bold text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-white">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Practice?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join the PhotoTherapy revolution and discover your golden ticket to
            success, freedom, and financial independence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="/enroll"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
            >
              <BookOpen className="h-6 w-6" />
              Enroll Today
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Invest in yourself today. You'll be so glad you did.
          </p>
          <p className="text-3xl md:text-4xl font-bold text-gray-800 mt-4" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Just Picture It!
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Newsletter Signup */}
          <div className="mb-12">
            <h3
              className="text-2xl font-light mb-4"
              style={{
                fontFamily: "Cormorant Garamond, serif",
                color: "#374151",
              }}
            >
              PhotoTherapy Insights in Your Mailbox
            </h3>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                style={{ fontFamily: "Inter, sans-serif" }}
              />
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-900 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Subscribe
              </button>
            </form>
            <div className="flex items-start gap-2 mt-3">
              <input type="checkbox" id="privacy" className="mt-1" />
              <label
                htmlFor="privacy"
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                I agree to the privacy statement
              </label>
            </div>
          </div>

          <hr className="border-gray-300 mb-8" />

          {/* Footer Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <h4
                className="font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#about"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    About PhotoTherapy
                  </a>
                </li>
                <li>
                  <a
                    href="#instructor"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    About the Instructor
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Course Modules
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Resources
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4
                className="font-semibold text-gray-800 mb-3"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Connect
              </h4>
              <p
                className="text-gray-600 mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                info@fstoptosuccess.com
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white hover:bg-gray-900 transition-colors"
                >
                  <span className="sr-only">Instagram</span>@
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-300">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p
                className="text-sm text-gray-600"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                © 2020 F-Stop to Success. All rights reserved.
              </p>
              <a
                href="#"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
