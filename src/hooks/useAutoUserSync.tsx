"use client";

import { useUser } from "@stackframe/stack";
import { useEffect, useRef } from "react";

// Custom hook to automatically sync users to database when they login
export function useAutoUserSync() {
  const user = useUser();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!user || syncedRef.current === user.id) {
        return; // User not logged in or already synced
      }

      try {
        console.log('[AUTO SYNC] Syncing user to database:', user.id);
        
        const response = await fetch('/api/auth/sync-user', {
          method: 'POST',
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('[AUTO SYNC] User synced successfully:', data);
          syncedRef.current = user.id; // Mark this user as synced
        } else {
          console.warn('[AUTO SYNC] Failed to sync user:', await response.text());
        }
      } catch (error) {
        console.error('[AUTO SYNC] Error syncing user:', error);
      }
    };

    syncUser();
  }, [user]); // Trigger when user changes (login/logout)

  return { user, synced: syncedRef.current === user?.id };
}
