import { Elysia, t } from "elysia";
import { ValidationService } from "@/services/validation-service";
import { stackServerApp } from "@/stack";
import { ApiKeyService, AnalyticsService } from "@/lib/db";

export const validateRoutes = new Elysia({ prefix: "/v1" })
    .get("/validate", async ({ query, request, set }) => {
        const email = query.email;
        const apiKey = request.headers.get("x-api-key");
        const user = await stackServerApp.getUser();

        // Auth Check: Either Valid User Session OR Valid API Key
        let userId: string | undefined;
        let apiKeyId: string | undefined;

        if (user) {
            userId = user.id;
        } else if (apiKey) {
            const keyService = new ApiKeyService();
            const keyRecord = await keyService.verifyApiKey(apiKey);
            if (!keyRecord) {
                set.status = 401;
                return { error: "Invalid API Key" };
            }
            if (keyRecord.monthlyQuota && keyRecord.currentUsage! >= keyRecord.monthlyQuota) {
                set.status = 403;
                return { error: "Monthly quota exceeded" };
            }
            userId = keyRecord.userId;
            apiKeyId = keyRecord.id;

            // Update Usage
            await keyService.incrementUsage(keyRecord.id);
        } else {
            // Allow free tier usage without key/auth if strict mode is off?
            // For now, require auth or key.
            set.status = 401;
            return { error: "Authentication required (Login or API Key)" };
        }

        const validator = new ValidationService();
        const result = await validator.validateEmail(email, userId);

        // Async log analytics (don't await)
        // Async log analytics (don't await)
        if (apiKeyId) {
            const analytics = new AnalyticsService();
            analytics.logApiUsage({
                apiKeyId: apiKeyId,
                userId: userId || 'anonymous', // Should technically always be present if apiKeyId is present
                endpoint: '/v1/validate',
                method: 'GET',
                statusCode: 200, // Assuming success
                responseTime: 0 // TODO: Measure time
            }).catch(console.error);
        }

        return result;
    }, {
        query: t.Object({
            email: t.String()
        }),
        detail: {
            tags: ['Validation'],
            summary: 'Validate Email',
            description: 'Check if an email address is valid, disposable, or risky.'
        }
    });
