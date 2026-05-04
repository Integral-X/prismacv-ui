'use client';

import { useState } from 'react';
import { Button } from '../../ui/button';

interface PricingTier {
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  buttonText: string;
  featured?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    description:
      'Ideal for individuals who need quick access to basic features.',
    monthlyPrice: 0,
    yearlyPrice: 0,
    features: [
      'All resume templates',
      'Basic resume sections',
      'PrismaCV branding',
      'Maximum 15 section items',
      'Access to all design tools',
    ],
    buttonText: 'Get Started Now',
  },
  {
    name: 'Professional',
    description:
      'Ideal for individuals who who need advanced features and tools.',
    monthlyPrice: 25,
    yearlyPrice: 19,
    features: [
      '150 resumes and cover letters',
      'All resume templates',
      'Real-time content suggestions',
      'ATS check (Applicant Tracking System)',
      'Pro resume sections',
      'Unlimited section items',
    ],
    buttonText: 'Get Started Now',
    featured: true,
  },
  {
    name: 'Ultimate',
    description:
      'Ideal for individuals who need quick access to basic features.',
    monthlyPrice: 30,
    yearlyPrice: 23,
    features: [
      '150 resumes and cover letters',
      'All resume templates',
      'Real-time content suggestions',
      'ATS check',
      'Pro resume sections',
      'Unlimited section items',
    ],
    buttonText: 'Get Started Now',
  },
];

const CheckIcon = ({ featured }: { featured?: boolean }) => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 20 20'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='flex-shrink-0'
  >
    <circle
      cx='10'
      cy='10'
      r='10'
      fill={featured ? 'rgba(255, 255, 255, 0.2)' : '#E0F2F1'}
    />
    <path
      d='M6 10L9 13L14 7'
      stroke={featured ? 'white' : '#4ECCA3'}
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <section
      className='py-16 md:py-20 bg-linear-to-b from-background to-surface-page'
      id='pricing'
    >
      <div className='container mx-auto px-4'>
        {/* Header */}
        <div className='text-center mb-12 max-w-4xl mx-auto'>
          <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold mb-4'>
            Invest in Your Future, One Resume at a Time
          </h2>
          <p className='text-lg text-muted-foreground mb-8'>
            Simple tools. Fair prices. PrismaCV helps you create polished
            resumes, standout applications, cover letters, and personal websites
            with ease.
          </p>

          {/* Toggle Switch */}
          <div className='flex items-center justify-center relative'>
            <div className='inline-flex items-center bg-surface-page rounded-full p-1'>
              <button
                onClick={() => setIsYearly(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  !isYearly
                    ? 'bg-surface-card text-content-primary shadow-sm'
                    : 'bg-transparent text-content-secondary'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setIsYearly(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  isYearly
                    ? 'bg-primary text-white shadow-sm'
                    : 'bg-transparent text-content-secondary'
                }`}
              >
                Yearly
              </button>
            </div>

            {/* Save 25% Badge - Positioned beside the tabs */}
            <div className='absolute left-1/2 flex items-center ml-44 mt-8'>
              <img
                src='/images/landing-page/pricing_arrow.svg'
                alt=''
                className='absolute -left-20 -top-6 w-24 h-20'
                aria-hidden='true'
              />
              <span className='text-primary font-medium relative z-10 mt-4'>
                Save 25%
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto'>
          {pricingTiers.map((tier) => (
            <div
              key={tier.name}
              className={`rounded-2xl p-8 transition-all duration-300 ${
                tier.featured
                  ? 'bg-primary text-white scale-105 shadow-2xl'
                  : 'bg-surface-card border-2 border-primary/20 shadow-lg hover:shadow-xl'
              }`}
            >
              {/* Card Header */}
              <div className='mb-6'>
                <h3
                  className={`text-2xl font-semibold mb-2 ${tier.featured ? 'text-white' : 'text-content-primary'}`}
                >
                  {tier.name}
                </h3>
                <p
                  className={`text-sm ${tier.featured ? 'text-white/80' : 'text-muted-foreground'}`}
                >
                  {tier.description}
                </p>
              </div>

              {/* Price */}
              <div className='mb-6'>
                <div className='flex items-baseline gap-2'>
                  <span
                    className={`text-5xl font-bold ${tier.featured ? 'text-white' : 'text-content-primary'}`}
                  >
                    ${isYearly ? tier.yearlyPrice : tier.monthlyPrice}
                  </span>
                  <span
                    className={`text-lg ${tier.featured ? 'text-white/70' : 'text-muted-foreground'}`}
                  >
                    / Month
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-8 py-6 rounded-lg text-base font-medium transition-all ${
                  tier.featured
                    ? 'bg-white text-primary hover:bg-surface-page'
                    : 'bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white'
                }`}
                asChild
              >
                <a href='/login'>{tier.buttonText}</a>
              </Button>

              {/* Features */}
              <ul className='space-y-4'>
                {tier.features.map((feature, index) => (
                  <li key={index} className='flex items-start gap-3'>
                    <CheckIcon featured={tier.featured} />
                    <span
                      className={`text-sm ${tier.featured ? 'text-white' : 'text-content-secondary'}`}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
