---
name: feature-module
description: Scaffold a PrismaCV feature data layer (contracts, mappers, queries, mutations, actions, and co-located tests) under src/modules/<feature>/data. Use when adding a new backend-backed feature or backfilling an existing module that is missing files or tests. Triggers on "new feature module", "scaffold data layer", "add queries/mutations/actions", "backfill tests for <module>".
---

# Feature module scaffolder

Generates a feature's `data/` layer following the strict layering in `AGENTS.md`.
Every file mirrors the conventions already used by `src/modules/ats` and
`src/modules/jobs`. Do not invent new patterns — match these exactly.

## When to use

- Adding a new feature backed by a backend controller.
- Backfilling a module that is missing `queries.ts`, `mutations.ts`, or tests.
  The modules with **no co-located tests today** are: `ai`, `jobs`, `skills`,
  `interview`, `cover-letters`, `billing`. These are the priority targets.

## Inputs to confirm before scaffolding

1. **Feature name** (kebab-case, matches `src/modules/<feature>/`).
2. **Backend base path** (e.g. `ats`, `jobs`, `cover-letters`) — read it from the
   Nest controller `@Controller('<path>')`. Never guess the route.
3. **Operations** — which of read (`queries`) / write (`mutations`) the feature needs.
4. **Wire shapes** — the response DTO from the backend controller. Contracts must
   mirror the backend DTO field-for-field, including casing.

## Layer rules (enforce, do not deviate)

| File           | Rule                                                                                                                                                                                          |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `contracts.ts` | Wire types only (`*Contract`, `*Request`). No domain types. No imports from `mappers.ts`. Mirror backend DTO casing exactly.                                                                  |
| `mappers.ts`   | Owns all domain types + `to<Domain>(contract)` transforms. Single source of truth for the feature's domain shapes. Copy arrays (`[...]`) — never leak contract references.                    |
| `queries.ts`   | `import 'server-only'`. Read functions. Wrap calls in `executeAuthenticatedRequest`. Return domain types via mappers. Use `apiClient`, never raw `fetch`.                                     |
| `mutations.ts` | `import 'server-only'`. Write functions. Same `executeAuthenticatedRequest` + mapper rules.                                                                                                   |
| `actions.ts`   | `'use server'`. Returns an `ActionResult` discriminated union `{ ok: true, data } \| { ok: false, code, message }`. Catch `HttpError`, map status → semantic code. Never throw to the client. |
| `*.test.ts`    | Co-located. Mock `@/shared/http/api-client`. Use `satisfies <Contract>` on fixtures. Test behavior, not implementation.                                                                       |

## Canonical templates

### contracts.ts

```ts
export interface ExampleResponseContract {
  // mirror backend DTO exactly, including casing
  id: string;
  // ...
}

export interface ExampleRequest {
  // request body shape
}
```

### mappers.ts

```ts
import type { ExampleResponseContract } from './contracts';

export interface Example {
  id: string;
  // domain shape
}

export function toExample(contract: ExampleResponseContract): Example {
  return {
    id: contract.id,
    // ...
  };
}
```

### mutations.ts (write)

```ts
import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type { ExampleRequest, ExampleResponseContract } from './contracts';
import { toExample, type Example } from './mappers';

export async function createExample(body: ExampleRequest): Promise<Example> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.post<
      ExampleResponseContract,
      ExampleRequest
    >('<base-path>', body, { headers });

    return toExample(contract);
  });
}
```

### queries.ts (read)

```ts
import 'server-only';

import { apiClient } from '@/shared/http/api-client';
import { executeAuthenticatedRequest } from '@/shared/auth/execute-authenticated-request';
import type { ExampleResponseContract } from './contracts';
import { toExample, type Example } from './mappers';

export async function getExample(id: string): Promise<Example> {
  return executeAuthenticatedRequest(async (headers) => {
    const contract = await apiClient.get<ExampleResponseContract>(
      `<base-path>/${id}`,
      { headers }
    );

    return toExample(contract);
  });
}
```

For paginated list endpoints, type the response as
`PaginatedResponse<ExampleResponseContract>` from
`@/shared/http/paginated-response` and map `response.data`.

### actions.ts

```ts
'use server';

import { HttpError } from '@/shared/http/http-error';
import { createExample } from './mutations';
import type { ExampleRequest } from './contracts';
import type { Example } from './mappers';

export type ExampleActionCode = 'unauthorized' | 'validation' | 'unknown';

export type ExampleActionResult =
  | { ok: true; data: Example }
  | { ok: false; code: ExampleActionCode; message: string };

function toFailure(error: unknown, fallback: string): ExampleActionResult {
  if (error instanceof HttpError && error.isUnauthorized) {
    return {
      ok: false,
      code: 'unauthorized',
      message: error.serverMessage ?? error.message,
    };
  }
  return {
    ok: false,
    code: 'unknown',
    message: error instanceof Error && error.message ? error.message : fallback,
  };
}

export async function createExampleAction(
  input: ExampleRequest
): Promise<ExampleActionResult> {
  try {
    return { ok: true, data: await createExample(input) };
  } catch (error) {
    return toFailure(error, 'Unable to complete this action right now.');
  }
}
```

### mappers.test.ts

```ts
import { toExample } from './mappers';

describe('toExample', () => {
  it('maps contract fields into domain shape', () => {
    const result = toExample({
      id: 'abc',
      // ...
    });

    expect(result.id).toBe('abc');
  });
});
```

## After scaffolding

1. Wire the action/query into the route's server entry (`page.tsx`) or a
   client component via a Server Action — see the `new-screen` skill.
2. Run `pnpm verify` (format:check + lint + typecheck + test + build).
3. Confirm contracts match the live backend DTO — open the Nest controller and
   its response DTO, do not trust the README.
