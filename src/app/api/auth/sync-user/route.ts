import { NextRequest } from 'next/server';
import { stackServerApp } from '@/stack';
import { UserService } from '@/lib/db';

// Simple logging for development
function log(message: string, data?: unknown) {
  console.log(`[AUTH API] ${message}`, data ? JSON.stringify(data, null, 2) : '');
}

export async function POST(request: NextRequest) {
  try {
    log('POST /api/auth/sync-user - Starting user sync');
    
    // Get the current user from StackAuth
    const user = await stackServerApp.getUser();
    
    if (!user) {
      log('No authenticated user found');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log('User found from StackAuth', {
      id: user.id,
      email: user.primaryEmail,
      displayName: user.displayName
    });

    try {
      // Initialize database service
      const userService = new UserService();
      
      // Sync user data to database
      const dbUser = await userService.upsertUser({
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || undefined,
        profileImageUrl: user.profileImageUrl || undefined,
        primaryEmail: user.primaryEmail || undefined,
        primaryEmailVerified: user.primaryEmailVerified || false,
        clientMetadata: user.clientMetadata || undefined,
        serverMetadata: user.serverMetadata || undefined,
      });

      log('User synced to database', dbUser);
      return Response.json({ success: true, user: dbUser });
    } catch (dbError) {
      log('Database error, returning mock data', dbError);
      
      // Return mock data if database is not available
      const userData = {
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || null,
        profileImageUrl: user.profileImageUrl || null,
        primaryEmail: user.primaryEmail || null,
        primaryEmailVerified: user.primaryEmailVerified || false,
        clientMetadata: user.clientMetadata || null,
        serverMetadata: user.serverMetadata || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return Response.json({ success: true, user: userData, note: 'Using mock data - database not available' });
    }
  } catch (error) {
    log('Error in POST /api/auth/sync-user', error);
    console.error('Error syncing user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    log('GET /api/auth/sync-user - Fetching user data');
    
    // Get the current user from StackAuth
    const user = await stackServerApp.getUser();
    
    if (!user) {
      log('No authenticated user found');
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    log('User found from StackAuth', {
      id: user.id,
      email: user.primaryEmail
    });

    try {
      // Initialize database service
      const userService = new UserService();
      const dbUser = await userService.getUserById(user.id);

      if (dbUser) {
        log('Found user in database', dbUser);
        return Response.json({ user: dbUser });
      } else {
        log('User not found in database, returning StackAuth data');
        // Return StackAuth data if not in database
        const userData = {
          id: user.id,
          email: user.primaryEmail || '',
          displayName: user.displayName || null,
          profileImageUrl: user.profileImageUrl || null,
          primaryEmail: user.primaryEmail || null,
          primaryEmailVerified: user.primaryEmailVerified || false,
          clientMetadata: user.clientMetadata || null,
          serverMetadata: user.serverMetadata || null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        return Response.json({ user: userData, note: 'User not yet synced to database' });
      }
    } catch (dbError) {
      log('Database error, returning StackAuth data', dbError);
      
      // Return StackAuth data if database is not available
      const userData = {
        id: user.id,
        email: user.primaryEmail || '',
        displayName: user.displayName || null,
        profileImageUrl: user.profileImageUrl || null,
        primaryEmail: user.primaryEmail || null,
        primaryEmailVerified: user.primaryEmailVerified || false,
        clientMetadata: user.clientMetadata || null,
        serverMetadata: user.serverMetadata || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      return Response.json({ user: userData, note: 'Using StackAuth data - database not available' });
    }
  } catch (error) {
    log('Error in GET /api/auth/sync-user', error);
    console.error('Error fetching user:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}