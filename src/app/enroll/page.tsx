"use client";

import { useState, useEffect } from "react";
import { getProduct, createCheckout } from "../lib/shopify";
import { Camera, Check, Shield, Clock, Users } from "lucide-react";
import Image from "next/image";

interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string;
      };
    }>;
  };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: {
          amount: string;
          currencyCode: string;
        };
      };
    }>;
  };
}

export default function EnrollPage() {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const productId = process.env.NEXT_PUBLIC_SHOPIFY_PRODUCT_ID!;
        const productData = await getProduct(productId);
        setProduct(productData);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, []);

  const handleEnroll = async () => {
    if (!product) return;

    setEnrolling(true);
    try {
      const variantId = product.variants.edges[0].node.id;
      const checkout = await createCheckout(variantId, 1);

      // Redirect to Shopify checkout
      window.location.href = checkout.webUrl;
    } catch (error) {
      console.error("Error creating checkout:", error);
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FAFAFA 0%, #f5f5f5 50%, #e8e8e8 100%)" }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "linear-gradient(135deg, #FAFAFA 0%, #f5f5f5 50%, #e8e8e8 100%)" }}>
        <div className="text-center">
          <p className="text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  const price = product.variants.edges[0].node.price.amount;
  const currencyCode = product.variants.edges[0].node.price.currencyCode;

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #FAFAFA 0%, #f5f5f5 50%, #e8e8e8 100%)" }}>
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-lg shadow-sm z-50" style={{ borderBottom: "1px solid rgba(128, 128, 128, 0.1)" }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <a href="/" className="flex items-center group">
              <div className="rounded-2xl p-3 mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105" style={{ background: "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)" }}>
                <Camera className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                F-STOP to Success
              </span>
            </a>
            <a href="/" className="text-gray-600 hover:text-gray-900 font-medium" style={{ fontFamily: "Inter, sans-serif" }}>
              ← Back to Home
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left Column - Course Details */}
            <div>
              <h1 className="text-4xl md:text-5xl font-light mb-6" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                {product.title}
              </h1>

              <div className="mb-8">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-5xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                    ${price}
                  </span>
                  <span className="text-xl text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                    {currencyCode}
                  </span>
                </div>
                <p className="text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                  One-time payment • Lifetime access
                </p>
              </div>

              <div className="prose prose-lg mb-8">
                <p className="text-gray-700 leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
                  {product.description}
                </p>
              </div>

              {/* What's Included */}
              <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">
                <h3 className="text-2xl font-light mb-6" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                  What&apos;s Included
                </h3>
                <ul className="space-y-4">
                  {[
                    "7 comprehensive modules with video lessons",
                    "Downloadable resources and worksheets",
                    "PhotoTherapy technique guides",
                    "Community access for support",
                    "Certificate of completion",
                    "Lifetime access to all materials",
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700" style={{ fontFamily: "Inter, sans-serif" }}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-2xl shadow">
                  <Shield className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                    Secure Payment
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                    Instant Access
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-2xl shadow">
                  <Users className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                    200+ Students
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:sticky lg:top-32">
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                {product.images.edges[0] && (
                  <div className="relative h-64 bg-gray-100">
                    <Image
                      src={product.images.edges[0].node.url}
                      alt={product.images.edges[0].node.altText || product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="p-8">
                  <h2 className="text-3xl font-light mb-4" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                    Ready to Transform Your Practice?
                  </h2>

                  <p className="text-gray-600 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
                    Join hundreds of mental health professionals who have transformed their practices with PhotoTherapy.
                  </p>

                  <div className="mb-6 p-6 bg-gray-50 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600" style={{ fontFamily: "Inter, sans-serif" }}>
                        Course Price
                      </span>
                      <span className="text-2xl font-bold" style={{ fontFamily: "Cormorant Garamond, serif", color: "#1a1a1a" }}>
                        ${price} {currencyCode}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500" style={{ fontFamily: "Inter, sans-serif" }}>
                      One-time payment • No recurring fees
                    </p>
                  </div>

                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full text-white px-8 py-5 rounded-2xl font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: enrolling ? "#9CA3AF" : "linear-gradient(135deg, #1a1a1a 0%, #333333 100%)",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {enrolling ? "Processing..." : "Enroll Now"}
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-4" style={{ fontFamily: "Inter, sans-serif" }}>
                    30-day money-back guarantee
                  </p>
                </div>
              </div>

              {/* Testimonial */}
              <div className="mt-8 bg-white rounded-3xl p-8 shadow-lg">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 italic mb-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  &quot;If you&apos;re on the fence about taking this course, I suggest you get off the fence and sign up now! It was literally a godsend for both myself and my practice.&quot;
                </p>
                <p className="font-semibold text-gray-900" style={{ fontFamily: "Inter, sans-serif" }}>
                  P. Anderson
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
