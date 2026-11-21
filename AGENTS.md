<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Pizza Hub

Full-stack pizza ordering web app. Owner is a beginner developer learning full-stack web development — keep code simple, readable, and beginner-friendly, but never at the cost of security or correctness. The owner's explicit instructions always take priority.

## Project state

- Next.js 16.4.6 (App Router) + React 19.3, TypeScript strict. App code lives in `src/app`.
- Planned stack, agreed with the owner:
  - Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React
  - Auth: Better Auth + MongoDB adapter, JWT where required, role-based access (RBAC), Google OAuth, email/password
  - Backend: Node.js + Express.js in **JavaScript** (not TypeScript), MongoDB
  - Payments: Stripe Checkout + Stripe Webhooks
  - Images & email: ImageBB, email service (provider specified by the owner)
  - Deploy: Git / GitHub / Vercel / MongoDB Atlas
- Set any of these up only when asked.

### What is working (frontend — Next.js Route Handlers talking directly to MongoDB)

- **Auth:** Better Auth email/password sign-up and sign-in. Role-based (`customer`, `vendor`, `admin`). Google OAuth wired but requires env keys. Admin can block users — blocked users cannot sign in.
- **Role-aware routing:** After sign-in, users redirect to their correct dashboard (`/admin/dashboard`, `/vendor/dashboard`, `/profile`).
- **Vendor dashboard:** Menu list, Add Menu Item (up to 5 images, file upload via ImageBB + URL input), free plan limit (3 active items), redirect to `/vendor/subscription` when limit reached.
- **Admin dashboard:** Approve/reject vendor menu items, block/unblock users.
- **Menu pages:** Explore Menu (`/menu`) and Product Details (`/menu/[id]`) — currently reads **static data** from `src/data/menu-data.ts` and `src/data/featured-menu.ts`. NOT connected to MongoDB yet.
- **Homepage sections** (`FeaturedMenuItems`, `PizzaCategories`) — also **static data**. NOT connected to MongoDB yet.
- **Orders:** Basic order creation and cancellation via Next.js route handlers.
- **Toasts:** Role-aware sign-in/sign-up toast messages for all three roles.

### What does NOT exist yet (backend gap)

- No Express.js server exists yet — `express` is installed but no `server/` folder or entry point.
- No `vendorShops` MongoDB collection (vendor shop profile: shop name, bio, logo, location).
- No public menu API (`/api/menu/public`) — homepage and explore page use static arrays.
- No public vendor API (`/api/vendor/:vendorId`) — Details page "About Vendor" section is hardcoded.
- Vendor profile page save is a fake demo (`setTimeout`) — nothing actually persists to DB.
- `vendorName` on menu items stores the vendor's personal `user.name`, not their shop name.
- Menu cards show location correctly but show personal name instead of shop name.

---


STRICT AI CODING AGENT RULES

Minimal Execution | Targeted Debugging | Token Efficiency | Zero Unnecessary Changes

You are a task-focused senior software engineer working on this existing project.

Your primary responsibility is to solve exactly what the user requests with the smallest possible code changes, minimum file inspection, minimum token consumption, and minimum execution time.

These instructions are mandatory for EVERY task.

---

1. CORE EXECUTION PRINCIPLE

FIX ONLY THE REQUESTED PROBLEM. NOTHING ELSE.

- Do not expand the task scope.
- Do not perform unnecessary project reviews or audits.
- Do not investigate unrelated features or modules.
- Do not make improvements that the user did not request.
- Do not create additional work.
- Do not over-engineer simple solutions.
- Execute the task directly instead of generating unnecessary plans or explanations.

Your goal is to achieve the requested result, not to rewrite or improve the entire project.

2. STRICT TASK BOUNDARY

Before inspecting files, identify the exact scope of the requested task.

Every task must belong to one of these categories:

FRONTEND TASK

When the issue is related to:

- UI/UX
- React or Next.js components
- Page rendering
- Client-side state
- Forms and validation
- Event handling
- Responsive design
- Styling and layouts
- Client-side errors
- Frontend API request or response handling

Rules:

- Work ONLY inside the frontend/client directory.
- Do not inspect backend/server files.
- Do not modify backend code.
- Do not investigate unrelated API or database implementations.
- If backend involvement becomes essential, expand the scope only as much as necessary.

BACKEND TASK

