import { NextRequest } from 'next/server'
import { validateApiKey, createApiResponse, createApiError } from '@/lib/api-middleware'
import { AnalyticsService, PersonalListService } from '@/lib/db'
import { fetchDisposableDomains, fetchAllowlistDomains } from '@/lib/domain-fetcher'

// Cache for disposable domains and allowlist
let disposableDomains: Set<string> = new Set();
let allowedDomains: Set<string> = new Set();
let lastFetch = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function updateDomainLists(): Promise<void> {
  const now = Date.now();

  // Check if we need to refresh the cache
  if (now - lastFetch < CACHE_DURATION && disposableDomains.size > 0) {
    return;
  }

  console.log('Updating domain lists with fallback support...');

  try {
    const [disposableList, allowlistList] = await Promise.all([
      fetchDisposableDomains({ timeout: 15000, retries: 2 }),
      fetchAllowlistDomains({ timeout: 15000, retries: 2 })
    ]);

    disposableDomains = new Set(disposableList.map(domain => domain.toLowerCase()));
    allowedDomains = new Set(allowlistList.map(domain => domain.toLowerCase()));
    lastFetch = now;

    console.log(`Domain lists updated successfully: ${disposableDomains.size} disposable, ${allowedDomains.size} allowed`);
  } catch (error) {
    console.error('Failed to update domain lists:', error);

    // If we have no cached data and fetch failed, use minimal fallback
    if (disposableDomains.size === 0) {
      console.log('No cached data available, using minimal fallback list');
      disposableDomains = new Set([
        '10minutemail.com', 'temp-mail.org', 'guerrillamail.com',
        'mailinator.com', 'throwaway.email', 'tempmail.net'
      ]);
    }
  }
}

function extractDomain(email: string): string {
  const parts = email.toLowerCase().split('@');
  return parts.length === 2 ? parts[1] : '';
}

function isValidEmailFormat(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isRoleBasedEmail(email: string): boolean {
  const roleBasedPrefixes = [
    'admin', 'administrator', 'support', 'help', 'info', 'contact',
    'sales', 'marketing', 'noreply', 'no-reply', 'postmaster',
    'webmaster', 'hostmaster', 'abuse', 'security', 'privacy',
    'legal', 'billing', 'accounts', 'hr', 'jobs', 'careers'
  ];

  const localPart = email.split('@')[0].toLowerCase();
  return roleBasedPrefixes.some(prefix =>
    localPart === prefix ||
    localPart.startsWith(prefix + '.') ||
    localPart.startsWith(prefix + '+') ||
    localPart.startsWith(prefix + '-')
  );
}

async function checkMXRecord(_domain: string): Promise<boolean> {
  try {
    // In a real implementation, you would use DNS lookup
    // For now, we'll simulate this check
    // You can implement actual DNS lookup using a service or library
    return true; // Placeholder
  } catch {
    return false;
  }
}

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

    // Update domain lists if needed
    await updateDomainLists();

    // Basic email validation
    const isValidFormat = isValidEmailFormat(email);
    if (!isValidFormat) {
      const result = {
        email,
        domain: extractDomain(email),
        valid: false,
        syntax_valid: false,
        disposable: false,
        role_based: false,
        mx_records: false,
        spammy: false,
        allowed_list: false,
        confidence_score: 0,
        risk_level: 'high' as const,
        suggestions: ['Invalid email format'],
        personal_override: false,
        reason: 'Invalid email syntax',
        timestamp: new Date().toISOString(),
        cache_info: {
          disposable_domains_count: disposableDomains.size,
          allowed_domains_count: allowedDomains.size,
          last_updated: new Date(lastFetch).toISOString()
        }
      }

      // Log usage
      await logApiUsage(context!, request, 200, Date.now() - startTime, result, originalBody)
      
      return createApiResponse(result)
    }

    // Extract domain
    const domain = extractDomain(email);
    const isDisposable = disposableDomains.has(domain);
    const isAllowed = allowedDomains.has(domain);
    const isRoleBased = isRoleBasedEmail(email);
    const mxFound = await checkMXRecord(domain);

    // Calculate confidence score
    let confidenceScore = 0.5; // Base score

    if (isAllowed) {
      confidenceScore += 0.4;
    } else if (isDisposable) {
      confidenceScore -= 0.4;
    }

    if (mxFound) {
      confidenceScore += 0.2;
    } else {
      confidenceScore -= 0.3;
    }

    if (isRoleBased) {
      confidenceScore -= 0.1;
    }

    confidenceScore = Math.max(0, Math.min(1, confidenceScore));

    // Determine if email is valid based on original logic
    const isValid = !isDisposable && isValidFormat && confidenceScore > 0.5;

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (isDisposable || confidenceScore < 0.3) {
      riskLevel = 'high';
    } else if (confidenceScore < 0.6) {
      riskLevel = 'medium';
    }

    // Generate suggestions
    const suggestions: string[] = [];
    if (isDisposable) {
      suggestions.push('This domain is known for providing temporary/disposable email addresses');
    }
    if (isRoleBased) {
      suggestions.push('This appears to be a role-based email address');
    }
    if (!mxFound) {
      suggestions.push('No MX records found for this domain');
    }
    if (isAllowed) {
      suggestions.push('This domain is on the trusted allowlist');
    }

    // Check personal blocklist/whitelist
    const personalListService = new PersonalListService()
    const personalValidation = await personalListService.getPersonalValidation(context!.userId, email)
    
    // Apply personal validation logic
    let finalValid = isValid
    let finalReason = isDisposable ? 'Disposable email detected' : 
                      !mxFound ? 'No MX records found' : 
                      confidenceScore <= 0.5 ? 'Low confidence score' :
                      'Valid email'
    
    // Personal whitelist overrides all other validations
    if (personalValidation.isWhitelisted) {
      finalValid = true
      finalReason = 'Whitelisted by user'
      if (!suggestions.includes('This email is whitelisted by user')) {
        suggestions.unshift('This email is whitelisted by user');
      }
    }
    // Personal blocklist overrides regular validation (but not whitelist)
    else if (personalValidation.isBlocked) {
      finalValid = false
      finalReason = 'Blocked by user'
      if (!suggestions.includes('This email is blocked by user')) {
        suggestions.unshift('This email is blocked by user');
      }
    }

    const result = {
      email,
      domain,
      valid: finalValid,
      syntax_valid: isValidFormat,
      disposable: isDisposable,
      role_based: isRoleBased,
      mx_records: mxFound,
      spammy: isDisposable, // Consider disposable emails as spammy
      allowed_list: isAllowed,
      confidence_score: Math.round(confidenceScore * 100) / 100,
      risk_level: riskLevel,
      suggestions,
      personal_override: personalValidation.personalOverride,
      reason: finalReason,
      timestamp: new Date().toISOString(),
      cache_info: {
        disposable_domains_count: disposableDomains.size,
        allowed_domains_count: allowedDomains.size,
        last_updated: new Date(lastFetch).toISOString()
      }
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