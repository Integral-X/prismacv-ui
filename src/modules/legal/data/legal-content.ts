import { readFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";

export type LegalDocumentSlug =
  | "privacy-policy"
  | "terms-of-service"
  | "cookie-preferences";

interface LegalDocumentMeta {
  title: string;
  description: string;
  lastUpdated: string;
}

export interface LegalDocument extends LegalDocumentMeta {
  markdown: string;
}

const LEGAL_DOCUMENTS: Record<LegalDocumentSlug, LegalDocumentMeta> = {
  "privacy-policy": {
    title: "Privacy Policy",
    description:
      "How PrismaCV collects, uses, and protects your personal information.",
    lastUpdated: "May 8, 2026",
  },
  "terms-of-service": {
    title: "Terms of Service",
    description: "Rules for using PrismaCV products, features, and services.",
    lastUpdated: "May 8, 2026",
  },
  "cookie-preferences": {
    title: "Cookie Preferences",
    description:
      "Manage analytics and product cookies used by PrismaCV on this site.",
    lastUpdated: "May 8, 2026",
  },
};

export const getLegalDocument = cache(
  async (slug: LegalDocumentSlug): Promise<LegalDocument> => {
    const meta = LEGAL_DOCUMENTS[slug];
    const filePath = path.join(process.cwd(), "content", "legal", `${slug}.md`);
    const markdown = await readFile(filePath, "utf8");

    return {
      ...meta,
      markdown,
    };
  }
);
