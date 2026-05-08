import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/modules/auth/data/queries';
import {
  getFeatureFlagList,
  getUnleashServiceStatus,
} from '@/modules/features/data/queries';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminRefreshFlagsButton } from './admin-refresh-flags-button';

export const metadata = {
  title: 'Admin | PrismaCV',
  robots: 'noindex, nofollow',
};

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login?redirect=/admin');
  }
  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  const [flags, unleash] = await Promise.all([
    getFeatureFlagList(),
    getUnleashServiceStatus(),
  ]);

  return (
    <div className='container max-w-4xl py-10 px-4'>
      <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-semibold text-content-primary'>
            Platform admin
          </h1>
          <p className='text-sm text-content-secondary'>
            Signed in as {user.email}. Feature list uses the public flags API;
            use refresh to pull the latest definitions from Unleash (requires a
            platform admin access token in your session).
          </p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <AdminRefreshFlagsButton />
          <Button variant='outline' size='sm' asChild>
            <Link href='/dashboard'>Back to dashboard</Link>
          </Button>
        </div>
      </div>

      <Card className='mb-6'>
        <CardHeader>
          <CardTitle>Unleash</CardTitle>
          <CardDescription>Runtime feature-flag client</CardDescription>
        </CardHeader>
        <CardContent className='grid gap-2 text-sm text-content-secondary sm:grid-cols-2'>
          <div>
            Connected:{' '}
            <Badge variant={unleash.connected ? 'success' : 'secondary'}>
              {unleash.connected ? 'yes' : 'no'}
            </Badge>
          </div>
          <div>Total toggles: {unleash.totalFeatures}</div>
          <div>Enabled: {unleash.enabledFeatures}</div>
          <div>Disabled: {unleash.disabledFeatures}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Feature flags</CardTitle>
          <CardDescription>{flags.length} definitions</CardDescription>
        </CardHeader>
        <CardContent className='space-y-2'>
          {flags.length === 0 ? (
            <p className='text-sm text-content-muted'>No flags returned.</p>
          ) : (
            <ul className='divide-y divide-subtle rounded-md border border-subtle'>
              {flags.map((f) => (
                <li
                  key={f.name}
                  className='flex flex-wrap items-center justify-between gap-2 px-3 py-2 text-sm'
                >
                  <span className='font-mono text-content-primary'>
                    {f.name}
                  </span>
                  <Badge variant={f.enabled ? 'success' : 'secondary'}>
                    {f.enabled ? 'on' : 'off'}
                  </Badge>
                  {f.description ? (
                    <p className='w-full text-xs text-content-muted'>
                      {f.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
