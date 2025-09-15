import { NextRequest } from 'next/server'
import { validateApiKey, createApiResponse, createApiError } from '@/lib/api-middleware'
import { AnalyticsService, PersonalListService } from '@/lib/db'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let originalBody = ''
  
  // Validate API key
  const { valid, context, error } = await validateApiKey(request)
  if (!valid) {
    return createApiError(error || 'Authentication failed', 401)
  }

  try {
    const body = await request.json() as { email?: string }
    originalBody = JSON.stringify(body)
    const { email } = body

    if (!email) {
      return createApiError('Email is required', 400)
    }

    if (typeof email !== 'string') {
      return createApiError('Email must be a string', 400)
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      const result = {
        email,
        valid: false,
        syntax_valid: false,
        disposable: null,
        role_based: null,
        mx_records: null,
        reason: 'Invalid email syntax'
      }

      // Log usage
      await logApiUsage(context!, request, 200, Date.now() - startTime, result, originalBody)
      
      return createApiResponse(result)
    }

    // Extract domain
    const domain = email.split('@')[1].toLowerCase()

    // Check for common disposable domains
    const disposableDomains = [
      '10minutemail.com', 'temp-mail.org', 'guerrillamail.com', 
      'mailinator.com', 'throwaway.email', 'tempmail.com'
    ]
    const isDisposable = disposableDomains.includes(domain)

    // Check for role-based emails
    const rolePrefixes = ['admin', 'support', 'help', 'info', 'contact', 'sales', 'noreply', 'no-reply']
    const localPart = email.split('@')[0].toLowerCase()
    const isRoleBased = rolePrefixes.some(prefix => localPart.includes(prefix))

    // Simple MX record check (in production, you'd do actual DNS lookup)
    const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'icloud.com']
    const hasMxRecords = commonDomains.includes(domain) || !isDisposable

    // Check personal blocklist/whitelist
    const personalListService = new PersonalListService()
    const personalValidation = await personalListService.getPersonalValidation(context!.userId, email)
    
    // Apply personal validation logic
    let finalValid = !isDisposable && hasMxRecords
    let finalReason = isDisposable ? 'Disposable email detected' : 
                      !hasMxRecords ? 'No MX records found' : 
                      'Valid email'
    
    // Personal whitelist overrides all other validations
    if (personalValidation.isWhitelisted) {
      finalValid = true
      finalReason = 'Whitelisted by user'
    }
    // Personal blocklist overrides regular validation (but not whitelist)
    else if (personalValidation.isBlocked) {
      finalValid = false
      finalReason = 'Blocked by user'
    }

    const result = {
      email,
      valid: finalValid,
      syntax_valid: true,
      disposable: isDisposable,
      role_based: isRoleBased,
      mx_records: hasMxRecords,
      personal_override: personalValidation.personalOverride,
      reason: finalReason
    }

    // Log usage
    await logApiUsage(context!, request, 200, Date.now() - startTime, result, originalBody)

    return createApiResponse(result)

  } catch (error) {
    console.error('Email validation error:', error)
    
    // Log failed usage
    await logApiUsage(context!, request, 500, Date.now() - startTime, { error: 'Internal server error' }, originalBody)
    
    return createApiError('Internal server error', 500)
  }
}

async function logApiUsage(
  context: { userId: string; keyId: string }, 
  request: NextRequest, 
  statusCode: number, 
  responseTime: number, 
  result: Record<string, unknown>,
  originalBody?: string
) {
  try {
    const analyticsService = new AnalyticsService()
    
    // Get request info
    const userAgent = request.headers.get('user-agent') || undefined
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     undefined

    // Estimate sizes (simplified)
    const requestSize = originalBody ? originalBody.length : 0
    const responseSize = JSON.stringify(result).length

    await analyticsService.logApiUsage({
      apiKeyId: context.keyId,
      userId: context.userId,
      endpoint: '/api/v2/validate',
      method: 'POST',
      statusCode,
      responseTime,
      ipAddress,
      userAgent,
      requestSize,
      responseSize
    })
  } catch (error) {
    console.error('Failed to log API usage:', error)
    // Don't fail the main request if logging fails
  }
}