/**
 * Utility for fetching disposable email domain lists with fallback to jsDelivr CDN
 */

interface FetchOptions {
    timeout?: number;
    retries?: number;
}

const DEFAULT_OPTIONS: Required<FetchOptions> = {
    timeout: 10000, // 10 seconds
    retries: 2
};

/**
 * Fetch with timeout support
 */
async function fetchWithTimeout(url: string, options: RequestInit & { timeout?: number }) {
    const { timeout = 10000, ...fetchOptions } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Fetch disposable email domains with GitHub primary and jsDelivr fallback
 */
export async function fetchDisposableDomains(options: FetchOptions = {}): Promise<string[]> {
    const { timeout, retries } = { ...DEFAULT_OPTIONS, ...options };

    // Primary source: GitHub raw
    const githubUrl = 'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/disposable_email_blocklist.conf';

    // Fallback source: jsDelivr CDN with cache busting
    const cacheVersion = Math.floor(Date.now() / (1000 * 60 * 60)); // Changes every hour
    const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@latest/disposable_email_blocklist.conf?v=${cacheVersion}`;

    const sources = [
        { name: 'GitHub', url: githubUrl },
        { name: 'jsDelivr', url: jsDelivrUrl }
    ];

    let lastError: Error | null = null;

    for (const source of sources) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Fetching disposable domains from ${source.name} (attempt ${attempt}/${retries})`);

                const response = await fetchWithTimeout(source.url, {
                    timeout,
                    headers: {
                        'User-Agent': 'TrueMailer-API/1.0',
                        'Accept': 'text/plain',
                        'Cache-Control': 'no-cache'
                    }
                });

                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);

                    // Check for rate limiting
                    if (response.status === 429) {
                        const retryAfter = response.headers.get('retry-after');
                        console.warn(`Rate limited by ${source.name}. Retry-After: ${retryAfter || 'unknown'}`);

                        // If this is GitHub and we're rate limited, skip to jsDelivr immediately
                        if (source.name === 'GitHub') {
                            console.log('GitHub rate limited, switching to jsDelivr fallback');
                            break;
                        }
                    }

                    // For 4xx/5xx errors, try next attempt or source
                    if (response.status >= 400) {
                        throw error;
                    }
                }

                const text = await response.text();
                const domains = text
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#'))
                    .filter(domain => domain.includes('.'));

                console.log(`Successfully fetched ${domains.length} disposable domains from ${source.name}`);
                return domains;

            } catch (error) {
                lastError = error as Error;
                console.warn(`Failed to fetch from ${source.name} (attempt ${attempt}/${retries}):`, error);

                // If this was a rate limit error and we're on GitHub, break to try jsDelivr
                if (source.name === 'GitHub' && error instanceof Error &&
                    (error.message.includes('429') || error.message.includes('rate limit'))) {
                    console.log('Breaking from GitHub attempts due to rate limiting');
                    break;
                }

                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    // If all sources failed, throw the last error
    throw new Error(`Failed to fetch disposable domains from all sources. Last error: ${lastError?.message || 'Unknown error'}`);
}

/**
 * Fetch allowlist domains with GitHub primary and jsDelivr fallback
 */
export async function fetchAllowlistDomains(options: FetchOptions = {}): Promise<string[]> {
    const { timeout, retries } = { ...DEFAULT_OPTIONS, ...options };

    // Primary source: GitHub raw
    const githubUrl = 'https://raw.githubusercontent.com/disposable-email-domains/disposable-email-domains/main/allowlist.conf';

    // Fallback source: jsDelivr CDN with cache busting
    const cacheVersion = Math.floor(Date.now() / (1000 * 60 * 60)); // Changes every hour
    const jsDelivrUrl = `https://cdn.jsdelivr.net/gh/disposable-email-domains/disposable-email-domains@latest/allowlist.conf?v=${cacheVersion}`;

    const sources = [
        { name: 'GitHub', url: githubUrl },
        { name: 'jsDelivr', url: jsDelivrUrl }
    ];

    let lastError: Error | null = null;

    for (const source of sources) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Fetching allowlist domains from ${source.name} (attempt ${attempt}/${retries})`);

                const response = await fetchWithTimeout(source.url, {
                    timeout,
                    headers: {
                        'User-Agent': 'TrueMailer-API/1.0',
                        'Accept': 'text/plain',
                        'Cache-Control': 'no-cache'
                    }
                });

                if (!response.ok) {
                    const error = new Error(`HTTP ${response.status}: ${response.statusText}`);

                    // Check for rate limiting
                    if (response.status === 429) {
                        const retryAfter = response.headers.get('retry-after');
                        console.warn(`Rate limited by ${source.name}. Retry-After: ${retryAfter || 'unknown'}`);

                        // If this is GitHub and we're rate limited, skip to jsDelivr immediately
                        if (source.name === 'GitHub') {
                            console.log('GitHub rate limited, switching to jsDelivr fallback');
                            break;
                        }
                    }

                    // For 4xx/5xx errors, try next attempt or source
                    if (response.status >= 400) {
                        throw error;
                    }
                }

                const text = await response.text();
                const domains = text
                    .split('\n')
                    .map(line => line.trim())
                    .filter(line => line && !line.startsWith('#'))
                    .filter(domain => domain.includes('.'));

                console.log(`Successfully fetched ${domains.length} allowlist domains from ${source.name}`);
                return domains;

            } catch (error) {
                lastError = error as Error;
                console.warn(`Failed to fetch allowlist from ${source.name} (attempt ${attempt}/${retries}):`, error);

                // If this was a rate limit error and we're on GitHub, break to try jsDelivr
                if (source.name === 'GitHub' && error instanceof Error &&
                    (error.message.includes('429') || error.message.includes('rate limit'))) {
                    console.log('Breaking from GitHub attempts due to rate limiting');
                    break;
                }

                // Wait before retry (exponential backoff)
                if (attempt < retries) {
                    const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
                    console.log(`Waiting ${delay}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
            }
        }
    }

    // If all sources failed, return empty array for allowlist (non-critical)
    console.warn(`Failed to fetch allowlist from all sources. Last error: ${lastError?.message || 'Unknown error'}`);
    return [];
}

/**
 * Fetch both disposable and allowlist domains concurrently
 */
export async function fetchAllDomains(options: FetchOptions = {}): Promise<{
    disposable: string[];
    allowlist: string[];
}> {
    const [disposable, allowlist] = await Promise.allSettled([
        fetchDisposableDomains(options),
        fetchAllowlistDomains(options)
    ]);

    return {
        disposable: disposable.status === 'fulfilled' ? disposable.value : [],
        allowlist: allowlist.status === 'fulfilled' ? allowlist.value : []
    };
}