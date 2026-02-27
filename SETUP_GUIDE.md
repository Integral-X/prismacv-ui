# PrismaCV - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v18.x or later)
   - Check your version: `node --version`
   - If not installed, download from [nodejs.org](https://nodejs.org/)

2. **pnpm** (recommended package manager)
   - Install with npm: `npm install -g pnpm`
   - Check installation: `pnpm --version`

3. **Git**
   - Check installation: `git --version`
   - If not installed, download from [git-scm.com](https://git-scm.com/)

## Initial Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prismacv-ui
```

### 2. Install Dependencies

```bash
pnpm install
```

This will install all the required packages listed in `package.json`.

### 3. Environment Configuration

Create a local environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and configure the following variables:

```env
# Next.js secrets
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# OAuth providers (optional for development)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# API keys for external services
GOOGLE_DOCUMENT_AI_KEY=your-google-document-ai-key

# Backend API endpoints
NEXT_PUBLIC_MAIN_API_URL=http://localhost:3001/api
NEXT_PUBLIC_RESUME_API_URL=http://localhost:3002/api
NEXT_PUBLIC_PAYMENTS_API_URL=http://localhost:3003/api
NEXT_PUBLIC_INTEGRATIONS_API_URL=http://localhost:3004/api
```

For development, you can generate a NEXTAUTH_SECRET with:

```bash
openssl rand -base64 32
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `pnpm dev` - Starts the development server
- `pnpm build` - Builds the application for production
- `pnpm start` - Starts the production server
- `pnpm lint` - Runs ESLint for code quality checks
- `pnpm test` - Runs the test suite
- `pnpm test:watch` - Runs tests in watch mode

## Project Structure

The project follows Feature-Sliced Design (FSD) architecture:

```
src/
├── app/          # Application entry point and providers
├── pages/        # Page components (routes)
├── widgets/      # Complex UI components
├── features/     # Business features
├── entities/     # Business entities
└── shared/       # Shared utilities and components
```

## Development Workflow

### Creating a New Feature

1. Create a new branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Follow the FSD structure when adding new functionality:
   - Create a new slice in the appropriate layer (features/entities/widgets)
   - Organize code into segments (ui, model, api, lib)
   - Export public APIs through index files

### Code Quality

Before committing, ensure code quality:

```bash
pnpm lint
pnpm test
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   - Kill the process using port 3000:
     ```bash
     lsof -ti:3000 | xargs kill -9
     ```

2. **Dependency installation issues**
   - Clear pnpm cache:
     ```bash
     pnpm store prune
     ```
   - Remove node_modules and reinstall:
     ```bash
     rm -rf node_modules
     pnpm install
     ```

### Getting Help

If you encounter issues:

1. Check the project documentation in `PROJECT_DOCS.md`
2. Review the README.md file
3. Look at existing code for examples
4. Reach out to the team for assistance

## Next Steps

After successful setup, you can:

1. Explore the existing components in the `src` directory
2. Review the FSD architecture in `PROJECT_DOCS.md`
3. Start implementing features according to the requirements
4. Run the test suite to ensure everything works correctly
