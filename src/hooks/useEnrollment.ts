'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { userService } from '@/app/lib/user-service';

export function useEnrollment() {
  const { user, loading: authLoading } = useAuth();
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!authLoading && user) {
        try {
          const userData = await userService.getUserData(user.uid);
          setIsEnrolled(userData?.enrolled || false);
        } catch (error) {
          console.error('Error checking enrollment:', error);
          setIsEnrolled(false);
        }
      } else if (!authLoading && !user) {
        setIsEnrolled(false);
      }
      setLoading(false);
    };

    checkEnrollment();
  }, [user, authLoading]);

  return { isEnrolled, loading: loading || authLoading };
}