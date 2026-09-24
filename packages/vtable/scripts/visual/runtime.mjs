import { spawn } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import { createServer } from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';

/** 携带稳定错误码；错误消息保留具体失败证据。 */
export function fault(code, message, cause) {
  return Object.assign(new Error(message, cause ? { cause } : undefined), { code, visualError: true });
}
/** 计算输入、产物和缓存的 SHA-256 摘要。 */
export function digest(value) {
  return createHash('sha256').update(value).digest('hex');
}
/** 同目录写临时文件后替换，避免读到半份结果。 */
export async function atomicJson(file, value) {
  const temporary = `${file}.${randomUUID()}.tmp`;
  try {
    await fs.writeFile(temporary, JSON.stringify(value, null, 2));
    await fs.rename(temporary, file);
  } finally {
    await fs.rm(temporary, { force: true });
  }
}
/** 顺序尝试所有清理动作，单项失败不阻断后续回收。 */
export async function cleanupAll(actions) {
  const errors = [];
  for (const action of actions.reverse()) {
    try {
      await action();
    } catch (error) {
      errors.push({ code: 'CLEANUP_FAILED', message: String(error) });
    }
  }
  return errors;
}

/** 管理单次运行的进程组；只有入口显式调用 listenSignals 才注册处理器。 */
export function createRuntime() {
  const children = new Set();
  const cleanups = [];
  let interrupted = false;
  let killTimer;
  function stop(signal) {
    // 仅向本次创建的进程组发送信号。
    for (const child of children) {
      if (!child.pid) continue;
      try {
        process.kill(-child.pid, signal);
      } catch (error) {
        if (error.code !== 'ESRCH') throw error;
      }
    }
  }
  function interrupt() {
    // 首先通知退出，三秒后强制终止未退出的子进程。
    interrupted = true;
    stop('SIGTERM');
    killTimer ??= setTimeout(() => stop('SIGKILL'), 3000);
    killTimer.unref();
  }
  return {
    get interrupted() {
      return interrupted;
    },
    defer(action) {
      cleanups.push(action);
    },
    listenSignals() {
      // 返回移除函数，导入和完成运行后均不留下信号监听器。
      process.on('SIGINT', interrupt);
      process.on('SIGTERM', interrupt);
      return () => {
        process.off('SIGINT', interrupt);
        process.off('SIGTERM', interrupt);
        clearTimeout(killTimer);
      };
    },
    async run(command, args, cwd, log, options = {}) {
      // 使用参数数组启动命令，保存日志；逾时或中断均为执行错误。
      if (interrupted) throw fault('RUN_INTERRUPTED', '测试已中断');
      const handle = await fs.open(log, 'a');
      let child, timer;
      try {
        await handle.write(`\n$ ${command} ${args.join(' ')}\n`);
        child = spawn(command, args, {
          cwd,
          env: {
            ...process.env,
            PATH: `${path.dirname(process.execPath)}:${process.env.PATH}`,
            CI: '1',
            ...options.env
          },
          detached: true,
          stdio: ['ignore', handle.fd, handle.fd]
        });
        children.add(child);
        const code = await new Promise((resolve, reject) => {
          child.once('error', reject);
          child.once('exit', (code, signal) => resolve(signal ? 2 : code));
          timer = setTimeout(() => reject(fault('TIMEOUT', `命令超时：${log}`)), options.timeoutMs ?? 1200000);
        });
        if (interrupted) throw fault('RUN_INTERRUPTED', `运行已中断：${log}`);
        if (code !== 0 && !options.allowFailure)
          throw fault(options.code ?? 'EXECUTION_FAILED', `命令执行失败 (${code})，请查看 ${log}`);
        return code;
      } catch (error) {
        if (error.visualError) throw error;
        throw fault(options.code ?? 'EXECUTION_FAILED', `${error.message}；日志：${log}`, error);
      } finally {
        clearTimeout(timer);
        if (child?.pid) {
          try {
            process.kill(-child.pid, 'SIGKILL');
          } catch {}
        }
        children.delete(child);
        await handle.close();
      }
    },
    async cleanup() {
      // 即使某个清理函数失败，也继续回收剩余资源。
      const errors = [];
      try {
        stop('SIGKILL');
      } catch (error) {
        errors.push({ code: 'CLEANUP_FAILED', message: String(error) });
      }
      errors.push(...(await cleanupAll(cleanups)));
      cleanups.length = 0;
      return errors;
    }
  };
}

/** 仅暴露冻结套件与两侧构建，使用回环地址及系统分配端口。 */
export async function serve(runDir) {
  const server = createServer(async (request, response) => {
    try {
      const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
      if (!/^(suite\/|(?:baseline|current)-[a-z-]+\.js$)/.test(relative) || relative.split(/[\\/]/).includes('..'))
        return response.writeHead(404).end();
      const resolved = await fs.realpath(path.join(runDir, relative));
      if (!resolved.startsWith(`${await fs.realpath(runDir)}${path.sep}`)) return response.writeHead(404).end();
      const content = await fs.readFile(resolved);
      response.writeHead(200, {
        'Content-Type': relative.endsWith('.html') ? 'text/html' : 'text/javascript',
        'Cache-Control': 'no-store'
      });
      response.end(content);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}

/** 按相对路径递归冻结代码资源，不跟随符号链接到工作区外。 */
export async function fileManifest(directory, relative = '') {
  const entries = [];
  for (const name of (await fs.readdir(path.join(directory, relative))).sort()) {
    const file = path.posix.join(relative, name);
    const stat = await fs.lstat(path.join(directory, file));
    if (stat.isSymbolicLink()) throw fault('CASE_MANIFEST_INVALID', `冻结输入不能包含符号链接：${file}`);
    if (stat.isDirectory()) entries.push(...(await fileManifest(directory, file)));
    else if (stat.isFile()) entries.push({ path: file, digest: digest(await fs.readFile(path.join(directory, file))) });
  }
  return entries;
}
