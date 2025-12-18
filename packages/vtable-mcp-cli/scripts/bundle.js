#!/usr/bin/env node
/**
 * 使用 esbuild 将所有依赖打包成单个自包含文件
 */

const path = require('path');
const fs = require('fs');

// 动态加载 esbuild（使用 npx）
let esbuild;
try {
  esbuild = require('esbuild');
} catch (e) {
  // 如果本地没有安装，使用 npx
  const { execSync } = require('child_process');
  console.log('⚠️  本地未找到 esbuild，尝试使用 npx...');
  try {
    execSync('npx --yes esbuild --version', { stdio: 'ignore' });
    // 如果 npx 可用，我们使用命令行方式
    esbuild = null; // 标记使用命令行
  } catch (err) {
    console.error('❌ 无法找到 esbuild，请先安装: npm install -D esbuild');
    process.exit(1);
  }
}

const projectRoot = path.resolve(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const distDir = path.join(projectRoot, 'dist');
const entryPoint = path.join(srcDir, 'index.ts'); // 直接从 TypeScript 源文件打包
const outputFile = path.join(distDir, 'index.bundle.js');
const finalOutput = path.join(distDir, 'index.js');

function bundle() {
  console.log('📦 开始打包...');
  console.log('入口文件:', entryPoint);
  console.log('输出文件:', outputFile);

  try {
    // 构建 esbuild 命令
    const externalModules = [
      'readline', 'fs', 'path', 'http', 'https', 'url', 'util',
      'stream', 'events', 'buffer', 'crypto', 'os', 'net', 'tls',
      'dns', 'zlib', 'child_process', 'cluster', 'worker_threads'
    ].join(',');

    // 构建外部模块列表（每个模块单独指定）
    const externalArgs = externalModules.split(',').map(m => `--external:${m.trim()}`);
    
    const esbuildCmd = [
      'npx',
      '--yes',
      'esbuild',
      `"${entryPoint}"`,
      '--bundle',
      '--platform=node',
      '--target=node18',
      '--format=cjs',
      `--outfile="${outputFile}"`,
      '--loader:.ts=ts',
      ...externalArgs,
      '--banner:js=#!/usr/bin/env node',
      '--legal-comments=none'
    ].join(' ');

    console.log('执行命令:', esbuildCmd);
    
    // 使用 npx 运行 esbuild
    execSync(esbuildCmd, {
      cwd: projectRoot,
      stdio: 'inherit'
    });

    if (!fs.existsSync(outputFile)) {
      throw new Error('打包输出文件不存在');
    }

    console.log('✅ 打包成功!');
    const fileSize = fs.statSync(outputFile).size;
    console.log('输出文件大小:', (fileSize / 1024).toFixed(2), 'KB');

    // 设置文件可执行权限
    fs.chmodSync(outputFile, '755');

    // 备份原始文件
    const backupFile = path.join(distDir, 'index.js.backup');
    if (fs.existsSync(entryPoint)) {
      fs.copyFileSync(entryPoint, backupFile);
      console.log('📋 已备份原始文件到:', backupFile);
    }

    // 将打包后的文件复制为 index.js
    fs.copyFileSync(outputFile, entryPoint);
    console.log('✅ 已替换 dist/index.js 为打包后的文件');

    // 可选：保留 bundle 文件用于调试
    // fs.unlinkSync(outputFile); // 如果不需要单独的 bundle 文件，可以删除

  } catch (error) {
    console.error('❌ 打包失败:', error.message);
    if (error.stdout) console.error('stdout:', error.stdout.toString());
    if (error.stderr) console.error('stderr:', error.stderr.toString());
    process.exit(1);
  }
}

bundle().catch(error => {
  console.error('❌ 打包失败:', error);
  process.exit(1);
});

