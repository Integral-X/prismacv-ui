import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-primary px-4">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-primary/10">
          <FileQuestion className="h-8 w-8 text-brand-primary" />
        </div>
        <h1 className="text-2xl font-semibold text-content-primary mb-2">
          Page not found
        </h1>
        <p className="text-content-secondary mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild variant="default">
          <Link href="/">Go home</Link>
        </Button>
      </div>
    </div>
  );
}
