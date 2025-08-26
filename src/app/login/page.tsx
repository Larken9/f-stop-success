'use client';

import { useState } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '@/app/lib/firebase';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { user, loading, isAdmin } = useAuth();
  const [signing, setSigning] = useState(false);
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setSigning(true);
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in');
    } finally {
      setSigning(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-teal"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {user ? 'Account' : 'Sign in to your account'}
          </h2>
        </div>

        {user ? (
          <div className="bg-white p-8 rounded-lg shadow">
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600"><strong>Email:</strong> {user.email}</p>
                <p className="text-gray-600"><strong>Name:</strong> {user.displayName || 'Not set'}</p>
                <p className="text-gray-600"><strong>Role:</strong> {isAdmin ? 'Admin' : 'User'}</p>
                <p className="text-gray-600"><strong>UID:</strong> {user.uid}</p>
              </div>

              <div className="space-y-4">
                {isAdmin && (
                  <button
                    onClick={() => router.push('/admin')}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Admin Dashboard
                  </button>
                )}
                
                <button
                  onClick={() => router.push('/')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-teal hover:bg-secondary-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal"
                >
                  Go to Home
                </button>

                <button
                  onClick={handleSignOut}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow">
            <button
              onClick={handleGoogleSignIn}
              disabled={signing}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-teal hover:bg-secondary-teal focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-teal disabled:opacity-50"
            >
              {signing ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}