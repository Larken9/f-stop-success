'use client';

import { useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/app/lib/firebase';
import { userService } from '@/app/lib/user-service';

interface UserWithRoles extends User {
  customClaims?: {
    admin?: boolean;
  };
}

export function useAuth() {
  const [user, setUser] = useState<UserWithRoles | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Create or update user document and check admin status
        await userService.createOrUpdateUser(user); 
        const adminStatus = await userService.isAdmin(user.uid);
        
        setIsAdmin(adminStatus);
        setUser(user as UserWithRoles);
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { user, loading, isAdmin };
}