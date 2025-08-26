"use client";
import { useState, useEffect } from "react";
import { Lock, BookOpen, CreditCard, CheckCircle } from "lucide-react";
import Link from "next/link";
import { userEnrollmentService, EnrollmentStatus } from "../lib/user-enrollment";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface EnrollmentGuardProps {
  user: User;
  courseId?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function EnrollmentGuard({ 
  user, 
  courseId, 
  children, 
  fallback 
}: EnrollmentGuardProps) {
  const [enrollmentStatus, setEnrollmentStatus] = useState<EnrollmentStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkEnrollment = async () => {
      try {
        // Initialize user if they don't exist
        await userEnrollmentService.initializeUser(
          user.uid,
          user.email || '',
          user.displayName
        );

        // Check enrollment status
        const status = await userEnrollmentService.checkEnrollmentStatus(
          user.uid,
          courseId
        );
        
        console.log('EnrollmentGuard - User ID:', user.uid);
        console.log('EnrollmentGuard - Course ID:', courseId);
        console.log('EnrollmentGuard - Enrollment Status:', status);
        
        setEnrollmentStatus(status);
      } catch (err) {
        console.error('Error checking enrollment:', err);
        setError('Failed to check enrollment status');
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) {
      checkEnrollment();
    }
  }, [user, courseId]);

  if (loading) {
    return (
      <div className="pt-24 pb-16 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking enrollment status...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-bold text-red-800 mb-4">
              Enrollment Check Failed
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // If user has access, render children
  if (enrollmentStatus?.hasAccess) {
    return <>{children}</>;
  }

  // If user is enrolled but not active, show pending status
  if (enrollmentStatus?.isEnrolled && !enrollmentStatus?.hasAccess) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center">
            <div className="bg-yellow-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-yellow-800 mb-4">
              Enrollment Pending
            </h2>
            <p className="text-yellow-700 mb-6">
              Your enrollment is being processed. You&apos;ll receive access to the course once your enrollment is activated.
            </p>
            <div className="bg-white rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">What's Next?</h3>
              <ul className="text-left text-gray-600 space-y-2">
                <li>• We&apos;ll review your enrollment within 24 hours</li>
                <li>• You&apos;ll receive an email confirmation when activated</li>
                <li>• Contact support if you have any questions</li>
              </ul>
            </div>
            <Link
              href="/"
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Custom fallback or default enrollment required message
  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
            <Lock className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Course Enrollment Required
          </h2>
          <p className="text-gray-600 mb-6">
            You need to be enrolled in this course to access the content. 
            Please complete your enrollment to continue your learning journey.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              F-Stop to Success Course Includes:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">12 comprehensive modules</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">50+ video lessons</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Lifetime access</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Community support</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Practical exercises</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Expert guidance</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              onClick={() => {
                // This would typically redirect to a payment/enrollment page
                alert('Enrollment process would start here. For demo purposes, this would redirect to a payment/registration page.');
              }}
            >
              <CreditCard className="h-5 w-5" />
              Enroll Now
            </button>
            <Link
              href="/"
              className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3"
            >
              <BookOpen className="h-5 w-5" />
              Learn More
            </Link>
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p>Already enrolled? <button 
              onClick={() => window.location.reload()} 
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Refresh page
            </button></p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Convenience component for course-specific enrollment guard
export function CourseEnrollmentGuard({ 
  user, 
  courseId, 
  children 
}: { 
  user: User; 
  courseId: string; 
  children: React.ReactNode;
}) {
  return (
    <EnrollmentGuard user={user} courseId={courseId}>
      {children}
    </EnrollmentGuard>
  );
}