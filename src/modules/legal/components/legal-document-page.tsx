import Link from "next/link";
import ReactMarkdown from "react-markdown";
import type { LegalDocument } from "@/modules/legal/data/legal-content";

interface LegalDocumentPageProps {
  document: LegalDocument;
}

export function LegalDocumentPage({ document }: LegalDocumentPageProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-10">
      <header className="mb-8 space-y-3">
        <h1 className="text-3xl font-semibold text-content-primary">
          {document.title}
        </h1>
        <p className="text-sm text-content-secondary">{document.description}</p>
        <p className="text-xs text-content-tertiary">
          Last updated: {document.lastUpdated}
        </p>
      </header>

      <article className="space-y-5 text-content-secondary">
        <ReactMarkdown
          components={{
            h2: ({ children }) => (
              <h2 className="mt-8 text-2xl font-semibold text-content-primary">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="mt-6 text-xl font-medium text-content-primary">
                {children}
              </h3>
            ),
            p: ({ children }) => <p className="leading-7">{children}</p>,
            ul: ({ children }) => (
              <ul className="list-disc space-y-2 pl-6">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal space-y-2 pl-6">{children}</ol>
            ),
            a: ({ href, children }) => (
              <Link
                href={href ?? "#"}
                className="text-interactive-link underline transition-colors hover:text-interactive-link-hover"
              >
                {children}
              </Link>
            ),
            strong: ({ children }) => (
              <strong className="font-semibold text-content-primary">
                {children}
              </strong>
            ),
          }}
        >
          {document.markdown}
        </ReactMarkdown>
      </article>
    </section>
  );
}
