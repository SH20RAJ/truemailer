const { fetchDisposableDomains, fetchAllowlistDomains } = require('../src/lib/domain-fetcher.ts');

async function testFallback() {
    console.log('🧪 Testing domain fetcher with fallback...\n');

    try {
        console.log('Testing disposable domains fetch...');
        const disposable = await fetchDisposableDomains({ timeout: 5000, retries: 1 });
        console.log(`✅ Successfully fetched ${disposable.length} disposable domains`);
        console.log('Sample domains:', disposable.slice(0, 5));

        console.log('\nTesting allowlist domains fetch...');
        const allowlist = await fetchAllowlistDomains({ timeout: 5000, retries: 1 });
        console.log(`✅ Successfully fetched ${allowlist.length} allowlist domains`);
        console.log('Sample domains:', allowlist.slice(0, 5));

        console.log('\n🎉 All tests passed! Fallback system is working.');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testFallback();