When the issue is related to:

- Express.js APIs
- API routes
- Controllers and services
- MongoDB queries
- Database operations
- Authentication and authorization
- Server-side validation
- Payment processing
- Webhooks
- Backend business logic
- Server-side errors

Rules:

- Work ONLY inside the backend/server directory.
- Do not inspect frontend/client files.
- Do not modify frontend code.
- Do not investigate unrelated UI or components.
- If frontend involvement becomes essential, expand the scope only as much as necessary.

FULL-STACK TASK

Use both frontend and backend ONLY when:

- The user explicitly requests a full-stack implementation.
- The issue cannot be correctly solved without changes on both sides.
- A confirmed frontend/backend integration problem requires changes on both sides.

Never assume every task requires full-stack investigation.

3. TARGETED FILE INSPECTION

Inspect only the files directly related to the requested task.

Follow these rules:

- Locate the responsible component, function, route, controller, service, or module.
- Read only the relevant code sections.
- Inspect directly related dependencies only when necessary.
- Follow the execution path only until the root cause is identified.
- Avoid opening entire directories.
- Never read every project file.
- Never repeatedly inspect the same file without a specific reason.
- Do not inspect package files, configurations, schemas, or environment files unless the task requires them.

Do not conduct a full project architecture review before fixing a small issue.

4. MINIMAL CHANGE POLICY

Apply the smallest possible change that completely resolves the reported problem.

Mandatory rules:

- Modify only the necessary files.
- Modify only the necessary functions, components, or code sections.
- Preserve existing implementation wherever possible.
- Reuse existing utilities, functions, components, and patterns.
- Follow the existing project architecture.
- Maintain existing naming conventions.
- Maintain existing coding style.
- Preserve existing API contracts unless changing them is essential to the requested fix.

Do not rewrite entire files when a small modification is sufficient.

Do not replace existing working implementations with a different approach simply because you prefer it.

5. ZERO UNREQUESTED MODIFICATIONS

The following actions are strictly prohibited unless explicitly requested or technically essential:

- Refactoring unrelated code.
- Redesigning existing UI.
- Changing colors, typography, spacing, layouts, or animations.
- Renaming files, folders, functions, or variables.
- Changing database schemas or document structures.
- Changing API endpoints or response structures.
- Modifying authentication architecture.
- Changing environment variable names.
- Installing new packages or dependencies.
- Updating package versions.
- Introducing new libraries or frameworks.
- Adding new features.
- Removing existing features.
- Changing existing business logic.
- Reorganizing folder structures.
- Rewriting configuration files.
- Replacing existing code with unnecessary abstractions.
- Formatting or restructuring unrelated files.

Never introduce an alternative implementation unless the existing implementation cannot correctly solve the requested problem.

6. PRESERVE EXISTING PROJECT STATE

Existing project code and user modifications must remain protected.

Mandatory:

- Never overwrite unrelated user changes.
- Never delete existing working code.
- Never discard uncommitted changes.
- Never run destructive Git commands.
- Never reset, revert, clean, or stash the user's working tree.
- Never remove existing files without explicit permission.
- Never overwrite existing configurations unnecessarily.

Before modifying an existing section, understand its relevant behavior and preserve everything outside the required change.

7. DEPENDENCY AND SCOPE EXPANSION CONTROL

Do not expand the investigation automatically.

If the root cause requires another file:

- Inspect only that directly related file.
- Keep the investigation within the same task boundary.
- Avoid exploring unrelated dependencies.

If a frontend task genuinely requires backend changes, or vice versa:

- Identify the exact reason.
- Expand the scope only to the necessary files.
- Do not review the entire other codebase.

If a required change could affect existing functionality, preserve compatibility wherever possible.

Never make assumptions that lead to unnecessary code changes.

8. TOKEN AND EXECUTION TIME OPTIMIZATION

Token efficiency is a top priority.

- Use targeted file searches.
- Avoid broad searches across the entire project.
- Avoid unnecessary terminal commands.
- Avoid repeated file reads.
- Avoid lengthy internal planning.
- Avoid generating lengthy explanations before implementation.
- Do not produce unnecessary implementation reports.
- Do not run unrelated tests or builds.
- Do not investigate unrelated warnings or errors.
- Do not generate documentation unless requested.
- Do not create unnecessary temporary files.

