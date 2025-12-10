import { Elysia, t } from "elysia";
import { PersonalListService } from "@/lib/db";
import { stackServerApp } from "@/stack";

export const listsRoutes = new Elysia({ prefix: "/lists" })
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
    .get("/blocklist", async ({ user }) => {
        const listService = new PersonalListService();
        return await listService.getBlocklist(user!.id);
    }, {
        detail: { tags: ['Personal Lists'] }
    })
    .post("/blocklist", async ({ body, user }) => {
        const listService = new PersonalListService();
        return await listService.addToBlocklist(user!.id, body.emailOrDomain, body.type as 'email' | 'domain', body.reason);
    }, {
        body: t.Object({
            emailOrDomain: t.String(),
            type: t.Union([t.Literal('email'), t.Literal('domain')]),
            reason: t.Optional(t.String())
        }),
        detail: { tags: ['Personal Lists'] }
    })
    .delete("/blocklist/:id", async ({ params, user }) => {
        const listService = new PersonalListService();
        return await listService.removeFromBlocklist(user!.id, parseInt(params.id));
    }, {
        params: t.Object({ id: t.String() }),
        detail: { tags: ['Personal Lists'] }
    })
    .get("/whitelist", async ({ user }) => {
        const listService = new PersonalListService();
        return await listService.getWhitelist(user!.id);
    }, {
        detail: { tags: ['Personal Lists'] }
    })
    .post("/whitelist", async ({ body, user }) => {
        const listService = new PersonalListService();
        return await listService.addToWhitelist(user!.id, body.emailOrDomain, body.type as 'email' | 'domain', body.reason);
    }, {
        body: t.Object({
            emailOrDomain: t.String(),
            type: t.Union([t.Literal('email'), t.Literal('domain')]),
            reason: t.Optional(t.String())
        }),
        detail: { tags: ['Personal Lists'] }
    })
    .delete("/whitelist/:id", async ({ params, user }) => {
        const listService = new PersonalListService();
        return await listService.removeFromWhitelist(user!.id, parseInt(params.id));
    }, {
        params: t.Object({ id: t.String() }),
        detail: { tags: ['Personal Lists'] }
    });
