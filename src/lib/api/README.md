# API Architecture Documentation

This directory contains the complete API infrastructure for the application, following Next.js 16 best practices with TanStack Query and a Backend-for-Frontend (BFF) pattern.

## Architecture Overview

```
┌─────────────────┐
│  React Components│
│  (Client-side)   │
└────────┬─────────┘
         │
         │ Uses hooks (useAuth, useResumes, etc.)
         │
┌────────▼─────────┐
│  API Hooks       │
│  (src/hooks/api) │
└────────┬─────────┘
         │
         │ Calls service layer
         │
┌────────▼─────────┐
│  Service Layer   │
│  (src/lib/api/   │
│   services/)     │
└────────┬─────────┘
         │
         │ Uses apiClient
         │
┌────────▼─────────┐
│  Typed Fetch     │
│  Client          │
│  (apiClient)     │
└────────┬─────────┘
         │
         │ Calls Next.js Route Handlers
         │
┌────────▼─────────┐
│  Route Handlers  │
│  (BFF Layer)     │
│  (src/app/api/)  │
└────────┬─────────┘
         │
         │ Reads JWT from httpOnly cookie
         │ Proxies to external services
         │
┌────────▼─────────┐
│  External APIs   │
│  (Backend        │
│   Services)      │
└──────────────────┘
```

## Key Components

### 1. Typed Fetch Client (`client.ts`)

Production-ready fetch wrapper with:

- ✅ Automatic error handling and parsing
- ✅ Timeout support
- ✅ JWT token injection (via httpOnly cookies)
- ✅ Type-safe responses
- ✅ Network error handling

**Usage:**

```typescript
import { api } from '@/lib/api/client';

// GET request
const data = await api.get<User>('/api/users/profile');

// POST request
const result = await api.post<Resume>('/api/resumes', { title: 'My Resume' });

// File upload
const formData = new FormData();
formData.append('file', file);
const upload = await api.upload<UploadResponse>(
  '/api/resumes/upload',
  formData
);
```

### 2. Service Layer (`services/`)

Domain-specific service modules that encapsulate API calls:

- `auth.service.ts` - Authentication
- `resume.service.ts` - Resume management
- `job.service.ts` - Job tracking
- `user.service.ts` - User profile

**Usage:**

```typescript
import { authService } from '@/lib/api/services/auth.service';

const user = await authService.getMe();
```

### 3. API Hooks (`hooks/api/`)

TanStack Query hooks that provide:

- ✅ Automatic caching
- ✅ Background refetching
- ✅ Optimistic updates
- ✅ Error handling
- ✅ Loading states

**Usage:**

```typescript
import { useResumes, useCreateResume } from '@/lib/hooks/api';

function ResumeList() {
  const { data, isLoading, error } = useResumes({ page: 1, pageSize: 10 });
  const createMutation = useCreateResume();

  const handleCreate = () => {
    createMutation.mutate(
      { title: 'New Resume', templateId: 'template-1' },
      {
        onSuccess: () => {
          // Resume list automatically refetches
        },
      }
    );
  };

  // ...
}
```

### 4. Route Handlers (BFF Layer)

Next.js Route Handlers that:

- ✅ Read JWT from httpOnly cookies
- ✅ Proxy requests to external services
- ✅ Handle authentication
- ✅ Normalize responses
- ✅ Keep secrets server-side

**Example:** `src/app/api/resumes/route.ts`

## Environment Variables

Create a `.env.local` file based on `.env.example`:

```bash
NEXT_PUBLIC_MAIN_API_URL=http://localhost:3001/api
NEXT_PUBLIC_RESUME_API_URL=http://localhost:3002/api
NEXT_PUBLIC_PAYMENTS_API_URL=http://localhost:3003/api
NEXT_PUBLIC_INTEGRATIONS_API_URL=http://localhost:3004/api
```

## Authentication Flow

1. **Login:** User submits credentials → Route Handler calls backend → Sets httpOnly cookie
2. **Authenticated Requests:** Browser automatically includes httpOnly cookie → Route Handler reads cookie → Forwards JWT to backend service
3. **Logout:** Route Handler clears httpOnly cookie

**Security Benefits:**

- JWT never exposed to JavaScript (httpOnly cookie)
- XSS attacks cannot steal tokens
- CSRF protection via SameSite cookie attribute

## Error Handling

All errors follow a consistent structure:

```typescript
{
  error: {
    code: 'ERROR_CODE',
    message: 'Human-readable message',
    details: {} // Optional additional details
  }
}
```

The `apiClient` automatically throws `ApiError` instances that you can catch:

```typescript
import { ApiError } from '@/lib/api/types';

try {
  await api.get('/api/resumes');
} catch (error) {
  if (error instanceof ApiError) {
    console.error(error.status, error.code, error.message);
  }
}
```

## Query Keys

Query keys are managed centrally in `src/lib/query/keys.ts` to prevent collisions:

```typescript
import { queryKeys } from '@/lib/query/keys';

// Invalidate all resume queries
queryClient.invalidateQueries({ queryKey: queryKeys.resumes.all });

// Invalidate specific resume
queryClient.invalidateQueries({ queryKey: queryKeys.resumes.detail(id) });
```

## Best Practices

1. **Always use hooks** - Don't call services directly from components
2. **Use service layer** - Don't call `apiClient` directly from hooks
3. **Route Handlers only** - Client components should only call `/api/*` routes, never external URLs
4. **Type everything** - All API responses should be typed
5. **Handle errors** - Use TanStack Query's error handling features
6. **Optimistic updates** - Use mutations with `onMutate` for instant UI updates

## Adding a New Service

1. Create service file: `src/lib/api/services/my-service.service.ts`
2. Add endpoints: `src/lib/api/endpoints.ts` → `INTERNAL_API_ROUTES.myService`
3. Create hooks: `src/hooks/api/useMyService.ts`
4. Create Route Handler: `src/app/api/my-service/route.ts`
5. Add query keys: `src/lib/query/keys.ts` → `queryKeys.myService`
