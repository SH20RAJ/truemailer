# Cloudflare Deployment Fix

## Issue

The production deployment was failing with chunk loading errors:

```
Error: Failed to load chunk server/chunks/ssr/[root-of-the-server]__4ecc429c._.js from runtime
```

## Root Cause

This error occurs when Next.js webpack code splitting creates chunks that cannot be properly loaded in the Cloudflare Workers runtime. This is a common issue with Next.js + OpenNext on Cloudflare.

## Applied Fixes

### 1. **next.config.ts** - Webpack Configuration

- Disabled code splitting for server bundles (`splitChunks: false`)
- Disabled minification for server code to prevent chunk mangling
- Set output to `standalone` mode
- Enabled `webpackBuildWorker` for better build performance

### 2. **open-next.config.ts** - OpenNext Configuration

- Disabled minification (`minify: false`) to prevent runtime errors
- Added wrapper configuration for better Cloudflare compatibility
- Kept existing libsql package installations

### 3. **wrangler.jsonc** - Worker Configuration

- Added `streams_enable_constructors` compatibility flag
- Increased CPU limit to 50000ms for complex operations

## Deployment Steps

1. **Clean build artifacts:**

   ```bash
   rm -rf .next .open-next node_modules/.cache
   ```

2. **Rebuild and deploy:**

   ```bash
   bun install
   bun run deploy
   ```

3. **If issue persists, try:**
   ```bash
   # Clear Cloudflare cache
   bun run cf:build
   bun run cf:deploy --no-bundle
   ```

## Additional Notes

- The `splitChunks: false` setting prevents webpack from creating separate chunk files
- Disabling minification ensures chunk references remain intact
- These changes may slightly increase bundle size but ensure runtime stability
- Local development (`bun dev`) is not affected

## Verification

After deployment, verify:

1. Homepage loads without errors: `https://truemailer.strivio.world/`
2. Check Cloudflare logs for any remaining chunk errors
3. Test API endpoints to ensure full functionality

## If Problem Persists

Try these additional steps:

1. Update `@opennextjs/cloudflare` to latest version
2. Check for any dynamic imports in landing page components
3. Consider converting page to static export if no server-side logic needed
4. Review Cloudflare dashboard for memory/CPU limits
