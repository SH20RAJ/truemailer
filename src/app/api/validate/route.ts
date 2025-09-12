import { NextRequest, NextResponse } from 'next/server';

// Cache for disposable domains and allowlist
let disposableDomains: Set<string> = new Set();
let allowedDomains: Set<string> = new Set();
let lastFetch = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

async function fetchDisposableDomains(): Promise<Set<string>> {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf',
            {
                headers: {
                    'User-Agent': 'TrueMailer-API/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch disposable domains: ${response.status}`);
        }

        const text = await response.text();
        const domains = new Set(
            text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(domain => domain.toLowerCase())
        );

        console.log(`Loaded ${domains.size} disposable domains`);
        return domains;
    } catch (error) {
        console.error('Error fetching disposable domains:', error);
        return new Set();
    }
}

async function fetchAllowedDomains(): Promise<Set<string>> {
    try {
        const response = await fetch(
            'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/allowlist.conf',
            {
                headers: {
                    'User-Agent': 'TrueMailer-API/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch allowed domains: ${response.status}`);
        }

        const text = await response.text();
        const domains = new Set(
            text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'))
                .map(domain => domain.toLowerCase())
        );

        console.log(`Loaded ${domains.size} allowed domains`);
        return domains;
    } catch (error) {
        console.error('Error fetching allowed domains:', error);
        return new Set();
    }
}

async function updateDomainLists(): Promise<void> {
    const now = Date.now();

    // Check if we need to refresh the cache
    if (now - lastFetch < CACHE_DURATION && disposableDomains.size > 0) {
        return;
    }

    console.log('Updating domain lists from GitHub...');

    try {
        const [newDisposableDomains, newAllowedDomains] = await Promise.all([
            fetchDisposableDomains(),
            fetchAllowedDomains()
        ]);

        disposableDomains = newDisposableDomains;
        allowedDomains = newAllowedDomains;
        lastFetch = now;

        console.log('Domain lists updated successfully');
    } catch (error) {
        console.error('Failed to update domain lists:', error);
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

async function checkMXRecord(domain: string): Promise<boolean> {
    try {
        // In a real implementation, you would use DNS lookup
        // For now, we'll simulate this check
        // You can implement actual DNS lookup using a service or library
        return true; // Placeholder
    } catch (error) {
        return false;
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { error: 'Email parameter is required' },
                { status: 400 }
            );
        }

        // Update domain lists if needed
        await updateDomainLists();

        // Basic validation
        const isValidFormat = isValidEmailFormat(email);
        if (!isValidFormat) {
            return NextResponse.json({
                email,
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
            });
        }

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

        // Determine if email is valid
        const isValid = !isDisposable && isValidFormat && confidenceScore > 0.5;

        // Determine risk level
        let riskLevel = 'low';
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

        const response = {
            email,
            domain,
            valid: isValid,
            valid_syntax: isValidFormat,
            mx_found: mxFound,
            disposable: isDisposable,
            role_based: isRoleBased,
            spammy: isDisposable, // Consider disposable emails as spammy
            allowed_list: isAllowed,
            confidence_score: Math.round(confidenceScore * 100) / 100,
            risk_level: riskLevel,
            suggestions,
            timestamp: new Date().toISOString(),
            cache_info: {
                disposable_domains_count: disposableDomains.size,
                allowed_domains_count: allowedDomains.size,
                last_updated: new Date(lastFetch).toISOString()
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Validation error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required in request body' },
                { status: 400 }
            );
        }

        // Reuse the GET logic for POST requests
        const url = new URL(request.url);
        url.searchParams.set('email', email);

        const getRequest = new NextRequest(url);
        return await GET(getRequest);

    } catch (error) {
        console.error('POST validation error:', error);
        return NextResponse.json(
            { error: 'Invalid request body' },
            { status: 400 }
        );
    }
}