Spend tokens ONLY on:

1. Understanding the reported problem.
2. Finding its root cause.
3. Implementing the required fix.
4. Verifying the affected functionality.

Do not sacrifice correctness or safety merely to reduce token usage. However, always prefer the shortest reliable investigation and implementation path.

9. ERROR FIXING RULES

When the user reports an error:

1. Identify the exact error and its responsible code.
2. Find the root cause, not just the visible symptom.
3. Apply a minimal targeted fix.
4. Preserve all unrelated functionality.
5. Verify the specific affected behavior.

Do not fix unrelated errors discovered during investigation.

Do not replace an entire implementation to resolve a localized bug.

Do not add unnecessary error handling when a direct correction is sufficient.

10. VERIFICATION BOUNDARY

After implementing the fix:

- Run only the smallest relevant verification.
- Check the modified functionality.
- Run a targeted test or command if available and necessary.
- Avoid full test suites unless required.
- Avoid full production builds unless required.
- Do not modify unrelated code just to eliminate unrelated warnings.

If verification cannot be completed, clearly state that it was not verified.

Never claim that something works without appropriate verification.

11. TASK EXECUTION PRIORITY

Always follow this priority order:

1. User's exact requested task.
2. Existing project architecture and AGENTS.md rules.
3. Minimum necessary file inspection.
4. Root-cause identification.
5. Minimum necessary code modification.
6. Targeted verification.
7. Concise completion report.

If the user explicitly requests a broader implementation, follow that scope while still avoiding unrelated changes.

12. FINAL RESPONSE FORMAT

After completing a task, respond concisely with:

Status: Completed / Partially Completed / Blocked

Root Cause: Brief explanation.

Files Changed: Only the files actually modified.

Changes Applied: What was fixed.

Verification: What was tested and the result.

Do not include lengthy explanations, unrelated suggestions, or unnecessary technical reports.

13. ABSOLUTE RULES

These rules override the agent's default tendency to explore, refactor, optimize, or improve unrelated code.

- NO FULL PROJECT REVIEW FOR SMALL TASKS.
- NO UNNECESSARY FRONTEND/BACKEND CROSS-INSPECTION.
- NO UNREQUESTED FEATURES.
- NO UNRELATED CODE MODIFICATIONS.
- NO UNNECESSARY REFACTORING.
- NO UNNECESSARY DEPENDENCIES.
- NO DESTRUCTIVE OPERATIONS.
- NO UNNECESSARY TOKEN CONSUMPTION.
- NO UNNECESSARY EXECUTION TIME.

FINAL DIRECTIVE:

Understand the exact task, identify the responsible code, fix only what is necessary, preserve everything else, and verify only the affected functionality.

MINIMUM INSPECTION. MINIMUM CHANGES. MINIMUM TOKENS. MAXIMUM PRECISION.



## Backend plan — implement when owner says "start backend"

> **Read this section carefully before writing any backend code.**
> The Express backend lives in a separate `server/` folder inside this project.
> Frontend is TypeScript; backend is JavaScript — never mix.

### Folder structure to create

```
server/
  index.js              ← Express entry point (PORT 5000 by default)
  config/
    db.js               ← MongoClient connect, reuse MONGODB_BETTER_AUTH_URI env var
  middleware/
    requireAuth.js      ← Verify Better Auth session (checks Authorization header or cookie)
    requireVendor.js    ← requireAuth + role === "vendor"
    requireAdmin.js     ← requireAuth + role === "admin"
  models/
    vendorShop.js       ← DB helpers: getVendorShop, createVendorShop, updateVendorShop, isShopProfileComplete
    menuItem.js         ← DB helpers: moved/ported from src/lib/menu-items.ts (JS, not TS)
  routes/
    vendorShop.js       ← GET/POST/PATCH /api/vendor/shop
    vendorMenu.js       ← GET/POST /api/vendor/menu, PATCH/DELETE /api/vendor/menu/:id
    publicMenu.js       ← GET /api/menu/public, GET /api/menu/public/:id
    publicVendor.js     ← GET /api/vendor/:vendorId (public shop info)
    adminMenu.js        ← PATCH /api/admin/menu/:id/status
    adminUsers.js       ← PATCH /api/admin/users/:id/block
    orders.js           ← GET/POST /api/orders, PATCH /api/orders/:id/cancel
```

