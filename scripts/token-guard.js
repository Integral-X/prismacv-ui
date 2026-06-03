#!/usr/bin/env node

// token-guard — design-system enforcement gate (pre-commit, via lint-staged).
//
// Scans the staged files it is given for the design-system violations defined
// in .claude/skills/token-guard and docs/design-system.md:
//   1. Raw color literals        — #hex, rgb()/rgba(), hsl()/hsla()
//   2. Palette utility classes    — text-gray-500, bg-red-100, border-blue-700…
//   3. Deprecated UPPERCASE tokens — COLORS / SPACING / DIMENSIONS exports
//
// The token-definition layer is exempt: it is where the tokens (and shadcn's
// default token set) are declared, not feature code — src/design-system/** and
// the @theme mapping in src/app/globals.css.
//
// lint-staged passes the staged file paths as arguments. Any violation exits
// non-zero, which blocks the commit.

const fs = require('fs');

const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/;
const PALETTE_UTILITY =
  /\b(text|bg|border|ring|fill|stroke|from|to|via)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|pink|rose)-[0-9]{2,3}\b/;
const DEPRECATED_UPPERCASE = /\b(COLORS|SPACING|DIMENSIONS)\b/;

const isExempt = (file) =>
  file.includes('src/design-system/') || file.endsWith('src/app/globals.css');

const files = process.argv
  .slice(2)
  .filter((file) => /\.(ts|tsx|css)$/.test(file) && !isExempt(file));

const violations = [];

for (const file of files) {
  let contents;
  try {
    contents = fs.readFileSync(file, 'utf8');
  } catch {
    continue;
  }

  contents.split('\n').forEach((line, index) => {
    const where = `${file}:${index + 1}`;
    if (RAW_COLOR.test(line)) {
      violations.push(`${where} — raw color literal → ${line.trim()}`);
    }
    if (PALETTE_UTILITY.test(line)) {
      violations.push(`${where} — palette utility → ${line.trim()}`);
    }
    if (DEPRECATED_UPPERCASE.test(line)) {
      violations.push(`${where} — deprecated UPPERCASE token → ${line.trim()}`);
    }
  });
}

if (violations.length > 0) {
  console.error('\n✖ token-guard: design-system violations found:\n');
  for (const violation of violations) {
    console.error(`  ${violation}`);
  }
  console.error(
    '\nUse a semantic token class (see docs/design-system.md §3). If none fits,' +
      ' add a token to src/design-system/tokens.ts and run `pnpm tokens:generate`.\n'
  );
  process.exit(1);
}
