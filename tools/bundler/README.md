# @internal/bundler

> 基于 [gulp](https://gulpjs.com/) + [rollup](https://rollupjs.org/introduction/) 封装的专门针对前端库的打包工具，支持 typescript、react、 less 和资源拷贝等能力

# 使用

```
bundle [options] <entry>

# eg.
bundle -f es -w dev --env __DEV__=true --env __ID__="'my_id'"
```

# 命令行参数说明

```
-r, --root <path> 项目根目录(绝对或相对路径) eg. --root /path/to/project
-c, --config <filename> 指定配置文件，默认 <PROJECT_ROOT>/bundler.config.js, eg. --config ./bundler.config.js
--tsconfig <path> tsconfig.json 路径 eg. --tsconfig ./tsconfig.json
-i, --input <filename> 入口文件, 默认 <PROJECT_ROOT>/src/index.ts, eg. --config ./src/index.ts
-f, --formats <format> 指定产物模块类型(umd,es,cjs), eg. -f es -f cjs
-n, --name <name>  UMD 产物中的全局变量名称, 默认取 package name eg. --name MyGlobalName
--copy <ext> 需要拷贝的静态资源文件后缀(umd产物无效), eg. --copy png --copy svg
--less 开启 less 编译支持
-e, --envs <key=value> 要替换的环境变量, eg. --env __DEV__=true --env __ID__="'my_id'"
--clean 删除产物目录
--minify 是否输出压缩后的 UMD 产物文件
--reuseEs 在启用 umdFromEs 的包中复用本轮已生成的 ESM 入口，供分步构建普通 UMD 使用
-w, --watch 监听文件变化重新构建
-s, --sourcemap 是否生成 sourcemap
```

# 配置文件

> 来自命令行参数的字段相比配置文件的相同字段优先级更高, 即可以用命令行参数覆盖配置文件中出现的字段

默认 `<PROJECT_ROOT>/bundler.config.js` 会被 _bundle_ 读取，配置文件需要导出一个配置对象:

```javascript
module.exports = {
  input: {
    es: 'index.es.ts',
    cjs: 'index.cjs.ts',
    umd: 'index.umd.ts'
  },
  formats: ['es', 'cjs', 'umd'],
  outputDir: {
    es: 'es',
    cjs: 'cjs',
    umd: 'dist'
  },
  name: 'MyGlobalName'
  // ...其他配置项
};
```

配置对象类型如下：

```typescript
interface Config {
  // 项目根路径(相对或绝对路径)
  root: string;
  // 项目源码所在目录(相对路径)
  sourceDir: string;
  // tsconfig.json 所在相对路径
  tsconfig: string;
  // 入口文件相对路径
  input: string | Partial<Record<_ModuleKind, string>>;
  // 输出产物类型
  formats: _ModuleKind[];
  // 输出产物类型相对路径
  outputDir: Partial<Record<_ModuleKind, string>>;
  // UMD 产物中的全局变量名称, 默认取 package name
  name: string;
  // UMD 产物中的文件名称, 默认取 package name
  umdOutputFilename: string;
  // 是否开启sourcemap
  sourcemap: boolean;
  // 开启监听源码模式
  watch: boolean;
  // 要拷贝的静态资源扩展名
  copy: string[];
  // 是否开启  less 编译支持
  less: boolean;
  // 环境变量, 默认会注入版本号`__VERSION__`
  envs: Record<string, string>;
  // 构建开始前，是否清空构建产物目录
  clean: boolean;
  // 是否压缩 umd 产物文件
  minify: boolean;
  // 设置为 false 可跳过 UMD 的 Terser compress 阶段，保留变量名缩短和空白移除。
  umdCompress?: boolean;
  // Calendar 和 Gantt 的完整构建从编译后的 JS 合并 UMD；单独指定 -f umd 时读取源码。
  umdFromEs?: boolean;
  // 浏览器测试用 UMD 优先解析 browser 入口，目标 ES2018。
  browserUmd?: boolean;
  // 出现编译错误时是否输出产物文件, 如果为true，则会停止构建且不输出任何东西
  noEmitOnError: boolean;
  // 传给给 @babel/preset-env 的 `targets` 字段 see: https://babeljs.io/docs/babel-preset-env#targets
  targets: string | string[] | Record<string, string>;
  // 构建 UMD 产物时，需要排除的模块名称
  external: string[] | ((rawPackageJson: RawPackageJson) => string[]);
  // 构建 UMD 产物时，传递给 @rollup/plugin-alias 作为 entries 的选项
  alias: Array<{ find: string | RegExp; replacement: string; customResolver?: ResolverFunction | ResolverObject }>;
  // 额外的 rollup 配置项
  rollupOptions: Omit<RollupOptions, 'output'>;
  // 构建前执行的任务列表
  preTasks: Record<string, (config: Config, projectRoot: string, rawPackageJson: RawPackageJson) => Promise<unknown>>;
  // 构建后执行的任务列表
  postTasks: Record<string, (config: Config, projectRoot: string, rawPackageJson: RawPackageJson) => Promise<unknown>>;
}
type _ModuleKind = 'es' | 'cjs' | 'umd';
```

# 测试

```shell
rushx dev --root fixtures/config [options]
rushx test
```

## 发布构建实测（2026-11-20）

在同一台 Apple M3 Pro（12 核、36 GiB）上，用 Node.js 22.22.2、Rush 5.148.0、pnpm 10.7.0 和同一份安装依赖构建 11 个发布包。基线包含前两轮优化。每轮清理构建输出和增量记录，覆盖 Release CI 的全部 `--to` 目标。表中是 Rush 进程的实际墙钟时间，依赖安装和 `pnpm pack` 在计时区间之外。

| 全量冷构建 | 耗时 | 相比上一步 |
| --- | ---: | ---: |
| 改造前，串行 | 199.86 秒 | — |
| Calendar、Gantt 复用 ESM，串行 | 157.75 秒 | −42.11 秒 |
| 同一改造，发布并发度 2 | 112.67 秒 | −45.08 秒 |

另一次同方案测量中，串行与并发度 2 分别为 167.54 和 120.79 秒。最终两组按秒采样的构建进程树 RSS 之和峰值分别为 3.50 和 4.19 GiB，此指标可能重复计入共享内存。GitHub 托管 runner 的耗时需用实际发布记录复核。

`rush build` 继续按包串行执行。发布工作流使用 `rush release-build --parallelism 2`，保留 Rush 的包依赖顺序。Calendar 和 Gantt 等待模块和静态资源写完，再从已编译的入口生成普通与压缩 UMD。

| 包 | 改造前串行 | 改造后串行 | 改造前 .min.js gzip | 改造后 .min.js gzip |
| --- | ---: | ---: | ---: | ---: |
| Calendar | 26.07 秒 | 9.22 秒 | 545,791 B | 534,676 B |
| Gantt | 26.32 秒 | 11.24 秒 | 596,391 B | 588,372 B |

使用 pnpm 打出两侧 tarball，核对了 3,963 个文件的路径和权限、类型声明、source map 和包清单，gzip 统一使用级别 6。串行与并发产出的 20 个 UMD 文件逐字节一致。与改造前相比，有 48 个 ESM/CJS 文件存在字节差异，均可用现有模块编译器中两路写入同一文件的 Terser 处理差异解释。

浏览器验证使用实际发布包，对照普通和压缩 UMD 的全局、AMD、CommonJS 导出，运行 Gantt、Sheet 两个目录的 23 个视觉用例，以及 Calendar 的渲染和事件增删改。相对于改造前同版本的发布包，23 组截图逐字节一致，Calendar 的截图也相同。

Bundler 5 项、Gantt 27 项、Sheet 446 项测试全部通过。在干净目录单独运行 Calendar 的 `bundle --clean -f umd`，压缩 UMD 与改造前逐字节一致。单测 CI 模式仅生成 ESM、CJS 和类型声明。
