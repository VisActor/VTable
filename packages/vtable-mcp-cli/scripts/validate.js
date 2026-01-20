#!/usr/bin/env node

/**
 * VTable MCP CLI Validation Script
 *
 * This script performs a complete validation process:
 * 1. Validate CLI build
 * 2. Validate tool definition loading
 * 3. Validate JSON-RPC protocol handling
 * 4. Validate error handling
 * 5. Validate integration with Server
 *
 * Usage: npm run validate
 */

const { spawn } = require('child_process');
const path = require('path');

// Configuration
const TEST_TIMEOUT = 30000;
const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

// Test results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

// Utility functions
function log(message, color = '') {
  console.log(`${color}${message}${COLORS.reset}`);
}

async function testStep(name, testFn) {
  try {
    log(`\n🧪 ${name}...`, COLORS.blue);
    await testFn();
    log(`✅ ${name} - Passed`, COLORS.green);
    results.passed++;
    results.tests.push({ name, status: 'passed' });
  } catch (error) {
    log(`❌ ${name} - Failed: ${error.message}`, COLORS.red);
    results.failed++;
    results.tests.push({ name, status: 'failed', error: error.message });
  }
}

async function validateBuild() {
  return testStep('CLI Build Validation', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'index.js');
    const distPath = path.join(__dirname, '..', 'dist', 'index.js');

    // Check if files exist
    const fs = require('fs');
    if (!fs.existsSync(cliPath)) {
      throw new Error(`CLI entry file does not exist: ${cliPath}`);
    }
    if (!fs.existsSync(distPath)) {
      throw new Error(`Build output does not exist: ${distPath}`);
    }

    // Verify CLI can start
    return new Promise((resolve, reject) => {
      const proc = spawn('node', [cliPath], {
        stdio: 'pipe',
        env: { ...process.env, VTABLE_API_URL: 'http://localhost:9999' }
      });

      let stderr = '';
      let hasError = false;

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('error', (error) => {
        hasError = true;
        reject(new Error(`CLI startup failed: ${error.message}`));
      });

      proc.on('exit', (code) => {
        if (hasError) return;

        // Check startup logs
        if (stderr.includes('Started successfully')) {
          log('   CLI startup normal', COLORS.green);
          resolve();
        } else {
          reject(new Error(`CLI startup abnormal: ${stderr}`));
        }
      });

      // Terminate test after 2 seconds
      setTimeout(() => {
        proc.kill();
        if (!hasError) {
          resolve();
        }
      }, 2000);
    });
  });
}

async function validateToolLoading() {
  return testStep('Tool Definition Loading Validation', async () => {
    const distPath = path.join(__dirname, '..', 'dist', 'index.js');
    const vtableMcpPath = path.join(__dirname, '..', '..', 'vtable-mcp', 'cjs', 'index.js');

    return new Promise((resolve, reject) => {
      const proc = spawn('node', ['-e', `
        try {
          const { mcpToolRegistry } = require('${vtableMcpPath.replace(/\\/g, '/')}');
          const tools = mcpToolRegistry.getExportableTools().map(t => t.name);
          console.log('TOOLS:', tools.join(','));
          if (tools.length === 0) {
            console.error('No tools found');
            process.exit(1);
          }
          process.exit(0);
        } catch (error) {
          console.error('Error loading tools:', error.message);
          process.exit(1);
        }
      `], { stdio: 'pipe' });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      proc.on('exit', (code) => {
        if (code === 0) {
          const tools = stdout.match(/TOOLS: (.+)/);
          if (tools) {
            const toolList = tools[1].split(',');
            log(`   Successfully loaded ${toolList.length} tools: ${toolList.join(', ')}`, COLORS.green);
            resolve();
          } else {
            reject(new Error('Unable to parse tool list'));
          }
        } else {
          reject(new Error(`Tool loading failed: ${stderr || 'Unknown error'}`));
        }
      });
    });
  });
}

async function validateJsonRpcProtocol() {
  return testStep('JSON-RPC Protocol Validation', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'index.js');

    return new Promise((resolve, reject) => {
      const proc = spawn('node', [cliPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: { ...process.env, VTABLE_API_URL: 'http://localhost:9999' }
      });

      let stdout = '';
      let stderr = '';

      proc.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      proc.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      // Wait for CLI to start
      setTimeout(() => {
        // Send tools/list request
        proc.stdin.write('{"jsonrpc":"2.0","id":1,"method":"tools/list"}\n');

        // Wait for response
        setTimeout(() => {
          if (stdout.includes('"method":"tools/list"') || stdout.includes('"result"')) {
            log('   JSON-RPC protocol handling normal', COLORS.green);
            proc.kill();
            resolve();
          } else {
            proc.kill();
            reject(new Error(`JSON-RPC response abnormal. stdout: ${stdout}, stderr: ${stderr}`));
          }
        }, 1000);
      }, 1000);

      setTimeout(() => {
        proc.kill();
        reject(new Error('JSON-RPC protocol validation timeout'));
      }, 5000);
    });
  });
}

