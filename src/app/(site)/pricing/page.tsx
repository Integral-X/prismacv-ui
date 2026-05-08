import type { Metadata } from 'next';
import { Footer } from '@/components/common/Footer';
import { Pricing } from '@/components/pages/landing-page/Pricing';

export const metadata: Metadata = {
  title: 'Pricing | PrismaCV',
  description:
    'Compare PrismaCV plans and choose the right package for your job search.',
};

export default function PricingPage() {
  return (
    <>
      <Pricing />
      <Footer />
    </>
  );
}
