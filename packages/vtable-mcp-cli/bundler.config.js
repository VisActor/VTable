/**
 * @type {Partial<import('@internal/bundler').Config>}
 */
module.exports = {
  formats: ['umd'], // 使用 UMD 格式（但会转换为 CommonJS）
  noEmitOnError: false,
  name: 'VTableMCPCLI',
  umdOutputFilename: 'vtable-mcp-cli',
  sourceDir: 'src',
  outputDir: {
    umd: 'dist'
  },
  input: {
    umd: 'index.ts'
  },
  external: [
    // Node.js 内置模块不应该被打包
    'readline',
    'fs',
    'path',
    'http',
    'https',
    'url',
    'util',
    'stream',
    'events',
    'buffer',
    'crypto',
    'os',
    'net',
    'tls',
    'dns',
    'zlib',
    'child_process',
    'cluster',
    'worker_threads'
  ],
  rollupOptions: {
    treeshake: false // 禁用 treeshake，避免移除 console.log 等副作用
  },
  minify: false, // 不压缩，保持可读性
  postTasks: {
    // 后处理：将 UMD 文件转换为 CommonJS 并重命名
    convertToCJS: async (config, projectRoot, rawPackageJson) => {
      const fs = require('fs');
      const path = require('path');
      const distDir = path.join(projectRoot, 'dist');
      const umdFile = path.join(distDir, 'vtable-mcp-cli.js');
      const indexFile = path.join(distDir, 'index.js');
      
      if (!fs.existsSync(umdFile)) {
        console.warn('⚠️  UMD 文件不存在:', umdFile);
        return;
      }
      
      let content = fs.readFileSync(umdFile, 'utf-8');
      
      // UMD 格式通常是: (function (global, factory) { ... })(this, (function (readline) { 'use strict'; ... }));
      // 我们需要提取 factory 函数中的代码和参数
      
      // 尝试匹配未压缩的 UMD 格式
      const umdPattern1 = /\(function\s*\([^)]*\)\s*\{[^}]*\}\s*\)\s*\(this,\s*\(function\s*\(([^)]*)\)\s*\{([\s\S]*)\}\s*\)\)/;
      // 尝试匹配压缩后的 UMD 格式
      const umdPattern2 = /!function\([^)]*\)\{[^}]*\}\([^,]+,\s*\(function\s*\(([^)]*)\)\s*\{([\s\S]*)\}\s*\)\)/;
      
      let factoryContent = null;
      let factoryParams = null;
      let match = content.match(umdPattern1);
      if (match && match[1] && match[2]) {
        factoryParams = match[1];
        factoryContent = match[2];
      } else {
        match = content.match(umdPattern2);
        if (match && match[1] && match[2]) {
          factoryParams = match[1];
          factoryContent = match[2];
        }
      }
      
      if (factoryContent) {
        // 移除最后的 return 语句（如果有）
        factoryContent = factoryContent.replace(/\s*return\s+[^;]+;?\s*$/, '');
        
        // 移除重复的 'use strict'（可能在开头）
        factoryContent = factoryContent.replace(/^\s*['"]use strict['"];?\s*\n?/m, '');
        
        // 根据 factory 函数的参数，添加对应的 require 语句
        let requireStatements = '';
        if (factoryParams) {
          const params = factoryParams.split(',').map(p => p.trim()).filter(p => p);
          for (const param of params) {
            if (param && !factoryContent.includes(`require('${param}')`) && !factoryContent.includes(`require("${param}")`)) {
              requireStatements += `const ${param} = require('${param}');\n`;
            }
          }
        }
        
        // 转换为 CommonJS
        content = `#!/usr/bin/env node
"use strict";
${requireStatements}${factoryContent}`;
        console.log('✅ 成功提取 factory 函数内容');
      } else {
        // 如果无法解析，直接添加 shebang（保持 UMD 格式，但可以运行）
        if (!content.startsWith('#!/usr/bin/env node')) {
          content = `#!/usr/bin/env node\n${content}`;
        }
        console.warn('⚠️  无法完全转换为 CommonJS，保持 UMD 格式（但添加了 shebang）');
      }
      
      // 修复 respond 函数体（如果被 strip 插件移除了 console.log）
      // 匹配各种可能的空函数格式
      content = content.replace(/function\s+respond\s*\(msg\)\s*\{\s*\}/g, 'function respond(msg) { console.log(JSON.stringify(msg)); }');
      content = content.replace(/function\s+respond\s*\(msg\)\s*\{\s*\n\s*\}/g, 'function respond(msg) {\n\t\tconsole.log(JSON.stringify(msg));\n\t}');
      content = content.replace(/function\s+respond\s*\(msg\)\s*\{\s*\n\t\}/g, 'function respond(msg) {\n\t\tconsole.log(JSON.stringify(msg));\n\t}');
      content = content.replace(/function\s+respond\s*\(msg\)\s*\{\s*\n\t\t\}/g, 'function respond(msg) {\n\t\tconsole.log(JSON.stringify(msg));\n\t}');
      
      // 写入 index.js
      fs.writeFileSync(indexFile, content);
      fs.chmodSync(indexFile, '755');
      
      // 删除 UMD 文件
      if (fs.existsSync(umdFile)) {
        fs.unlinkSync(umdFile);
      }
      
      console.log('✅ 已生成可读的 CommonJS 格式文件: dist/index.js');
      console.log('📄 生成文件大小:', fs.statSync(indexFile).size, '字节');
    }
  }
};