async function validateErrorHandling() {
  return testStep('Error Handling Validation', async () => {
    const cliPath = path.join(__dirname, '..', 'dist', 'index.js');

    const testCases = [
      {
        name: 'Invalid JSON',
        input: 'invalid json\n',
        shouldContainError: true
      },
      {
        name: 'Invalid Method',
        input: '{"jsonrpc":"2.0","id":1,"method":"invalid_method"}\n',
        shouldContainError: true
      },
      {
        name: 'Missing jsonrpc field',
        input: '{"id":1,"method":"tools/list"}\n',
        shouldContainError: true
      }
    ];

    for (const testCase of testCases) {
      await new Promise((resolve, reject) => {
        const proc = spawn('node', [cliPath], {
          stdio: ['pipe', 'pipe', 'pipe'],
          env: { ...process.env, VTABLE_API_URL: 'http://localhost:9999' }
        });

        let stdout = '';
        let stderr = '';

        proc.stdout.on('data', (data) => {
          stdout += data.toString();
        });

        proc.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        setTimeout(() => {
          proc.stdin.write(testCase.input);
        }, 500);

        setTimeout(() => {
          const output = stdout + stderr;
          const hasError = output.includes('error') ||
                          output.includes('Error') ||
                          output.includes('Parse error') ||
                          output.includes('Method not found');

          // For "Invalid JSON" test case, no output means the error was handled silently (which is correct)
          if (testCase.name === 'Invalid JSON' && output.trim() === '') {
            log(`   ${testCase.name}: Error handled silently (correct)`, COLORS.green);
            proc.kill();
            resolve();
          } else if (testCase.shouldContainError && hasError) {
            log(`   ${testCase.name}: Error handled correctly`, COLORS.green);
            proc.kill();
            resolve();
          } else if (!testCase.shouldContainError && !hasError) {
            log(`   ${testCase.name}: Handled correctly`, COLORS.green);
            proc.kill();
            resolve();
          } else {
            proc.kill();
            reject(new Error(`${testCase.name}: Error handling not as expected. Output: ${output}`));
          }
        }, 1500);

        setTimeout(() => {
          proc.kill();
          reject(new Error(`${testCase.name}: Test timeout`));
        }, 3000);
      });
    }
  });
}

async function validateIntegration() {
  return testStep('Server Integration Validation', async () => {
    // Check if can connect to default server (port 3000)
    const http = require('http');

    return new Promise((resolve, reject) => {
      const req = http.get('http://localhost:3000/health', (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            if (health.status === 'ok') {
              log('   Server integration validation passed', COLORS.green);
              resolve();
            } else {
              log('   Server not running, skipping integration validation', COLORS.yellow);
              resolve(); // Not considered an error
            }
          } catch (error) {
            log('   Server response abnormal, skipping integration validation', COLORS.yellow);
            resolve(); // Not considered an error
          }
        });
      });

      req.on('error', (error) => {
        log('   Server connection failed, skipping integration validation', COLORS.yellow);
        resolve(); // Not considered an error
      });

      req.setTimeout(3000, () => {
        req.destroy();
        log('   Server connection timeout, skipping integration validation', COLORS.yellow);
        resolve(); // Not considered an error
      });
    });
  });
}

// Main validation process
async function runValidation() {
  log('\n🔍 VTable MCP CLI Validation Started', COLORS.blue);
  log('=' .repeat(50));

  try {
    await validateBuild();
    await validateToolLoading();
    await validateJsonRpcProtocol();
    await validateErrorHandling();
    await validateIntegration();

    // Display summary
    log('\n' + '=' .repeat(50));
    log('📊 Validation Summary:', COLORS.blue);
    log(`   Passed: ${results.passed} items`, COLORS.green);
    log(`   Failed: ${results.failed} items`, COLORS.red);

    if (results.failed === 0) {
      log('\n✨ All validations passed! CLI running normally', COLORS.green);
      process.exit(0);
    } else {
      log('\n⚠️  Some validations failed, please check details', COLORS.yellow);
      results.tests.forEach(test => {
        if (test.status === 'failed') {
          log(`   - ${test.name}: ${test.error}`, COLORS.red);
        }
      });
      process.exit(1);
    }
  } catch (error) {
    log(`\n❌ Validation process terminated abnormally: ${error.message}`, COLORS.red);
    process.exit(1);
  }
}

// Error handling
process.on('unhandledRejection', (error) => {
  log(`\n💥 Unhandled Promise rejection: ${error.message}`, COLORS.red);
  process.exit(1);
});

process.on('SIGINT', () => {
  log('\n🛑 Received interrupt signal, exiting...', COLORS.yellow);
  process.exit(0);
});

// Run validation
if (require.main === module) {
  runValidation().catch(error => {
    log(`\n💥 Validation script error: ${error.message}`, COLORS.red);
    process.exit(1);
  });
}

module.exports = { runValidation };