# CrackCV

CrackCV is an all-in-one platform that helps users create professional resumes, track job applications, prepare for interviews, and identify skill gaps. The platform provides AI-powered insights for resume optimization, personalized learning roadmaps, and a centralized dashboard for career management.

## Architecture

This project follows the Feature-Sliced Design (FSD) architecture pattern for scalability and maintainability.

### FSD Layer Hierarchy

```
src/
├── app/          # Application entry point and providers
├── pages/        # Page components (routes)
├── widgets/      # Complex UI components
├── features/     # Business features
├── entities/     # Business entities
└── shared/       # Shared utilities and components
```

## Requirements

- Node.js 20.x or later
- pnpm
- Git

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/Integral-X/crackcv-ui.git
   cd crackcv-ui
   ```

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Run the development server:

   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Code Quality

Run ESLint to check for code quality issues:

```bash
pnpm lint
```

Automatically fix fixable issues:

```bash
pnpm lint:fix
```

## Code Formatting

This project uses Prettier for code formatting with automated pre-commit hooks to ensure consistent code style.

### Automatic Formatting (Recommended)

The project is configured with **Husky** and **lint-staged** for automatic formatting:

- **Pre-commit hooks** automatically format and lint staged files
- **VS Code integration** formats files on save
- **No manual intervention** required for most workflows

### Manual Commands

When you need to format manually:

```bash
# Format all files in the project
pnpm format

# Check formatting without fixing
pnpm format:check

# Format only staged files (used by pre-commit hook)
pnpm format:staged

# Fix everything (format + lint)
pnpm fix
```

### VS Code Integration

The project includes VS Code settings for automatic formatting:

- **Format on save** enabled
- **Auto-fix ESLint** issues on save
- **Prettier as default** formatter

Install the "Prettier - Code formatter" extension for the best experience.

### Troubleshooting

If formatting isn't working:

```bash
# Emergency format fix (if CI fails)
pnpm fix
git add .
git commit --amend --no-edit

# Skip hooks (use sparingly)
git commit --no-verify -m "emergency fix"

# Reinstall hooks
pnpm exec husky init
```

## Testing

This project uses Jest and React Testing Library for unit testing.

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Run tests with coverage report:

```bash
pnpm test:coverage
```
