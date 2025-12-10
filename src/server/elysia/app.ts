import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { keysRoutes } from "./routes/keys";
import { usageRoutes } from "./routes/usage";
import { listsRoutes } from "./routes/lists";
import { validateRoutes } from "./routes/validate";

export const app = new Elysia({ prefix: "/api" })
    .use(swagger({
        path: "/docs",
        documentation: {
            info: {
                title: "TrueMailer API",
                version: "1.0.0",
                description: "High-performance Email Validation API"
            }
        }
    }))
    .use(keysRoutes)
    .use(usageRoutes)
    .use(listsRoutes)
    .use(validateRoutes)
    .get("/health", () => ({ status: "ok", timestamp: new Date().toISOString() }))
    .onError(({ code, error }) => {
        return new Response(JSON.stringify({
            error: (error as any).message || "Unknown error",
            code
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    });

export type App = typeof app;
