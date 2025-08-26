'use client';

import { useEnrollment } from '@/hooks/useEnrollment';
import { useAuth } from '@/hooks/useAuth';
import { BookOpen, Lock } from 'lucide-react';

interface EnrollmentStatusProps {
  showIcon?: boolean;
  className?: string;
}

export default function EnrollmentStatus({ showIcon = true, className = '' }: EnrollmentStatusProps) {
  const { user, loading: authLoading } = useAuth();
  const { isEnrolled, loading: enrollmentLoading } = useEnrollment();

  if (authLoading || enrollmentLoading) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
        <span className="text-gray-500">Loading...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={`flex items-center space-x-2 text-gray-500 ${className}`}>
        {showIcon && <Lock className="w-4 h-4" />}
        <span>Sign in required</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showIcon && (
        isEnrolled 
          ? <BookOpen className="w-4 h-4 text-green-600" />
          : <Lock className="w-4 h-4 text-red-600" />
      )}
      <span className={isEnrolled ? 'text-green-600 font-medium' : 'text-red-600'}>
        {isEnrolled ? 'Enrolled' : 'Not Enrolled'}
      </span>
    </div>
  );
}