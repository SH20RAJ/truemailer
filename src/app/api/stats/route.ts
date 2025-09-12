import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Import the domain fetcher utility
        const { fetchDisposableDomains, fetchAllowlistDomains } = await import('@/lib/domain-fetcher');

        let disposableCount = 0;
        let allowedCount = 0;
        let sampleDisposable: string[] = [];
        let sampleAllowed: string[] = [];
        let fetchSource = 'Unknown';

        try {
            // Fetch current data with fallback support
            const [disposableDomains, allowedDomains] = await Promise.all([
                fetchDisposableDomains({ timeout: 15000, retries: 2 }),
                fetchAllowlistDomains({ timeout: 15000, retries: 2 })
            ]);

            disposableCount = disposableDomains.length;
            allowedCount = allowedDomains.length;
            sampleDisposable = disposableDomains.slice(0, 20);
            sampleAllowed = allowedDomains.slice(0, 20);
            fetchSource = 'GitHub with jsDelivr fallback';
        } catch (error) {
            console.warn('Failed to fetch domain stats, using fallback data:', error);
            // Provide minimal stats if fetch fails
            disposableCount = 12000; // Approximate count
            allowedCount = 100; // Approximate count
            sampleDisposable = ['10minutemail.com', 'temp-mail.org', 'guerrillamail.com'];
            sampleAllowed = ['gmail.com', 'outlook.com', 'yahoo.com'];
            fetchSource = 'Fallback data (fetch failed)';
        }

        const response = {
            success: true,
            stats: {
                disposable_domains: {
                    count: disposableCount,
                    source: fetchSource,
                    primary_source: 'https://github.com/disposable-email-domains/disposable-email-domains',
                    fallback_source: 'https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@latest/',
                    sample: sampleDisposable
                },
                allowed_domains: {
                    count: allowedCount,
                    source: fetchSource,
                    primary_source: 'https://github.com/disposable-email-domains/disposable-email-domains',
                    fallback_source: 'https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@latest/',
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