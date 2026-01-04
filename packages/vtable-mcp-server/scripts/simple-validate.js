#!/usr/bin/env node

/**
 * VTable MCP Server 简化验证脚本
 *
 * 使用方法：npm run validate:simple
 */

const http = require('http');
const WebSocket = require('ws');
const { spawn } = require('child_process');
const path = require('path');

const TEST_PORT = 3003;
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(message, color = '') {
  console.log(`${color}${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runSimpleValidation() {
  log('\n🔍 VTable MCP Server 简化验证开始', colors.blue);
  log('=' .repeat(50));

  let server = null;
  let hasError = false;

  try {
    // 1. 验证构建文件
    log('\n📋 步骤1: 验证构建文件...', colors.blue);
    const serverPath = path.join(__dirname, '..', 'dist', 'mcp-compliant-server.js');
    const fs = require('fs');

    if (!fs.existsSync(serverPath)) {
      throw new Error(`服务器构建文件不存在: ${serverPath}\n请先运行: npm run build`);
    }
    log('✅ 构建文件存在', colors.green);

    // 2. 启动服务器
    log('\n🚀 步骤2: 启动服务器...', colors.blue);
    server = spawn('node', [serverPath], {
      env: { ...process.env, PORT: TEST_PORT },
      stdio: 'pipe'
    });

    await new Promise((resolve, reject) => {
      let output = '';

      server.stdout.on('data', (data) => {
        output += data.toString();
        if (output.includes('MCP Server starting')) {
          log('✅ 服务器启动成功', colors.green);
          resolve();
        }
      });

      server.stderr.on('data', (data) => {
        const error = data.toString();
        if (error.includes('EADDRINUSE')) {
          reject(new Error(`端口 ${TEST_PORT} 已被占用`));
        }
      });

      server.on('error', (error) => {
        reject(new Error(`服务器进程错误: ${error.message}`));
      });

      setTimeout(() => {
        reject(new Error('服务器启动超时'));
      }, 5000);
    });

    // 等待服务器完全启动
    await sleep(2000);

    // 3. 验证健康检查
    log('\n🏥 步骤3: 验证健康检查接口...', colors.blue);
    await new Promise((resolve, reject) => {
      const req = http.get(`http://localhost:${TEST_PORT}/health`, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const health = JSON.parse(data);
            if (health.status === 'ok') {
              log('✅ 健康检查正常', colors.green);
              resolve();
            } else {
              reject(new Error('健康检查返回异常状态'));
            }
          } catch (error) {
            reject(new Error(`健康检查响应解析失败: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`健康检查请求失败: ${error.message}`));
      });

      req.setTimeout(5000, () => {
        req.destroy();
        reject(new Error('健康检查超时'));
      });
    });

    // 4. 验证WebSocket连接
    log('\n🔗 步骤4: 验证WebSocket连接...', colors.blue);
    await new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:${TEST_PORT}/mcp?session_id=test`);
      let connected = false;

      ws.on('open', () => {
        connected = true;
        log('✅ WebSocket连接成功', colors.green);

        // 发送工具列表
        ws.send(JSON.stringify({
          type: 'tools_list',
          tools: [{ name: 'test_tool', description: 'Test tool' }],
          sessionId: 'test'
        }));

        setTimeout(() => {
          ws.close();
          resolve();
        }, 1000);
      });

      ws.on('error', (error) => {
        reject(new Error(`WebSocket连接失败: ${error.message}`));
      });

      ws.on('close', () => {
        if (connected) {
          log('✅ WebSocket通信正常', colors.green);
        }
      });

      setTimeout(() => {
        ws.close();
        if (!connected) {
          reject(new Error('WebSocket连接超时'));
        }
      }, 5000);
    });

    // 5. 验证MCP协议
    log('\n📡 步骤5: 验证MCP协议...', colors.blue);
    await new Promise((resolve, reject) => {
      const postData = JSON.stringify({
        jsonrpc: '2.0',
        id: 'test',
        method: 'tools/list',
        params: { sessionId: 'test' }
      });

      const options = {
        hostname: 'localhost',
        port: TEST_PORT,
        path: '/mcp',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.jsonrpc === '2.0' && response.id === 'test') {
              log('✅ MCP协议响应正常', colors.green);
              resolve();
            } else {
              reject(new Error('MCP协议响应格式异常'));
            }
          } catch (error) {
            reject(new Error(`MCP协议响应解析失败: ${error.message}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`MCP协议请求失败: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });

    log('\n' + '=' .repeat(50));
    log('✨ 所有验证均通过！服务器运行正常', colors.green);

  } catch (error) {
    hasError = true;
    log(`\n❌ 验证失败: ${error.message}`, colors.red);
    log('💡 建议:', colors.yellow);
    log('   1. 确保已运行: npm run build');
    log('   2. 检查端口是否被占用');
    log('   3. 查看服务器日志获取详细信息');
  } finally {
    // 清理资源
    if (server) {
      log('\n🧹 正在清理测试资源...', colors.blue);
      server.kill();
      await sleep(1000);
      log('✅ 测试资源已清理', colors.green);
    }

    process.exit(hasError ? 1 : 0);
  }
}

// 错误处理
process.on('unhandledRejection', (error) => {
  log(`\n💥 未处理的异常: ${error.message}`, colors.red);
  process.exit(1);
});

process.on('SIGINT', () => {
  log('\n🛑 收到中断信号，正在退出...', colors.yellow);
  process.exit(0);
});

// 运行验证
if (require.main === module) {
  runSimpleValidation().catch(error => {
    log(`\n💥 验证脚本异常: ${error.message}`, colors.red);
    process.exit(1);
  });
}

module.exports = { runSimpleValidation };