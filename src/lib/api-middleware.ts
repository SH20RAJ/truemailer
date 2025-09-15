import { NextRequest, NextResponse } from 'next/server'
import { ApiKeyService } from '@/lib/db'

export interface ApiKeyContext {
  apiKey: string
  userId: string
  keyId: string
  remainingQuota: number
}

export async function validateApiKey(request: NextRequest): Promise<{ valid: boolean; context?: ApiKeyContext; error?: string }> {
  try {
    // Get API key from headers
    const apiKey = request.headers.get('x-api-key') || request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!apiKey) {
      return { valid: false, error: 'API key required' }
    }

    // Validate API key
    const apiKeyService = new ApiKeyService()
    const keyData = await apiKeyService.verifyApiKey(apiKey)
    
    if (!keyData) {
      return { valid: false, error: 'Invalid API key' }
    }

    if (!keyData.isActive) {
      return { valid: false, error: 'API key is disabled' }
    }

    // Check quota
    const remainingQuota = (keyData.monthlyQuota || 0) - (keyData.currentUsage || 0)
    if (remainingQuota <= 0) {
      return { valid: false, error: 'Monthly quota exceeded' }
    }

    return {
      valid: true,
      context: {
        apiKey,
        userId: keyData.userId,
        keyId: keyData.id,
        remainingQuota
      }
    }
  } catch (error) {
    console.error('API key validation error:', error)
    return { valid: false, error: 'Authentication failed' }
  }
}

export function createApiResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { 
    status,
    headers: {
      'Content-Type': 'application/json',
      'X-RateLimit-Remaining': '0', // Will be updated by usage tracking
    }
  })
}

export function createApiError(message: string, status = 400) {
  return NextResponse.json(
    { error: message, timestamp: new Date().toISOString() },
    { status }
  )
}