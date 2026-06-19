---
name: new-screen
description: Scaffold a new authenticated PrismaCV route following the real co-location convention — a thin RSC page.tsx that fetches on the server and delegates to a co-located *-page-client.tsx, plus a loading.tsx skeleton and a local components/ folder. Use when adding a screen under app/(site), wiring a feature module to UI, or asked to "add a page/route/screen".
---

# New screen scaffolder

Creates a route that matches how PrismaCV screens are actually built today
(`dashboard`, `jobs`, `skills`, `cv/[id]/edit`). Note: this is the **real**
convention and supersedes the older `components/pages/<feature>/` guidance —
feature screens co-locate their client tree inside the `app/(site)/<route>/`
folder, not under `src/components/pages/`.

## Structure to generate

```
src/app/(site)/<route>/
  page.tsx               -- RSC entry: server-side fetch, delegates to client
  <route>-page-client.tsx -- 'use client' root; receives data as props
  loading.tsx            -- skeleton using bg-surface-elevated + animate-pulse
  components/            -- screen-local components (only if the screen is large)
```

For dynamic routes, params come in as a Promise and must be awaited.

## Rules

1. **page.tsx is a thin server entry.** Fetch via the feature's `queries.ts`
   (never `apiClient` directly), then pass domain data as props. Add
   `export const dynamic = 'force-dynamic'` for authenticated, per-user data.
   No business logic, no JSX beyond the delegation.
2. **Data fetching stays on the server.** Do not push fetching into the client
   just because the screen is interactive. Fetch in `page.tsx`, pass props down.
3. **The client root is `'use client'`** and holds interactivity/local state.
   Keep deeper interactive pieces as small leaf components in `components/`.
4. **Mutations go through Server Actions** from the feature's `actions.ts`;
   check `result.ok` and use `toast` from `sonner` for feedback.
5. **Auth-gated routes** must be covered by the middleware prefix list in
   `src/middleware.ts` (`/dashboard`, `/cv`, `/jobs`, `/skills`, `/settings`,
   `/interview`, `/cover-letters`, `/ats-scorer`, `/admin`, `/onboarding`).
   If the new prefix is not listed, add it.

## Templates

### page.tsx (server entry, static route)

```tsx
import { getThings } from "@/modules/<feature>/data/queries";
import { ThingsPageClient } from "./things-page-client";

export const dynamic = "force-dynamic";

export default async function ThingsPage() {
  const things = await getThings();
  return <ThingsPageClient initialThings={things} />;
}
```

### page.tsx (dynamic route, with not-found handling)

```tsx
import { notFound } from "next/navigation";
import { getThingById } from "@/modules/<feature>/data/queries";
import { HttpError } from "@/shared/http/http-error";
import { ThingDetailClient } from "./thing-detail-client";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ThingPage({ params }: PageProps) {
  const { id } = await params;
  try {
    const thing = await getThingById(id);
    return <ThingDetailClient thing={thing} />;
  } catch (error) {
    if (error instanceof HttpError && error.isNotFound) notFound();
    throw error;
  }
}
```

### \*-page-client.tsx

```tsx
"use client";

import type { Thing } from "@/modules/<feature>/data/mappers";

interface ThingsPageClientProps {
  initialThings: Thing[];
}

export function ThingsPageClient({ initialThings }: ThingsPageClientProps) {
  // local state + interactivity here; consume ui/ primitives, semantic tokens only
  return <div className="container mx-auto px-4 py-8">{/* ... */}</div>;
}
```

### loading.tsx

```tsx
export default function ThingsLoading() {
  return (
    <div className="container mx-auto px-4 py-8 animate-pulse">
      <div className="h-8 w-48 bg-surface-elevated rounded mb-6" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 rounded-lg bg-surface-elevated" />
        ))}
      </div>
    </div>
  );
}
```

## After scaffolding

1. Use only `src/components/ui/` primitives and semantic tokens — run the
   `token-guard` skill on the new files.
2. If the screen needs a feature data layer that does not exist yet, run the
   `feature-module` skill first.
3. Run `pnpm verify`. Add an e2e spec in `e2e/` if the screen is a primary flow.
