'use client';

import Image from 'next/image';
import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { Button } from '../ui/button';
import { UserAccountMenu } from './user-account-menu';

interface RouteProps {
  href: string;
  label: string;
}

export interface NavbarUser {
  email: string;
  name?: string;
}

interface NavbarClientProps {
  currentUser: NavbarUser | null;
}

const publicRouteList: RouteProps[] = [
  {
    href: '#templates',
    label: 'Templates',
  },
  {
    href: '#pricing',
    label: 'Pricing',
  },
  {
    href: '#faq',
    label: 'FAQ',
  },
];

const authenticatedRouteList: RouteProps[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
  },
  {
    href: '/jobs',
    label: 'Jobs',
  },
  {
    href: '/skills',
    label: 'Skills',
  },
  {
    href: '/interview',
    label: 'Interview',
  },
];

export function NavbarClient({ currentUser }: NavbarClientProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();
  const isLandingPage = pathname === '/';
  const showAccountMenu = Boolean(currentUser && !isLandingPage);
  const showGetStarted = isLandingPage || !currentUser;
  const routeList = isLandingPage
    ? publicRouteList
    : currentUser
      ? authenticatedRouteList
      : publicRouteList;

  return (
    <header className='sticky top-0 z-40 w-full bg-surface-card shadow-(--shadow-sm)'>
      <NavigationMenu className='mx-auto'>
        <NavigationMenuList className='container h-14 w-screen flex justify-between '>
          <NavigationMenuItem className='font-bold flex'>
            <a
              rel='noreferrer noopener'
              href='/'
              className='font-bold text-xl flex items-center gap-2'
            >
              <Image
                src='/logo.svg'
                alt='PrismaCV Logo'
                width={32}
                height={32}
                className='w-auto h-auto'
              />
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className='flex items-center gap-2 md:hidden'>
            {showAccountMenu && currentUser ? (
              <UserAccountMenu user={currentUser} />
            ) : null}
            {showGetStarted ? (
              <Button variant='default' size='sm' asChild>
                <a href='/onboarding'>Get Started</a>
              </Button>
            ) : null}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger className='px-2'>
                <Menu
                  className='flex h-5 w-5'
                  onClick={() => setIsOpen(true)}
                />
                <span className='sr-only'>Menu Icon</span>
              </SheetTrigger>

              <SheetContent side={'left'}>
                <SheetHeader>
                  <SheetTitle className='font-bold text-xl'>
                    PrismaCV
                  </SheetTitle>
                </SheetHeader>
                <nav className='flex flex-col justify-center items-center gap-2 mt-4'>
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Button key={label} variant='ghost' asChild>
                      <a
                        rel='noreferrer noopener'
                        href={href}
                        onClick={() => setIsOpen(false)}
                      >
                        {label}
                      </a>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className='hidden md:flex gap-2'>
            {routeList.map((route: RouteProps) => (
              <Button
                key={route.label}
                variant='ghost'
                className='text-[17px]'
                asChild
              >
                <a rel='noreferrer noopener' href={route.href}>
                  {route.label}
                </a>
              </Button>
            ))}
          </nav>

          <div className='hidden md:flex items-center gap-2'>
            {showAccountMenu && currentUser ? (
              <UserAccountMenu user={currentUser} />
            ) : null}
            {showGetStarted ? (
              <Button variant='default' asChild>
                <a href='/onboarding'>Get Started</a>
              </Button>
            ) : null}
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
