import { Button } from '../../ui/button';
import Image from 'next/image';

export const Hero = () => {
  return (
    <section className='relative overflow-hidden'>
      <div className='container relative z-10 px-0'>
        <div className='grid lg:grid-cols-2 items-center gap-8 lg:gap-12'>
          {/* Left Content */}
          <div className='text-center lg:text-left space-y-6 pb-8 lg:pb-32'>
            {/* Decorative SVG elements */}
            <div className='flex items-center gap-2 justify-center lg:justify-start'>
              <Image
                src='/images/landing-page/hero_2.svg'
                alt='Decorative star'
                width={42}
                height={42}
                className='w-auto h-auto'
              />
              <Image
                src='/images/landing-page/hero_3.svg'
                alt='Decorative line'
                width={31}
                height={68}
                className='w-auto h-auto'
              />
            </div>
            <section className='text-[48px] font-medium leading-none'>
              <h1 className='inline'>
                <span className='inline text-primary'>PrismaCV</span> Builder
                makes your profile stand out at leading companies.
              </h1>
            </section>

            <p className='text-[16px] font-normal leading-none text-muted-foreground max-w-xl mx-auto lg:mx-0'>
              Stand out from the crowd with our easy-to-use resume builder.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Button
                className='w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90 rounded-md'
                asChild
              >
                <a href='/dashboard'>Build Your Resume</a>
              </Button>

              <Button
                variant='outline'
                className='w-full sm:w-auto border-primary text-primary hover:bg-primary/10 rounded-md'
                asChild
              >
                <a href='/ats-scorer'>Test your resume score</a>
              </Button>
            </div>
          </div>

          {/* Right Content - Hero SVG Image */}
          <div className='relative z-10 flex items-stretch w-full h-full m-0 p-0'>
            <div className='w-full h-full flex items-end'>
              <Image
                src='/images/landing-page/hero_1.svg'
                alt='Hero illustration showing resume builder'
                width={852}
                height={608}
                className='w-full h-full object-contain object-bottom'
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
