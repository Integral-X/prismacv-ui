import * as React from 'react';
import { cn } from '@/lib/utils';

const NavigationMenu = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative z-10 flex max-w-max flex-1 items-center justify-center',
      className
    )}
    {...props}
  />
));
NavigationMenu.displayName = 'NavigationMenu';

const NavigationMenuList = React.forwardRef<
  HTMLUListElement,
  React.HTMLAttributes<HTMLUListElement>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    className={cn(
      'group flex flex-1 list-none items-center justify-center',
      className
    )}
    {...props}
  />
));
NavigationMenuList.displayName = 'NavigationMenuList';

const NavigationMenuItem = React.forwardRef<
  HTMLLIElement,
  React.HTMLAttributes<HTMLLIElement>
>(({ className, ...props }, ref) => (
  <li ref={ref} className={cn('', className)} {...props} />
));
NavigationMenuItem.displayName = 'NavigationMenuItem';

const NavigationMenuLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement>
>(({ className, children, ...props }, ref) => (
  <a ref={ref} className={cn('', className)} {...props}>
    {children}
  </a>
));
NavigationMenuLink.displayName = 'NavigationMenuLink';

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
};
