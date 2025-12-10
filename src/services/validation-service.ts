import { fetchDisposableDomains, fetchAllowlistDomains } from '@/lib/domain-fetcher';
import { PersonalListService } from '@/lib/db';

export class ValidationService {
    private static disposableDomains: Set<string> = new Set();
    private static allowedDomains: Set<string> = new Set();
    private static lastFetch = 0;
    private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    private async updateDomainLists(): Promise<void> {
        const now = Date.now();
        if (now - ValidationService.lastFetch < ValidationService.CACHE_DURATION && ValidationService.disposableDomains.size > 0) {
            return;
        }

        try {
            const [disposableList, allowlistList] = await Promise.all([
                fetchDisposableDomains({ timeout: 15000, retries: 2 }),
                fetchAllowlistDomains({ timeout: 15000, retries: 2 })
            ]);

            ValidationService.disposableDomains = new Set(disposableList.map(d => d.toLowerCase()));
            ValidationService.allowedDomains = new Set(allowlistList.map(d => d.toLowerCase()));
            ValidationService.lastFetch = now;
        } catch (error) {
            console.error('Failed to update domain lists:', error);
            if (ValidationService.disposableDomains.size === 0) {
                ValidationService.disposableDomains = new Set([
                    '10minutemail.com', 'temp-mail.org', 'guerrillamail.com',
                    'mailinator.com', 'throwaway.email', 'tempmail.net'
                ]);
            }
        }
    }

    private extractDomain(email: string): string {
        const parts = email.toLowerCase().split('@');
        return parts.length === 2 ? parts[1] : '';
    }

    private isValidEmailFormat(email: string): boolean {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    private isRoleBasedEmail(email: string): boolean {
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

    private async checkMXRecord(domain: string): Promise<boolean> {
        // Placeholder: Implement actual DNS lookup here
        return true;
    }

    public async validateEmail(email: string, userId?: string) {
        if (!email) throw new Error('Email is required');

        await this.updateDomainLists();

        const isValidFormat = this.isValidEmailFormat(email);
        if (!isValidFormat) {
            return {
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
            };
        }

        const domain = this.extractDomain(email);
        let isDisposable = ValidationService.disposableDomains.has(domain);
        let isAllowed = ValidationService.allowedDomains.has(domain);
        const isRoleBased = this.isRoleBasedEmail(email);
        const mxFound = await this.checkMXRecord(domain);

        // Check Personal Lists if userId is provided
        if (userId) {
            const listService = new PersonalListService();
            const { isBlocked, isWhitelisted } = await listService.getPersonalValidation(userId, email);

            if (isWhitelisted) {
                isAllowed = true;
                isDisposable = false; // Whitelist overrides disposable
            } else if (isBlocked) {
                isAllowed = false;
                isDisposable = true; // Effectively treat as disposable/spammy
            }
        }

        // Calculate Score
        let confidenceScore = 0.5;
        if (isAllowed) confidenceScore += 0.4;
        else if (isDisposable) confidenceScore -= 0.4;

        if (mxFound) confidenceScore += 0.2;
        else confidenceScore -= 0.3;

        if (isRoleBased) confidenceScore -= 0.1;

        confidenceScore = Math.max(0, Math.min(1, confidenceScore));
        const isValid = !isDisposable && isValidFormat && confidenceScore > 0.5;

        // Risk Level
        let riskLevel = 'low';
        if (isDisposable || confidenceScore < 0.3) riskLevel = 'high';
        else if (confidenceScore < 0.6) riskLevel = 'medium';

        const suggestions: string[] = [];
        if (isDisposable) suggestions.push('This domain is known for providing temporary/disposable email addresses');
        if (isRoleBased) suggestions.push('This appears to be a role-based email address');
        if (!mxFound) suggestions.push('No MX records found for this domain');
        if (isAllowed) suggestions.push('This domain is on the trusted allowlist');

        return {
            email,
            domain,
            valid: isValid,
            valid_syntax: isValidFormat,
            mx_found: mxFound,
            disposable: isDisposable,
            role_based: isRoleBased,
            spammy: isDisposable,
            allowed_list: isAllowed,
            confidence_score: Math.round(confidenceScore * 100) / 100,
            risk_level: riskLevel,
            suggestions,
            timestamp: new Date().toISOString()
        };
    }
}
