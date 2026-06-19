"use client";

import Image from "next/image";
import Link from "next/link";

const footerSections = [
  {
    title: "Get Started",
    links: [
      { label: "Create Resume", href: "/login", highlighted: true },
      { label: "Pricing", href: "/pricing" },
      { label: "Resume Templates", href: "/resume-templates" },
      { label: "Resume Examples", href: "/resume-examples" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Templates", href: "/templates" },
      { label: "ATS Scorer", href: "/ats-scorer" },
      { label: "Cover Letters", href: "/cover-letters" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Cookie Preferences", href: "/cookie-preferences" },
    ],
  },
];

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border-subtle bg-surface-page pt-14 pb-8">
      <div className="container mx-auto px-4">
        <div className="mb-12 grid grid-cols-1 gap-8 border-b border-border-subtle pb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.svg"
                alt="PrismaCV Logo"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="max-w-xs text-sm text-content-secondary">
              Build resumes, optimize for ATS, and manage your job search in one
              workflow.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="mb-4 text-lg font-semibold">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-muted-foreground transition-colors hover:text-primary ${
                        link.highlighted ? "text-primary" : ""
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-lg">©</span>
            <span>{currentYear} PrismaCV. All rights reserved.</span>
          </div>
          <div className="flex gap-6 text-xs sm:text-sm">
            <Link
              href="/privacy-policy"
              className="hover:text-primary transition-colors"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms-of-service"
              className="hover:text-primary transition-colors"
            >
              Terms of service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
