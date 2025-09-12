import { NextRequest, NextResponse } from 'next/server';

// Import the validation logic from the main validate route
// We'll create a shared validation function

interface ValidationResult {
    email: string;
    domain: string;
    valid: boolean;
    valid_syntax: boolean;
    mx_found: boolean;
    disposable: boolean;
    role_based: boolean;
    spammy: boolean;
    allowed_list: boolean;
    confidence_score: number;
    risk_level: string;
    suggestions: string[];
}

// Cache for disposable domains and allowlist (shared with main validate route)
let disposableDomains: Set<string> = new Set();
let allowedDomains: Set<string> = new Set();
let lastFetch = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

async function fetchDisposableDomains(): Promise<Set<string>> {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf',
            { headers: { 'User-Agent': 'TrueMailer-API/1.0' } }
        );

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const text = await response.text();
        return new Set(
            text.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(domain => domain.toLowerCase())
        );
    } catch (error) {
        console.error('Error fetching disposable domains:', error);
        return new Set();
    }
}

async function fetchAllowedDomains(): Promise<Set<string>> {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/allowlist.conf',
            { headers: { 'User-Agent': 'TrueMailer-API/1.0' } }
        );

        if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

        const text = await response.text();
        return new Set(
            text.split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(domain => domain.toLowerCase())
        );
    } catch (error) {
        console.error('Error fetching allowed domains:', error);
        return new Set();
    }
}

async function updateDomainLists(): Promise<void> {
    const now = Date.now();
    if (now - lastFetch < CACHE_DURATION && disposableDomains.size > 0) return;

    try {
        const [newDisposableDomains, newAllowedDomains] = await Promise.all([
            fetchDisposableDomains(),
            fetchAllowedDomains()
        ]);

        disposableDomains = newDisposableDomains;
        allowedDomains = newAllowedDomains;
        lastFetch = now;
    } catch (error) {
        console.error('Failed to update domain lists:', error);
    }
}

function validateSingleEmail(email: string): ValidationResult {
    const isValidFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const domain = email.toLowerCase().split('@')[1] || '';

    if (!isValidFormat) {
        return {
            email,
            domain,
            valid: false,
            valid_syntax: false,
            mx_found: false,
            disposable: false,
            role_based: false,
            spammy: false,
            allowed_list: false,
            confidence_score: 0,
            risk_level: 'high',
            suggestions: ['Invalid email format']
        };
    }

    const isDisposable = disposableDomains.has(domain);
    const isAllowed = allowedDomains.has(domain);

    // Role-based email check
    const roleBasedPrefixes = [
        'admin', 'administrator', 'support', 'help', 'info', 'contact',
        'sales', 'marketing', 'noreply', 'no-reply', 'postmaster'
    ];
    const localPart = email.split('@')[0].toLowerCase();
    const isRoleBased = roleBasedPrefixes.some(prefix =>
        localPart === prefix || localPart.startsWith(prefix + '.')
    );

    // Calculate confidence score
    let confidenceScore = 0.5;
    if (isAllowed) confidenceScore += 0.4;
    else if (isDisposable) confidenceScore -= 0.4;
    if (isRoleBased) confidenceScore -= 0.1;

    confidenceScore = Math.max(0, Math.min(1, confidenceScore));

    const isValid = !isDisposable && isValidFormat && confidenceScore > 0.5;

    let riskLevel = 'low';
    if (isDisposable || confidenceScore < 0.3) riskLevel = 'high';
    else if (confidenceScore < 0.6) riskLevel = 'medium';

    const suggestions: string[] = [];
    if (isDisposable) suggestions.push('Disposable/temporary email domain');
    if (isRoleBased) suggestions.push('Role-based email address');
    if (isAllowed) suggestions.push('Domain is on trusted allowlist');

    return {
        email,
        domain,
        valid: isValid,
        valid_syntax: isValidFormat,
        mx_found: true, // Placeholder
        disposable: isDisposable,
        role_based: isRoleBased,
        spammy: isDisposable,
        allowed_list: isAllowed,
        confidence_score: Math.round(confidenceScore * 100) / 100,
        risk_level: riskLevel,
        suggestions
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { emails } = body as { emails: string[] };

        if (!emails || !Array.isArray(emails)) {
            return NextResponse.json(
                { error: 'emails array is required in request body' },
                { status: 400 }
            );
        }

        if (emails.length > 100) {
            return NextResponse.json(
                { error: 'Maximum 100 emails allowed per batch request' },
                { status: 400 }
            );
        }

        // Update domain lists if needed
        await updateDomainLists();

        // Validate all emails
        const results = emails.map(email => {
            if (typeof email !== 'string') {
                return {
                    email: String(email),
                    domain: '',
                    valid: false,
                    valid_syntax: false,
                    mx_found: false,
                    disposable: false,
                    role_based: false,
                    spammy: false,
                    allowed_list: false,
                    confidence_score: 0,
                    risk_level: 'high',
                    suggestions: ['Email must be a string'],
                    error: 'Email must be a string'
                };
            }
            return validateSingleEmail(email);
        });

        // Calculate summary statistics
        const summary = {
            total: results.length,
            valid: results.filter(r => r.valid).length,
            invalid: results.filter(r => !r.valid).length,
            disposable: results.filter(r => 'disposable' in r && r.disposable).length,
            role_based: results.filter(r => 'role_based' in r && r.role_based).length,
            allowed_list: results.filter(r => 'allowed_list' in r && r.allowed_list).length,
            high_risk: results.filter(r => 'risk_level' in r && r.risk_level === 'high').length,
            medium_risk: results.filter(r => 'risk_level' in r && r.risk_level === 'medium').length,
            low_risk: results.filter(r => 'risk_level' in r && r.risk_level === 'low').length
        };

        const response = {
            success: true,
            summary,
            results,
            processed_at: new Date().toISOString(),
            cache_info: {
                disposable_domains_count: disposableDomains.size,
                allowed_domains_count: allowedDomains.size,
                last_updated: new Date(lastFetch).toISOString()
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Batch validation error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to process batch validation',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST method for batch email validation',
        usage: {
            method: 'POST',
            endpoint: '/api/validate-batch',
            body: {
                emails: ['email1@example.com', 'email2@temp-mail.org', 'email3@gmail.com']
            },
            limits: {
                max_emails_per_request: 100,
                rate_limit: 'No rate limit currently applied'
            }
        },
        example_response: {
            success: true,
            summary: {
                total: 3,
                valid: 2,
                invalid: 1,
                disposable: 1,
                role_based: 0,
                allowed_list: 1
            },
            results: '...'
        }
    });
}