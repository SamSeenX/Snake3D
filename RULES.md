# RULES.md &middot; Project Guidelines & Standards

## 1. Modular Architecture & 200-Line Limit
- Every JavaScript and CSS file must strictly stay under 200 lines of code.
- Proactively split modules when they reach 180 lines.
- Markdown documentation files (`BRAIN.md`, `README.md`, `CHANGELOG.md`, `RULES.md`, `SCOPE.md`) are exempt from line limits.

## 2. Vanilla Philosophy & Dependencies
- Keep the project lean using Vanilla JavaScript (ES6+ modules) and Vanilla CSS.
- Three.js is the only runtime dependency for WebGL graphics.
- Strictly no Tailwind CSS, no React, and no bloated external component libraries.
- Modern build tool: Vite targeting `es2022`.

## 3. Git Workflow & Deployment
- Always branch off to a feature branch when starting a new task.
- Ensure `npm run build` succeeds cleanly before merging or deploying.
- Cloudflare CI/CD is connected solely to the `deploy` branch. Commits on `main` do not trigger Cloudflare builds.
- Use annotated git tags (`v1.x.x`) to bookmark stable milestones.

## 4. UI/UX & Visual Identity
- Soft Japanese diorama theme: Matcha green, cedar wood, warm cream, and morning mist lighting.
- Compact 1:1 square OpenGraph previews (256x256, PNG under 300KB) with `twitter:card` set to `summary`.
- Minimum 48px touch targets for mobile usability.
