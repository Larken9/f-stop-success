"use client";
import { Camera } from "lucide-react";
import Image from "next/image";

export default function WorkshopPage() {
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
              <a
                href="/"
                className="text-2xl font-bold"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#1a1a1a",
                }}
              >
                F-STOP to Success
              </a>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a
                href="/"
                className="transition-all duration-300 font-medium relative group hover:text-gray-900"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Home
              </a>
              <a
                href="/#about"
                className="transition-all duration-300 font-medium relative group hover:text-gray-900"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                About
              </a>
              <a
                href="/enroll"
                className="transition-all duration-300 font-medium relative group hover:text-gray-900"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Enroll
              </a>
              <a
                href="/workshop"
                className="transition-all duration-300 font-medium relative group"
                style={{ color: "#1a1a1a", fontFamily: "Inter, sans-serif" }}
              >
                Workshop
                <span
                  className="absolute -bottom-1 left-0 w-full h-0.5"
                  style={{ backgroundColor: "#1a1a1a" }}
                ></span>
              </a>
              <a
                href="/#instructor"
                className="transition-all duration-300 font-medium relative group hover:text-gray-900"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Instructor
              </a>
              <a
                href="/#testimonials"
                className="transition-all duration-300 font-medium relative group hover:text-gray-900"
                style={{ color: "#666666", fontFamily: "Inter, sans-serif" }}
              >
                Success Stories
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-[60%_40%] gap-8 items-start">
            {/* Workshop Poster - Left Side */}
            <div className="bg-gradient-to-br from-[#2B5876] to-[#4E8098] rounded-3xl shadow-2xl overflow-hidden">
              <div className="grid grid-cols-2 gap-0">
                {/* Left Side - Main Content */}
                <div className="p-8 md:p-10 text-white flex flex-col justify-center items-center text-center">
                <div className="max-w-lg">
                  <p
                    className="text-lg md:text-xl italic mb-4"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    Learn How To
                  </p>
                  <h1
                    className="text-2xl md:text-3xl font-bold mb-6 leading-snug"
                    style={{
                      fontFamily: "Cormorant Garamond, serif",
                      color: "#F4A261",
                    }}
                  >
                    INCREASE YOUR CLIENT SUCCESSES, REMUNERATION, AND OVERALL PRACTICAL WELL-BEING IN JUST ONE MONTH USING PHOTOGRAPHS IN THERAPY
                  </h1>
                  <p
                    className="text-sm md:text-base italic leading-relaxed mb-6"
                    style={{ fontFamily: "Cormorant Garamond, serif" }}
                  >
                    This interactive workshop will walk you through what PhotoTherapy is, how it works, why it works, and why it is the visual ticket to creating the practice of your dreams.
                  </p>

                  {/* Camera Icon */}
                  <div className="flex justify-center my-6">
                    <svg
                      viewBox="0 0 200 150"
                      className="w-32 h-24"
                      style={{ stroke: "#7BACD1", fill: "none", strokeWidth: 2 }}
                    >
                      <rect
                        x="40"
                        y="50"
                        width="120"
                        height="80"
                        rx="10"
                        strokeLinecap="round"
                      />
                      <circle cx="100" cy="90" r="25" />
                      <circle cx="100" cy="90" r="15" />
                      <path d="M 70 50 L 80 30 L 120 30 L 130 50" strokeLinejoin="round" />
                      <line x1="140" y1="60" x2="150" y2="60" strokeLinecap="round" />
                    </svg>
                  </div>

                  <div className="mb-6">
                    <p
                      className="text-lg italic mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Hosted by:
                    </p>
                    <h2
                      className="text-2xl md:text-3xl font-bold mb-1"
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        color: "#F4A261",
                      }}
                    >
                      KELLY GAUTHIER
                    </h2>
                    <p
                      className="text-xl md:text-2xl font-bold mb-1"
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        color: "#F4A261",
                      }}
                    >
                      RCAT, DVATI, BFA, FTG
                    </p>
                    <p
                      className="text-base md:text-lg italic"
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        color: "#F4A261",
                      }}
                    >
                      PhotoTherapy Specialist and Practitioner
                    </p>
                  </div>

                  <div className="mb-6">
                    <p
                      className="text-lg italic mb-2"
                      style={{ fontFamily: "Cormorant Garamond, serif" }}
                    >
                      Two Available Dates:
                    </p>
                    <p className="text-xl md:text-2xl font-bold mb-1">
                      December 15th and December 17th
                    </p>
                    <p className="text-lg mb-1">from 7-8:30pm</p>
                    <p className="text-xl md:text-2xl font-bold">$75/pp</p>
                  </div>

                  <div className="mt-6">
                    <h3
                      className="text-3xl md:text-4xl font-bold mb-3"
                      style={{
                        fontFamily: "Cormorant Garamond, serif",
                        color: "#F4A261",
                      }}
                    >
                      ON-LINE ZOOM
                    </h3>
                    <p className="text-sm md:text-base italic mb-1">Email:</p>
                    <p className="text-base md:text-lg mb-1">
                      <a
                        href="mailto:kelly@pictureyourselfwell.com"
                        className="hover:underline break-all"
                      >
                        kelly@pictureyourselfwell.com
                      </a>{" "}
                      to Register
                    </p>
                    <p className="text-sm md:text-base">
                      Subject Line: <span className="font-bold">PHOTOTHERAPY WORKS</span>
                    </p>
                  </div>
                </div>
                </div>

                {/* Right Side - Images */}
                <div className="flex flex-col">
                  <div className="h-1/3 relative">
                    <Image
                      src="/images/workshop-couple.jpg"
                      alt="Happy elderly couple looking at photos"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-1/3 relative">
                    <Image
                      src="/images/workshop-piggy.jpg"
                      alt="Piggy bank representing financial success"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="h-1/3 relative">
                    <Image
                      src="/images/workshop-photos.jpg"
                      alt="People looking at photographs together"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description Text - Right Side */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 sticky top-32">
              <h2
                className="text-3xl font-bold mb-6"
                style={{
                  fontFamily: "Cormorant Garamond, serif",
                  color: "#2B5876",
                }}
              >
                About This Workshop
              </h2>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#333333", fontFamily: "Inter, sans-serif" }}
              >
                After more than 27 years as a professional photographer and visual educator,
                and 15 years as a Registered Art Therapist and PhotoTherapy Specialist and
                Practitioner, Kelly Gauthier is now sharing how she turned a small art therapy
                practice into a thriving and lucrative online phototherapy business and company.
                All by honing how she used photographs in therapy with her clients!
              </p>
              <p
                className="text-base leading-relaxed mb-6"
                style={{ color: "#333333", fontFamily: "Inter, sans-serif" }}
              >
                Join Kelly for an 1 1/2 of fun, interactive, and mind blowing PhotoTherapy
                activities that will show you first hand how PhotoTherapy works, why it works,
                and why it is the visual ticket to creating the practice of your dreams.
              </p>

              <div
                className="bg-gradient-to-br from-[#2B5876] to-[#4E8098] rounded-2xl p-6 text-white"
              >
                <h3
                  className="text-2xl font-bold mb-4"
                  style={{ fontFamily: "Cormorant Garamond, serif" }}
                >
                  How to Register
                </h3>
                <p className="text-base mb-3">
                  <strong>Choose from:</strong> December 15th or 17th
                </p>
                <p className="text-base mb-3">
                  <strong>Time:</strong> 7:00-8:30pm
                </p>
                <p className="text-base mb-4">
                  <strong>Price:</strong> $75 per person
                </p>
                <div className="border-t border-white/30 pt-4">
                  <p className="text-sm mb-2">Email Kelly directly at:</p>
                  <a
                    href="mailto:kelly@pictureyourselfwell.com"
                    className="text-[#F4A261] hover:underline font-semibold text-lg block mb-3 break-all"
                  >
                    kelly@pictureyourselfwell.com
                  </a>
                  <p className="text-sm">
                    Subject Line: <span className="font-bold">PHOTOTHERAPY WORKS</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                    href="/#about"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    About PhotoTherapy
                  </a>
                </li>
                <li>
                  <a
                    href="/#instructor"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    About the Instructor
                  </a>
                </li>
                <li>
                  <a
                    href="/courses"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
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
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Getting Started
                  </a>
                </li>
                <li>
                  <a
                    href="/dashboard"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
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
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-600 hover:text-gray-900 transition-colors no-underline"
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
                  href="https://www.instagram.com/fstoptosuccess/"
                  target="_blank"
                  rel="noopener noreferrer"
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
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors no-underline"
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
