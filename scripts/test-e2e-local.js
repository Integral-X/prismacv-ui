#!/usr/bin/env node

// Script to run E2E tests locally with proper setup

const { spawn, execSync } = require('child_process');
const fs = require('fs');

console.log('🚀 Starting local E2E test setup...');

// Check if build exists
if (!fs.existsSync('.next')) {
  console.log('📦 Building application first...');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// Start the application
console.log('🌐 Starting Next.js application...');
const server = spawn('pnpm', ['start'], {
  stdio: 'pipe',
  detached: false,
});

let serverReady = false;

server.stdout.on('data', (data) => {
  const output = data.toString();
  console.log('Server:', output.trim());
  if (output.includes('Ready') || output.includes('started server')) {
    serverReady = true;
  }
});

server.stderr.on('data', (data) => {
  console.error('Server Error:', data.toString().trim());
});

// Wait for server to be ready
console.log('⏳ Waiting for server to be ready...');
const maxWait = 30000; // 30 seconds
const startTime = Date.now();

const checkServer = () => {
  if (serverReady || Date.now() - startTime > maxWait) {
    if (serverReady) {
      console.log('✅ Server is ready! Running E2E tests...');

      // Run Playwright tests
      const playwright = spawn('pnpm', ['exec', 'playwright', 'test'], {
        stdio: 'inherit',
      });

      playwright.on('close', (code) => {
        console.log(`\n🎭 Playwright tests completed with code ${code}`);

        // Cleanup
        console.log('🧹 Cleaning up...');
        server.kill();
        process.exit(code);
      });
    } else {
      console.error('❌ Server failed to start within 30 seconds');
      server.kill();
      process.exit(1);
    }
  } else {
    setTimeout(checkServer, 1000);
  }
};

setTimeout(checkServer, 2000); // Give server a moment to start

// Handle cleanup on exit
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, cleaning up...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, cleaning up...');
  server.kill();
  process.exit(0);
});