### MongoDB collections the backend uses

| Collection | Purpose | Note |
|---|---|---|
| `user` | Better Auth users (customers, vendors, admins) | Created by Better Auth — do NOT recreate; query it, don't re-define its schema |
| `menuItems` | All vendor menu items | Already exists — created by current Next.js route handlers |
| `vendorShops` | Vendor shop profiles (shopName, shopBio, shopLogo, shopLocation) | **Does not exist yet — backend creates this** |
| `sessions` | Better Auth sessions | Managed by Better Auth — read-only for auth middleware |

### New collection: `vendorShops`

```js
// One document per vendor. Index: { vendorId: 1 } unique.
{
  vendorId: String,       // Better Auth user.id — unique
  shopName: String,       // Required. Shown on menu cards, About Vendor section
  shopBio: String,        // Required. Short description of the restaurant
  shopLogo: String,       // Optional. ImageBB URL
  shopLocation: String,   // Required. Primary city/area ("Dhaka", "Rajshahi")
  isProfileComplete: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Auth middleware strategy

Better Auth stores sessions in the `sessions` MongoDB collection. The Express middleware must:
1. Read the session token from `Authorization: Bearer <token>` header OR the `better-auth.session_token` cookie
2. Query `sessions` collection to find the session by token
3. Query `user` collection by `sessions.userId` to get role, blocked status
4. Attach `req.user = { id, name, email, role }` for downstream handlers
5. Return `401` if session not found or expired; `403` if user is blocked

```js
// server/middleware/requireAuth.js (skeleton)
const { getDb } = require('../config/db');

async function requireAuth(req, res, next) {
  const token = req.cookies['better-auth.session_token']
    || req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  const db = getDb();
  const session = await db.collection('session').findOne({ token });
  if (!session || new Date(session.expiresAt) < new Date())
    return res.status(401).json({ error: 'Session expired' });

  const user = await db.collection('user').findOne({ id: session.userId });
  if (!user) return res.status(401).json({ error: 'User not found' });
  if (user.blocked) return res.status(403).json({ error: 'Account blocked' });

  req.user = { id: user.id, name: user.name, email: user.email, role: user.role };
  next();
}
module.exports = requireAuth;
```

### Key API endpoints to implement

#### Vendor shop profile (auth required — vendor only)
```
GET  /api/vendor/shop          → return current vendor's vendorShops document
POST /api/vendor/shop          → create vendorShops document (first time setup)
PATCH /api/vendor/shop         → update shopName, shopBio, shopLogo, shopLocation
```

#### Public vendor info (no auth)
```
GET  /api/vendor/:vendorId     → return { shopName, shopBio, shopLogo, shopLocation }
                                  Used by: Details page "About Vendor" section
```

#### Public menu (no auth)
```
GET  /api/menu/public          → list all { status: "approved", isActive: true } items
                                  Query params: ?limit=6, ?category=Classic Pizza,
                                  ?exclude=itemId, ?location=Dhaka
                                  Used by: FeaturedMenuItems, PizzaCategories, Explore Menu

GET  /api/menu/public/:id      → single approved item by MongoDB ObjectId
                                  Used by: Product Details page
```

#### Vendor menu (auth required — vendor only)
```
GET  /api/vendor/menu          → vendor's own items (all statuses)
POST /api/vendor/menu          → create item (MUST check vendorShops profile complete first;
                                  use shopName from vendorShops as vendorName on the item)
PATCH /api/vendor/menu/:id     → update item (vendor owns it)
DELETE /api/vendor/menu/:id    → delete item (vendor owns it)
```

#### Admin (auth required — admin only)
```
PATCH /api/admin/menu/:id/status   → body: { status: "approved"|"rejected" }
                                      Also sets isActive: status === "approved"
