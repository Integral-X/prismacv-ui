'use client';

import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import Image from "next/image";

interface RouteProps {
  href: string;
  label: string;
}

const routeList: RouteProps[] = [
  {
    href: "#templates",
    label: "Templates",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky top-0 z-40 w-full bg-white">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 w-screen flex justify-between ">
          <NavigationMenuItem className="font-bold flex">
            <a
              rel="noreferrer noopener"
              href="/"
              className="font-bold text-xl flex items-center gap-2"
            >
              <Image
                src="/logo.svg"
                alt="PrismaCV Logo"
                width={32}
                height={32}
                className="w-auto h-auto"
              />
            </a>
          </NavigationMenuItem>

          {/* mobile */}
          <span className="flex md:hidden">
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  <span className="sr-only">Menu Icon</span>
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    PrismaCV
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col justify-center items-center gap-2 mt-4">
                  {routeList.map(({ href, label }: RouteProps) => (
                    <Button
                      key={label}
                      variant="ghost"
                      asChild
                    >
                      <a
                        rel="noreferrer noopener"
                        href={href}
                        onClick={() => setIsOpen(false)}
                      >
                        {label}
                      </a>
                    </Button>
                  ))}
                  <Button
                    variant="default"
                    className="w-[110px]"
                    asChild
                  >
                    <a
                      href="/login"
                      onClick={() => setIsOpen(false)}
                    >
                      Get Started
                    </a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <nav className="hidden md:flex gap-2">
            {routeList.map((route: RouteProps) => (
              <Button
                key={route.label}
                variant="ghost"
                className="text-[17px]"
                asChild
              >
                <a
                  rel="noreferrer noopener"
                  href={route.href}
                >
                  {route.label}
                </a>
              </Button>
            ))}
          </nav>

          <div className="hidden md:flex gap-2">
            <Button variant="default" asChild>
              <a href="/login">
                Get Started
              </a>
            </Button>
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
