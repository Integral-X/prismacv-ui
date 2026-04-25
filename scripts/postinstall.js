#!/usr/bin/env node

// Only install Playwright in development environments
// Skip in Docker builds and production deployments

const { execSync } = require('child_process');
const fs = require('fs');

function shouldInstallPlaywright() {
  // Skip if in Docker build
  if (process.env.DOCKER_BUILD || fs.existsSync('/.dockerenv')) {
    console.log('Skipping Playwright installation in Docker environment');
    return false;
  }

  // Skip if NODE_ENV is production
  if (process.env.NODE_ENV === 'production') {
    console.log('Skipping Playwright installation in production');
    return false;
  }

  // Skip if CI environment (will be installed explicitly in workflows)
  if (process.env.CI) {
    console.log(
      'Skipping Playwright installation in CI (will be installed explicitly)'
    );
    return false;
  }

  // Install in development
  return true;
}

if (shouldInstallPlaywright()) {
  try {
    console.log('Installing Playwright browsers...');
    execSync('playwright install --with-deps', { stdio: 'inherit' });
    console.log('Playwright installation completed');
  } catch (error) {
    console.warn('Playwright installation failed, but continuing...');
    console.warn(error.message);
  }
} else {
  console.log('Playwright installation skipped');
}
