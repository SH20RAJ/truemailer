import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client/web'

export async function POST() {
  try {
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!
    })

    console.log('Creating API keys table...')
    await client.execute(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id text PRIMARY KEY NOT NULL,
        user_id text NOT NULL,
        key_hash text NOT NULL,
        name text NOT NULL,
        is_active integer DEFAULT 1,
        monthly_quota integer DEFAULT 5000,
        current_usage integer DEFAULT 0,
        last_usage_reset integer NOT NULL,
        created_at integer NOT NULL,
        last_used_at integer,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    console.log('Creating API usage table...')
    await client.execute(`
      CREATE TABLE IF NOT EXISTS api_usage (
        id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
        api_key_id text NOT NULL,
        user_id text NOT NULL,
        endpoint text NOT NULL,
        method text NOT NULL,
        status_code integer NOT NULL,
        response_time integer,
        ip_address text,
        user_agent text,
        request_size integer,
        response_size integer,
        timestamp integer NOT NULL,
        FOREIGN KEY (api_key_id) REFERENCES api_keys(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    return NextResponse.json({ 
      message: 'API tables created successfully!' 
    })
  } catch (error) {
    console.error('Migration failed:', error)
    return NextResponse.json(
      { error: 'Migration failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
