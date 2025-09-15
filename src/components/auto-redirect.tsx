"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AutoRedirect() {
  const user = useUser();
  const router = useRouter();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    if (user && !hasRedirected) {
      // User just logged in, sync them to database and redirect
      const syncAndRedirect = async () => {
        try {
          const response = await fetch('/api/auth/sync-user', {
            method: 'POST',
          });
          
          if (response.ok) {
            console.log('User synced successfully');
            setHasRedirected(true);
            // Only redirect if we're not already on the dashboard
            if (window.location.pathname !== '/dashboard') {
              router.push('/dashboard');
            }
          } else {
            console.error('Failed to sync user');
          }
        } catch (error) {
          console.error('Error syncing user:', error);
        }
      };

      syncAndRedirect();
    }
  }, [user, router, hasRedirected]);

  return null; // This component doesn't render anything
}