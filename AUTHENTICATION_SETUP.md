# TrueMailer Authentication Setup Guide

This guide will help you set up StackAuth with D1 database integration for user management.

## Prerequisites

1. **Cloudflare Account** with access to D1 databases
2. **StackAuth Account** - Sign up at [stack-auth.com](https://stack-auth.com)
3. **Wrangler CLI** installed globally

## Setup Steps

### 1. Install Dependencies

```bash
npm install drizzle-orm drizzle-kit @stackframe/stack
```

### 2. Create D1 Database

The database `truemailer-db` is already created. You can verify it with:

```bash
wrangler d1 list
```

### 3. Configure Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` with your actual values:

```env
# Cloudflare D1 Database Configuration
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id_here
CLOUDFLARE_DATABASE_ID=60ac43db-bf3a-4691-8bda-8aaac1f30f9b
CLOUDFLARE_D1_TOKEN=your_cloudflare_api_token_here

# StackAuth Configuration
NEXT_PUBLIC_STACK_PROJECT_ID=your_stack_project_id_here
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=your_stack_publishable_client_key_here
STACK_SECRET_SERVER_KEY=your_stack_secret_server_key_here

# Next.js Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
```

### 4. Generate Database Schema

Generate and apply database migrations:

```bash
npm run db:generate
npm run db:migrate
```

For production, also apply to remote database:

```bash
wrangler d1 migrations apply truemailer-db --remote
```

### 5. Set Up StackAuth

1. Create a new project in StackAuth dashboard
2. Configure your authentication settings
3. Add your domain to allowed origins
4. Copy the API keys to your `.dev.vars` file

### 6. Configure Cloudflare Secrets (Production)

For production deployment, set secrets using Wrangler:

```bash
wrangler secret put STACK_SECRET_SERVER_KEY
wrangler secret put CLOUDFLARE_D1_TOKEN
# Add other secrets as needed
```

## Database Schema

The database includes two main tables:

### Users Table
- `id` (text, primary key) - StackAuth user ID
- `email` (text, unique) - User email
- `display_name` (text) - User display name
- `profile_image_url` (text) - Profile image URL
- `primary_email` (text) - Primary email from StackAuth
- `primary_email_verified` (boolean) - Email verification status
- `client_metadata` (json) - Client-side metadata
- `server_metadata` (json) - Server-side metadata
- `created_at` (timestamp) - Record creation time
- `updated_at` (timestamp) - Last update time

### Sessions Table
- `id` (text, primary key) - Session ID
- `user_id` (text, foreign key) - Reference to users table
- `expires_at` (timestamp) - Session expiration
- `created_at` (timestamp) - Session creation time

## Usage

### Authentication Buttons

Use the `AuthButtons` component in your pages:

```tsx
import { AuthButtons } from \"@/components/auth-buttons\";

export default function MyPage() {
  return (
    <div>
      <AuthButtons />
    </div>
  );
}
```

### User Data Sync

The `/api/auth/sync-user` endpoint automatically syncs StackAuth user data to your D1 database:

```typescript
// POST /api/auth/sync-user - Create/update user in database
// GET /api/auth/sync-user - Fetch user from database
```

### Database Operations

Use the `UserService` class for database operations:

```typescript
import { UserService } from \"@/lib/db\";

const userService = new UserService(env);
const user = await userService.getUserById(\"user_123\");
```

## Testing

Visit `/test-auth` to test the authentication flow and database integration.

## Available Scripts

- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Apply migrations locally
- `npm run db:push` - Push schema changes directly
- `npm run db:studio` - Open Drizzle Studio

## Authentication Flows

### Sign Up Flow
1. User clicks \"Sign Up\" button
2. Redirected to StackAuth sign-up page
3. After successful registration, user is redirected back
4. User data is automatically synced to D1 database via API

### Sign In Flow
1. User clicks \"Sign In\" button
2. Redirected to StackAuth sign-in page
3. After successful authentication, user is redirected back
4. User data is fetched/updated in D1 database

### Handler Routes

StackAuth handles authentication routes automatically:
- `/handler/sign-in` - Sign in page
- `/handler/sign-up` - Sign up page
- `/handler/sign-out` - Sign out handler
- And other authentication-related routes

## Security Notes

1. Never expose `STACK_SECRET_SERVER_KEY` in client-side code
2. Use Cloudflare Workers secrets for production secrets
3. Keep your `.dev.vars` file in `.gitignore`
4. Regularly rotate your API keys
5. Set up proper CORS and domain restrictions in StackAuth

## Troubleshooting

### Common Issues

1. **Database not found**: Make sure the database ID in `wrangler.jsonc` matches your actual D1 database
2. **Authentication not working**: Check that all StackAuth environment variables are correctly set
3. **Migration errors**: Ensure the `drizzle` directory exists and has proper permissions

For more help, check the logs and ensure all environment variables are properly configured."