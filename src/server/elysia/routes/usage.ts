import { Elysia, t } from "elysia";
import { AnalyticsService } from "@/lib/db";
import { stackServerApp } from "@/stack";

export const usageRoutes = new Elysia({ prefix: "/usage" })
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
    .get("/", async ({ user, query }) => {
        const analyticsService = new AnalyticsService();
        const days = query.days ? parseInt(query.days) : 30;
        return await analyticsService.getUserAnalytics(user!.id, days);
    }, {
        query: t.Object({
            days: t.Optional(t.String())
        }),
        detail: {
            tags: ['Analytics'],
            summary: 'Get Usage Stats',
            description: 'Get API usage statistics for the dashboard'
        }
    });
