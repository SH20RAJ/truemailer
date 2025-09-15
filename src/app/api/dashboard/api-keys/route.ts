import { NextRequest, NextResponse } from 'next/server'
import { stackServerApp } from '@/stack'
import { ApiKeyService } from '@/lib/db'

export async function GET() {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeyService = new ApiKeyService()
    const apiKeys = await apiKeyService.getUserApiKeys(user.id)
    
    // Transform for client response (hide sensitive data)
    const clientApiKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      keyPreview: `${key.id.substring(0, 8)}...`,
      isActive: Boolean(key.isActive),
      monthlyQuota: key.monthlyQuota || 0,
      currentUsage: key.currentUsage || 0,
      createdAt: new Date(key.createdAt).toISOString(),
      lastUsedAt: key.lastUsedAt ? new Date(key.lastUsedAt).toISOString() : undefined
    }))

    return NextResponse.json({ apiKeys: clientApiKeys })
  } catch (error) {
    console.error('Failed to fetch API keys:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API keys' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json() as { name: string; monthlyQuota?: number }
    const { name, monthlyQuota = 5000 } = body

    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'API key name is required' },
        { status: 400 }
      )
    }

    const apiKeyService = new ApiKeyService()
    const result = await apiKeyService.createApiKey(user.id, name.trim(), monthlyQuota)
    
    return NextResponse.json({
      message: 'API key created successfully',
      secretKey: result.secretKey,
      apiKey: {
        id: result.apiKey.id,
        name: result.apiKey.name,
        monthlyQuota: result.apiKey.monthlyQuota
      }
    })
  } catch (error) {
    console.error('Failed to create API key:', error)
    return NextResponse.json(
      { error: 'Failed to create API key' },
      { status: 500 }
    )
  }
}