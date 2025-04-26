"use client";

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

// Helper to syncronize Clerk user with your MongoDB database
export function useClerkUser() {
  const { user, isLoaded, isSignedIn } = useUser();
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function syncUserWithDatabase() {
      if (!isLoaded || !isSignedIn) return;
      
      try {
        setLoading(true);
        
        // Create a payload with Clerk user data
        const userData = {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          username: user.username || user.primaryEmailAddress?.emailAddress?.split('@')[0],
          profileImage: user.imageUrl
        };
        
        // Call your API to create or update user in your database
        const response = await fetch('/api/user/sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        });
        
        if (!response.ok) {
          throw new Error('Failed to sync user data');
        }
        
        const data = await response.json();
        setDbUser(data.user);
      } catch (err) {
        console.error('Error syncing user:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    syncUserWithDatabase();
  }, [isLoaded, isSignedIn, user]);
  
  return {
    user: dbUser,
    clerkUser: user,
    loading,
    error,
    isLoaded,
    isSignedIn
  };
}