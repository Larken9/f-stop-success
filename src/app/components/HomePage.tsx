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
                href="#course"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Course
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
                  href="#about"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  About
                </a>
                <a
                  href="#course"
                  className="text-slate-600 hover:text-sky-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
                >
                  Course
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
      <div className="relative pt-40 pb-32 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              {/* Main Heading */}
              <h1
                className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight animate-fade-in"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                Transform Your
                <span className="block font-medium">Mental Health</span>
                <span
                  className="block font-medium"
                  style={{ color: "#2D5A4D" }}
                >
                  Practice
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
                  <span style={{ color: "#003027", fontWeight: "500" }}>
                    PhotoTherapy
                  </span>{" "}
                  – where images become healing tools that speak to every
                  client's heart.
                </p>
                <p
                  className="text-lg leading-relaxed max-w-lg"
                  style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
                >
                  Learn professional techniques to increase your income, reduce
                  burnout, and create transformative breakthroughs using the
                  universal language of visual imagery.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                {user ? (
                  <a
                    href="/dashboard"
                    className="text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <BookOpen className="h-5 w-5" />
                    Continue Learning
                  </a>
                ) : (
                  <button
                    onClick={signInWithGoogle}
                    className="text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                    style={{
                      background:
                        "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    <LogIn className="h-5 w-5" />
                    Start Your Journey
                  </button>
                )}
                <button
                  className="border-2 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105 bg-white/50 backdrop-blur-sm"
                  style={{
                    borderColor: "#003027",
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
                      style={{ backgroundColor: "#22C55E" }}
                    ></div>
                    <p
                      style={{
                        color: "#666666",
                        fontFamily: "Inter, sans-serif",
                      }}
                    >
                      Welcome back,{" "}
                      <span style={{ fontWeight: "600", color: "#003027" }}>
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
                    src="/images/photo-1438761681033-6461ffad8d80.avif"
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
                color: "#003027",
                lineHeight: "1.1",
              }}
            >
              The Power of Visual Storytelling
            </h2>
            <div
              className="w-24 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#2D5A4D" }}
            ></div>
            <p
              className="text-xl max-w-4xl mx-auto leading-relaxed"
              style={{
                color: "#666666",
                fontFamily: "Inter, sans-serif",
                fontWeight: "300",
              }}
            >
              Every image tells a story. Every photograph holds the power to
              heal, inspire, and transform.
              <span style={{ color: "#003027", fontWeight: "500" }}>
                {" "}
                Discover how visual therapy can revolutionize your practice.
              </span>
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div
              className="group relative overflow-hidden rounded-3xl transition-all duration-500 hover:scale-[1.02]"
              style={{ boxShadow: "0 20px 40px rgba(0, 48, 39, 0.1)" }}
            >
              <Image
                src="/images/photo-1438761681033-6461ffad8d80.avif"
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
                src="/images/photo-1470071459604-3b5ec3a7fe05.avif"
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
                src="/images/photo-1487147264018-f937fba0c817.avif"
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
                src="/images/photo-1580489944761-15a19d654956.avif"
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

          <div className="text-center">
            <div
              className="rounded-3xl p-12 max-w-5xl mx-auto"
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
                className="text-lg leading-relaxed"
                style={{
                  color: "#666666",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: "300",
                }}
              >
                Images bypass the analytical mind and speak directly to our
                emotions. In PhotoTherapy, we harness this natural connection to
                facilitate healing, self-discovery, and growth.
                <span style={{ color: "#003027", fontWeight: "500" }}>
                  {" "}
                  It&apos;s not about taking perfect photos—it&apos;s about
                  finding perfect moments of clarity.
                </span>
              </p>
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
                color: "#003027",
                lineHeight: "1.1",
              }}
            >
              Why PhotoTherapy?
            </h2>
            <div
              className="w-24 h-0.5 mx-auto mb-8"
              style={{ backgroundColor: "#2D5A4D" }}
            ></div>
            <p
              className="text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed"
              style={{
                color: "#666666",
                fontFamily: "Inter, sans-serif",
                fontWeight: "300",
              }}
            >
              Discover the universal language that speaks to all clients -
              regardless of age, culture, or background.
              <span style={{ color: "#003027", fontWeight: "500" }}>
                {" "}
                PhotoTherapy is your golden ticket to transforming your
                practice.
              </span>
            </p>
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
                <div
                  className="rounded-2xl p-6 w-24 h-24 mx-auto flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#F7F5F3",
                    border: "1px solid rgba(0, 48, 39, 0.1)",
                  }}
                >
                  <Heart
                    className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "#003027" }}
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
                therapy can&apos;t reach.
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
                <div
                  className="rounded-2xl p-6 w-24 h-24 mx-auto flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#F7F5F3",
                    border: "1px solid rgba(0, 48, 39, 0.1)",
                  }}
                >
                  <Award
                    className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "#003027" }}
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
                TEST TEST TEST &apos;TEST TEST TEST
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
                <div
                  className="rounded-2xl p-6 w-24 h-24 mx-auto flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: "#F7F5F3",
                    border: "1px solid rgba(0, 48, 39, 0.1)",
                  }}
                >
                  <Users
                    className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
                    style={{ color: "#003027" }}
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
                from home, and design the freedom you want.
              </p>
            </div>
          </div>

          <div
            className="rounded-3xl p-12"
            style={{ backgroundColor: "#003027", color: "#FFFFFF" }}
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
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#FFFFFF",
                  }}
                >
                  Universal Language
                </h4>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Pictures speak to everyone, regardless of age, culture, or
                  verbal ability.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#FFFFFF",
                  }}
                >
                  Unlock Repressed Emotions
                </h4>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Photographs help clients access memories and feelings they
                  couldn't express in words.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#FFFFFF",
                  }}
                >
                  Symbolic Communication
                </h4>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Images communicate symbolically, making therapy more
                  accessible and effective.
                </p>
              </div>
              <div
                className="p-6 rounded-2xl"
                style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              >
                <h4
                  className="font-medium text-lg mb-3"
                  style={{
                    fontFamily: "Cormorant Garamond, serif",
                    color: "#FFFFFF",
                  }}
                >
                  Personal Growth
                </h4>
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Not just for clients - transform your own life while becoming
                  a better therapist.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About the Instructor Section */}
      <section
        id="instructor"
        className="py-16 bg-gradient-to-br from-blue-50 to-purple-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Your Instructor
            </h2>
            <p className="text-xl text-gray-600">
              Kelly Gauthier - PhotoTherapy Pioneer
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
                  <Camera className="h-16 w-16 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Kelly Gauthier
                </h3>
                <p className="text-gray-600 mb-4">
                  Kelly has walked in your shoes. After graduating with honors
                  in Photography, she faced the same struggles many mental
                  health professionals face today - burnout, financial stress,
                  and the challenge of truly connecting with all clients.
                </p>
                <p className="text-gray-600 mb-4">
                  Through her journey from failed photography businesses to
                  discovering PhotoTherapy, Kelly found her calling. She now
                  operates a highly successful PhotoTherapy practice, earning a
                  6-figure income while working from home on her own terms.
                </p>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">20+</div>
                    <div className="text-sm text-gray-600">
                      Years Experience
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      1000+
                    </div>
                    <div className="text-sm text-gray-600">Clients Helped</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      Test
                    </div>
                    <div className="text-sm text-gray-600">Income Achieved</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
              <h4 className="font-bold text-gray-900 mb-3">
                Kelly's Philosophy:
              </h4>
              <blockquote className="text-gray-700 italic">
                "For you to become the best at what you do, you need to be the
                best at who you are first. You need to walk your PhotoTherapy
                talk! The great therapists have done the work they're asking
                their clients to do."
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

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              12-Week Transformation Program
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Designed for busy professionals - each module takes just 3-4 hours
              per week. You'll have lifetime access plus ongoing support through
              our community.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold mb-2">12</div>
                <div className="text-blue-100">Weekly Modules</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">3-4</div>
                <div className="text-blue-100">Hours per Week</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">∞</div>
                <div className="text-blue-100">Lifetime Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section
        id="testimonials"
        className="py-16 bg-gradient-to-br from-blue-50 to-purple-50"
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
                name: "Dr. Sarah Chen",
                role: "Licensed Therapist",
                quote:
                  "PhotoTherapy has revolutionized my practice. I'm helping clients breakthrough in ways I never thought possible.",
                rating: 5,
              },
              {
                name: "Michael Rodriguez",
                role: "Clinical Social Worker",
                quote:
                  "I doubled my income in 6 months and finally have the work-life balance I always wanted.",
                rating: 5,
              },
              {
                name: "Jennifer Walsh",
                role: "Marriage Counselor",
                quote:
                  "The techniques I learned helped me connect with clients who were previously resistant to traditional therapy.",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-gray-500">
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
            {user ? (
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <BookOpen className="h-6 w-6" />
                Start Learning Now
              </a>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 rounded-xl font-bold text-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-3"
              >
                <LogIn className="h-6 w-6" />
                Enroll Today
              </button>
            )}
          </div>

          <p className="text-sm text-gray-500 mt-6">
            Invest in yourself today. You'll be so glad you did.
          </p>
        </div>
      </section>
    </div>
  );
}
