Contributing to TruMailer
=========================

Thanks for your interest in contributing! We welcome bug reports, feature requests, documentation improvements, and code contributions from everyone.

Before contributing, please read and follow our Code of Conduct.

- Code of Conduct: CODE_OF_CONDUCT.md
- Security Policy: SECURITY.md

Getting Started
---------------

Prerequisites:
- Node.js 18+ (Node 20+ recommended)
- Git

Setup:
1. Fork the repository and clone your fork.
2. Install dependencies: `npm install`
3. Create local env files as needed:
   - Copy `.dev.vars.example` to `.dev.vars` and fill in values you need locally.
   - Optionally use `.env.local` for Next.js environment variables.
   - Do NOT commit secrets. These files are gitignored in this repo.
4. Start the dev server: `npm run dev`

Common Scripts
--------------
- `npm run dev` — start local development server
- `npm run lint` — run linting
- `npm run build` — build the app
- `npm run cf:dev` — run with Cloudflare (optional)

How to Contribute
-----------------
1. Search existing issues to avoid duplicates. If none exist, open a new issue using the appropriate template.
2. For larger changes, please start a discussion in an issue before opening a PR.
3. Create a feature branch from `main` (e.g., `feat/xyz` or `fix/abc`).
4. Make your changes with clear, focused commits (Conventional Commits style is appreciated, e.g., `feat: add email syntax validator`).
5. Run `npm run lint` locally and ensure there are no errors.
6. Open a pull request and fill out the PR template. Link the related issue (e.g., `Closes #123`).

Coding Guidelines
-----------------
- Keep changes minimal and focused; avoid unrelated refactors in the same PR.
- Follow the existing code style. If unsure, mirror nearby code.
- Include documentation updates when behavior or APIs change.
- Add tests where applicable (or include instructions to verify the change).

Issue Labels
------------
- `good first issue` — great for first-time contributors
- `help wanted` — contributions appreciated

Review Process
--------------
- A maintainer will review your PR and may request changes.
- Once approved, a maintainer will merge the PR. Squash merges may be used to keep history clean.

Release Process
---------------
- Maintainers manage releases. Follow the issue tracker for upcoming changes.

Thanks again for helping improve TruMailer!

