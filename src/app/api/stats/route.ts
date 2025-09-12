import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Fetch current data from GitHub to get real-time stats
        const [disposableResponse, allowlistResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf', {
                headers: { 'User-Agent': 'TrueMailer-API/1.0' }
            }),
            fetch('https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/allowlist.conf', {
                headers: { 'User-Agent': 'TrueMailer-API/1.0' }
            })
        ]);

        let disposableCount = 0;
        let allowedCount = 0;
        let sampleDisposable: string[] = [];
        let sampleAllowed: string[] = [];

        if (disposableResponse.ok) {
            const disposableText = await disposableResponse.text();
            const disposableDomains = disposableText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            disposableCount = disposableDomains.length;
            sampleDisposable = disposableDomains.slice(0, 20);
        }

        if (allowlistResponse.ok) {
            const allowlistText = await allowlistResponse.text();
            const allowedDomains = allowlistText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.startsWith('#'));

            allowedCount = allowedDomains.length;
            sampleAllowed = allowedDomains.slice(0, 20);
        }

        const response = {
            success: true,
            stats: {
                disposable_domains: {
                    count: disposableCount,
                    source: 'https://github.com/disposable-email-domains/disposable-email-domains',
                    sample: sampleDisposable
                },
                allowed_domains: {
                    count: allowedCount,
                    source: 'https://github.com/disposable-email-domains/disposable-email-domains',
                    sample: sampleAllowed
                },
                total_domains: disposableCount + allowedCount,
                last_checked: new Date().toISOString()
            },
            api_info: {
                validation_endpoint: '/api/validate?email=example@domain.com',
                supported_methods: ['GET', 'POST'],
                rate_limit: 'No rate limit currently applied',
                cache_duration: '24 hours'
            }
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Stats error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch domain statistics',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}