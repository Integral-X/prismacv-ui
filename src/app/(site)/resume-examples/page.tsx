import type { Metadata } from 'next';
import Link from 'next/link';
import { Footer } from '@/components/common/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ResumeExample {
  slug: string;
  role: string;
  title: string;
  summary: string;
}

const RESUME_EXAMPLES: ResumeExample[] = [
  {
    slug: 'software-engineer-example',
    role: 'Software Engineer',
    title: 'Backend platform engineer resume',
    summary:
      'Demonstrates impact-focused engineering bullets and measurable reliability outcomes.',
  },
  {
    slug: 'product-manager-example',
    role: 'Product Manager',
    title: 'B2B SaaS product manager resume',
    summary:
      'Highlights roadmap ownership, cross-functional delivery, and growth metrics.',
  },
  {
    slug: 'data-analyst-example',
    role: 'Data Analyst',
    title: 'Analytics and insights specialist resume',
    summary:
      'Showcases SQL, dashboard ownership, and decision-making impact for stakeholders.',
  },
  {
    slug: 'ux-designer-example',
    role: 'UX Designer',
    title: 'Product design portfolio resume',
    summary:
      'Covers user research, design systems, and conversion improvements across projects.',
  },
];

export const metadata: Metadata = {
  title: 'Resume Examples | PrismaCV',
  description:
    'See curated resume examples and use them as inspiration for your own CV.',
};

export default function ResumeExamplesPage() {
  return (
    <>
      <section className='mx-auto w-full max-w-6xl px-4 py-12'>
        <header className='mb-10 max-w-3xl space-y-3'>
          <h1 className='text-3xl font-semibold text-content-primary'>
            Resume examples
          </h1>
          <p className='text-content-secondary'>
            Review real-world resume structures by role, then adapt the ideas to
            your own profile.
          </p>
        </header>

        <div className='grid gap-4 md:grid-cols-2'>
          {RESUME_EXAMPLES.map((example) => (
            <Card key={example.slug} className='h-full'>
              <CardHeader className='space-y-2'>
                <p className='text-xs uppercase tracking-wide text-content-tertiary'>
                  {example.role}
                </p>
                <CardTitle className='text-xl'>{example.title}</CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <p className='text-sm text-content-secondary'>
                  {example.summary}
                </p>
                <Button asChild size='sm'>
                  <Link href={`/public/cv/${example.slug}`}>View example</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Footer />
    </>
  );
}
