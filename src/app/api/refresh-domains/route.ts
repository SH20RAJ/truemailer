import { NextRequest, NextResponse } from 'next/server';

// This endpoint allows manual refresh of domain lists
export async function POST(request: NextRequest) {
    try {
        // You might want to add authentication here in production
        const authHeader = request.headers.get('authorization');

        // Simple API key check (in production, use proper authentication)
        if (authHeader !== 'Bearer your-secret-api-key') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        console.log('Manual domain list refresh requested');

        // Import the domain fetcher utility
        const { fetchDisposableDomains, fetchAllowlistDomains } = await import('@/lib/domain-fetcher');

        // Fetch fresh data with fallback support
        const [disposableDomains, allowedDomains] = await Promise.all([
            fetchDisposableDomains({ timeout: 20000, retries: 3 }),
            fetchAllowlistDomains({ timeout: 20000, retries: 3 })
        ]);

        const response = {
            success: true,
            message: 'Domain lists refreshed successfully',
            stats: {
                disposable_domains: disposableDomains.length,
                allowed_domains: allowedDomains.length,
                updated_at: new Date().toISOString()
            },
            sample_disposable: disposableDomains.slice(0, 10),
            sample_allowed: allowedDomains.slice(0, 10)
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Domain refresh error:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to refresh domain lists',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET() {
    return NextResponse.json({
        message: 'Use POST method to refresh domain lists',
        usage: 'POST /api/refresh-domains with Authorization: Bearer your-secret-api-key'
    });
}