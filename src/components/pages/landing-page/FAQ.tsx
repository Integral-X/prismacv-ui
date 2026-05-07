'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '../../ui/button';

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: 'What is the definition of a resume?',
    answer:
      "A resume is a formal document that provides an overview of your professional qualifications, including your work experience, education, skills, and achievements. It's typically used when applying for jobs to showcase your background to potential employers.",
  },
  {
    question: 'How do I choose the right resume template?',
    answer:
      "Choose a resume template based on your industry, experience level, and the job you're applying for. Creative fields may allow for more design flexibility, while corporate positions typically require traditional formats. Consider templates that highlight your strengths and are ATS-friendly.",
  },
  {
    question: 'What does an ATS-friendly resume mean?',
    answer:
      'An ATS-friendly resume is designed to be easily read by Applicant Tracking Systems - software that many companies use to screen resumes. This means using standard formatting, avoiding complex graphics, using common section headings, and including relevant keywords from the job description.',
  },
  {
    question: 'What resume file format can I download in?',
    answer:
      'You can download your resume in multiple formats including PDF, Word (DOCX), and plain text. PDF is the most recommended format as it preserves your formatting across all devices and is universally accepted by employers.',
  },
  {
    question: 'Is it worth paying for a resume builder?',
    answer:
      'A paid resume builder can be worth it if you want access to premium templates, advanced features like ATS optimization, cover letter builders, and expert guidance. It saves time and helps ensure your resume follows best practices, potentially increasing your chances of landing interviews.',
  },
  {
    question: 'Should I make a different resume for every job application?',
    answer:
      "Yes, you should customize your resume for each job application. Tailor your experience, skills, and keywords to match the specific job description. This shows employers you're genuinely interested in the position and helps your resume pass through ATS systems.",
  },
  {
    question: 'What makes Prisma CV the best resume builder?',
    answer:
      'Prisma CV offers AI-powered resume optimization, ATS scoring, a wide variety of professional templates, grammar checking, and personalized content suggestions. Our platform is designed to help you create a standout resume that gets past applicant tracking systems and impresses hiring managers.',
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className='py-16 md:py-20 bg-background' id='faq'>
      <div className='container mx-auto px-4'>
        {/* Section Title */}
        <h2 className='text-3xl md:text-4xl lg:text-5xl font-semibold text-center mb-12 md:mb-16'>
          Frequently Asked Questions
        </h2>

        <div className='grid lg:grid-cols-2 gap-12 lg:gap-16 items-start'>
          {/* Left - FAQ List */}
          <div className='space-y-4'>
            {faqData.map((faq, index) => (
              <div
                key={faq.question}
                className='border border-border-subtle rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md'
              >
                <button
                  id={`faq-btn-${index}`}
                  type='button'
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                  className='w-full px-6 py-4 flex items-center justify-between text-left bg-surface-card hover:bg-surface-page transition-colors cursor-pointer'
                >
                  <span className='text-base md:text-lg font-medium pr-4'>
                    {faq.question}
                  </span>
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-300 ${
                      openIndex === index ? 'rotate-45' : ''
                    }`}
                  >
                    <svg
                      width='16'
                      height='16'
                      viewBox='0 0 16 16'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='text-primary'
                    >
                      <path
                        d='M8 3V13M3 8H13'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                      />
                    </svg>
                  </div>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role='region'
                  aria-labelledby={`faq-btn-${index}`}
                  aria-hidden={openIndex !== index}
                  className={`grid transition-all duration-300 ease-in-out ${
                    openIndex === index
                      ? 'grid-rows-[1fr] opacity-100'
                      : 'grid-rows-[0fr] opacity-0'
                  }`}
                >
                  <div className='overflow-hidden'>
                    <div className='px-6 py-4 bg-surface-page border-t border-border-subtle'>
                      <p className='text-muted-foreground leading-relaxed'>
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right - Illustration and Contact */}
          <div className='flex flex-col items-center lg:items-start'>
            {/* FAQ Illustration */}
            <div className='mb-8'>
              <Image
                src='/images/landing-page/faq.svg'
                alt='FAQ illustration'
                width={365}
                height={370}
                className='w-full h-auto max-w-md'
              />
            </div>

            {/* Contact Section */}
            <div className='text-center lg:text-left max-w-md'>
              <p className='text-base md:text-lg text-muted-foreground mb-6'>
                Can&apos;t find the answer to your question? Send us an email
                and we&apos;ll get back to you as soon as possible
              </p>
              <Button
                className='bg-primary hover:bg-primary/90 text-content-inverse px-8 py-3 rounded-md'
                asChild
              >
                <a href='mailto:support@prismacv.com'>Ask Anything</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
