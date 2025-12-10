import { Elysia, t } from "elysia";
import { ApiKeyService } from "@/lib/db";
import { stackServerApp } from "@/stack";

export const keysRoutes = new Elysia({ prefix: "/keys" })
    .derive(async () => {
        const user = await stackServerApp.getUser();
        return { user };
    })
    .onBeforeHandle(({ user, set }) => {
        if (!user) {
            set.status = 401;
            return { error: "Unauthorized" };
        }
    })
    .get("/", async ({ user }) => {
        const apiKeyService = new ApiKeyService();
        return await apiKeyService.getUserApiKeys(user!.id);
    }, {
        detail: {
            tags: ['API Keys'],
            summary: 'List API Keys',
            description: 'Get all API keys for the current user'
        }
    })
    .post("/", async ({ body, user }) => {
        const apiKeyService = new ApiKeyService();
        return await apiKeyService.createApiKey(user!.id, body.name, body.quota);
    }, {
        body: t.Object({
            name: t.String(),
            quota: t.Optional(t.Number({ default: 5000 }))
        }),
        detail: {
            tags: ['API Keys'],
            summary: 'Create API Key',
            description: 'Generate a new API key'
        }
    })
    .delete("/:id", async ({ params, user }) => {
        const apiKeyService = new ApiKeyService();
        // In a real app, verify ownership first. 
        // getUserApiKeys filters by userId, but deleteApiKey doesn't check owner.
        // We should probably check if the key belongs to the user or if deleteApiKey handles it.
        // Looking at ApiKeyService.deleteApiKey, it just deletes by ID.
        // Enhancement: Verify ownership.
        const keys = await apiKeyService.getUserApiKeys(user!.id);
        const ownsKey = keys.some(k => k.id === params.id);

        if (!ownsKey) {
            throw new Error("Key not found or unauthorized");
        }

        return await apiKeyService.deleteApiKey(params.id);
    }, {
        params: t.Object({
            id: t.String()
        }),
        detail: {
            tags: ['API Keys'],
            summary: 'Delete API Key',
            description: 'Revoke and delete an API key'
        }
    });