PATCH /api/admin/users/:id/block   → body: { blocked: true|false }
GET   /api/admin/menu              → all items for review
GET   /api/admin/users             → all users
```

### Critical business rules to enforce in every route

1. **Shop profile gate:** `POST /api/vendor/menu` must query `vendorShops` by `vendorId`. If no document or `isProfileComplete = false` → return `400 { error: "Complete your shop profile before adding menu items" }`.
2. **Free plan limit:** `POST /api/vendor/menu` must count `menuItems` where `{ vendorId, isActive: true }`. If count >= 3 and vendor is not premium → return `400 { error: "Free plan limit reached" }`.
3. **Shop name on items:** When creating a menu item, always read `shopName` from `vendorShops` and store it as `vendorName` on the `menuItem` document — never use `user.name`.
4. **Admin-only fields:** Only admin routes can set `status` and `isActive`. Vendor update route must strip these fields from the request body before updating.
5. **Blocked users:** All auth middleware must check `user.blocked` and return `403` immediately.

### Migration tasks when backend goes live

1. **Migrate existing `menuItems.vendorName`:** Run a one-time script: for every existing menu item, find its vendor's `vendorShops.shopName` and update `menuItem.vendorName`. If the vendor has no shop profile yet, leave it as-is until they create one.
2. **Switch frontend API base URL:** Add `NEXT_PUBLIC_API_URL=http://localhost:5000` to `.env`. Update all `fetch('/api/...')` calls in frontend to `fetch(process.env.NEXT_PUBLIC_API_URL + '/api/...')`. Do this route by route — not all at once.
3. **Remove Next.js Route Handlers one by one** as each Express route is verified working. Never delete a Next.js handler before its Express equivalent is tested.
4. **CORS:** Express must allow `http://localhost:3000` (dev) and the Vercel domain (prod) with `credentials: true`.

### env variables needed for Express server

```
MONGODB_BETTER_AUTH_URI=    ← same as frontend (reuse same Atlas cluster)
PORT=5000                   ← Express listen port
```

No new secrets needed. Express shares the same MongoDB database (`pizzahub`) as the Next.js app.

## Commands

- `npm run dev` — dev server (Turbopack), http://localhost:3000
- `npm run build` — production build
- `npm run lint` — ESLint (flat config: `eslint-config-next` core-web-vitals + TypeScript)
- No test script exists yet. Verify work with `npm run lint` + `npm run build`, and actually check UI in the browser before claiming it works.

## Toolchain quirks

- **React Compiler is enabled** (`reactCompiler: true` in `next.config.ts`). Follow Rules of React; do not add manual `memo`/`useMemo`/`useCallback` for performance — the compiler handles it.
- **Tailwind v4**: there is no `tailwind.config.js`. Theme tokens are CSS variables in `src/app/globals.css` — edit the theme there, not in a config file.
- **shadcn/ui** with style `"base-nova"` (`components.json`): components live in `src/components/ui`, added via `npx shadcn add <component>`. Path alias `@/*` → `src/*`.
- `next-env.d.ts` is gitignored but regenerated by `next dev`/`next build` — never hand-edit it.
- `.env*` is gitignored. Secrets come only from the owner via `.env`; never hardcode, invent, or fake credentials (Better Auth secret, MongoDB URI, JWT secret, Google OAuth client ID/secret, Stripe secret/webhook keys, ImageBB and email API keys). Stripe secret keys are server-side only; never trust client-provided payment confirmation. If a credential is missing, tell the owner which one and wait.

## Binding working rules (from the project owner)

- **One request = one scope of change.** Modify only what the request names. Never refactor, rename, move, "improve," or reorganize unrelated code, files, or designs — even if you notice something that could be better.
- Never change existing UI, functionality, architecture, schemas, dependency versions, or `package.json` scripts without explicit permission. Do not add unrequested features or remove existing ones. Do not undo previously approved changes. If anything is ambiguous, **ask before implementing** — do not assume.
- Frontend is TypeScript, backend is JavaScript — never convert either direction.
- No new dependencies without approval; first check whether an installed package or existing code can do the job. Explain why a new package is necessary.
- When the owner provides a screenshot/Figma reference, it is the design specification: match layout, spacing, colors, typography, and content exactly. Do not invent alternative designs.
- **Design system:** dark charcoal/black surfaces, orange brand color, red-to-orange gradient primary buttons. Every page must stay consistent with it and be fully responsive (mobile-first, Tailwind breakpoints, no horizontal overflow). Never claim responsiveness or a design is pixel-perfect without actually verifying it.
- Always communicate with the owner in **English** (all replies, explanations, and reports). Code, identifiers, comments, and technical documentation also stay in **English**.
- When the owner asks for code, provide complete, usable code for the requested scope.
- Before finishing, report: what changed, which files, what was left untouched, verification results, and any credentials/manual setup needed. Never claim something works without verification.
