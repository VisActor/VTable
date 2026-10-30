# VTable 本地视觉回归

本工具在本机将当前工作区与官方 `VisActor/VTable` 的 `develop` 构建逐例截图比较。用例由 BugServer Photo case 人工筛选、去业务化改写而来，另含少量独立的基础用例；运行不依赖 BugServer。两侧共用冻结的用例副本，只替换 VTable 构建产物。截图差异需要人工检查；自比较通过只说明运行稳定。

**新增平台用例仅限项目管理员。** 外部贡献者提供复现材料，由管理员创建并回填真实 ID；完整步骤见[新增 BugServer case 流程](./BUGSERVER_CASE_WORKFLOW.md)。

## 准备

在仓库根目录使用 Node.js 22，安装 Rush 依赖和锁文件对应的 Chromium：

```sh
node common/scripts/install-run-rush.js install --ignore-hooks
PLAYWRIGHT_SKIP_BROWSER_GC=1 node packages/vtable/node_modules/@playwright/test/cli.js install chromium
```

Linux 还需安装 Chromium 的系统库。`--check` 会实际启动浏览器做预检，但不会安装依赖或构建。

## 运行

```sh
node packages/vtable/scripts/visual-test.mjs --check
node packages/vtable/scripts/visual-test.mjs --list
node packages/vtable/scripts/visual-test.mjs --case list-basic --self-compare
node packages/vtable/scripts/visual-test.mjs --dir pivot
node packages/vtable/scripts/visual-test.mjs
node packages/vtable/scripts/visual-test.mjs --baseline <完整的40位commit-sha>
```

`--case` 选择一个用例，`--dir` 递归选择一个相对目录，两者互斥；不传则运行全部。`--self-compare` 在两个隔离的浏览器上下文中执行相同的本地构建，用于检查用例确定性。默认基线每次从官方仓库获取 `develop` 并固定本轮 SHA；`--baseline` 从官方仓库获取指定 SHA。基线按自己的锁文件独立安装与构建，缓存最近一次成功的基线产物。当前工作区每轮构建包含未提交修改。

按用例需要构建核心 `vtable`，以及 `editors`、`gantt`、`plugins`、`sheet` 的本地 UMD 包；透视图还加载当前依赖锁定的 `vchart` 浏览器包。目录仅影响用例与所需包的选择；不会自动推断源码影响范围。

自动化隔离环境可使用 `--baseline <完整 SHA> --offline`。宿主须提前从官方仓库准备该提交、两侧相同锁文件对应的依赖及浏览器；执行期间不 fetch 或安装依赖。两侧仍分别构建、执行原断言和截图比较，锁文件或 Rush 配置不同时明确报错，需要分别准备依赖后再运行。该模式不等于 `--self-compare`。

结果写入 Git 忽略的 `.vtable-visual/runs/<run-id>/`：`index.html` 可离线查看基线、当前和差异三图，`agent-summary.md` 便于快速定位失败，`summary.json` 保留结构化证据。退出码 `0` 表示所选用例均通过，`1` 表示视觉差异，`2` 表示执行、构建、资源或清理错误。报告可以整体复制，单独复制 HTML 会丢失相对图片。

正常结束、失败或 Ctrl+C 后，工具会回收本轮测试子进程、浏览器、HTTP 服务和临时基线 worktree。SIGKILL/断电后，先确认进程已结束，再检查 `git worktree list` 和 `.vtable-visual/running.lock`；不要删除其他任务的 worktree。

## 用例维护

目录说明及来源 ID 规则见 [用例指南](./cases/README.md)。开发完成后运行相关目录；提交 PR 前运行默认全量比较并检查差异。新功能或缺陷修复可以加独立用例。不得用放宽截图阈值、跳过语义断言或接受差异代替修复不稳定用例。工具自检：

```sh
node --test packages/vtable/scripts/visual-test.test.mjs
```

## PR 工作流

完整的适用范围、反馈处理、Photo 人工核查、当前提交批准与合入步骤，统一见[贡献指南：PR 检查与合入流程](../../../../CONTRIBUTING.zh-CN.md#pr-检查与合入流程)。是否启用以贡献指南中的维护者说明为准；不能把本地视觉通过当作 Photo 通过或仓库已开放。

旧 Photo CI 的原验收分支精确例外仍保留；新 PR 交接规则见 [Bug Server CI](../../../../.github/workflows/bug-server.yml)。启用变量未配置时保持原行为，不能将本次代码合入理解为旧 CI 已全仓停用。保留现有徽章和仍有效的 fork、存量、push、手动及回调入口；未执行旧 CI 的整体退役。

触发范围回归已接入单测 CI，也可在仓库根目录执行：

```sh
node --test .github/scripts/bug-server-gray-scope.test.cjs
```


### 受控环境的离线执行

使用完整 SHA 的 `--baseline <40 位 SHA> --offline` 时，宿主须提前准备匹配当前工程清单的只读依赖和浏览器；缺少提交、依赖或预装工具时停止，不回退联网安装，不以自比较代替正式比较。保留真实 head/base、全量范围、执行错误及差异说明；更新提交后重新核对版本。

### 双侧离线依赖与旧版缺陷复现

离线自动化宿主可设置 `VISUAL_BASELINE_DEPENDENCIES` 指向独立、只读的基线依赖快照；运行器逐文件核对该目录与固定基线提交的 Rush 配置及工程清单。当前版本继续使用当前工作区依赖。未提供独立快照时保留原同锁校验，不能使用不匹配依赖绕过准备步骤。

基线阶段完整执行后，仅业务断言失败允许继续验证当前版；运行级错误、资源错误、超时及未完成结果仍中止。旧版业务断言失败、当前断言成功并生成截图时，报告标记 `new_baseline`（旧版断言失败，修复待确认），保留原始诊断，不代表像素比较通过。当前失败、普通缺图及不完整报告继续报错；不得自动采用当前图作为标准图。新增/修改断言需要结合源码审查，确认没有删除或弱化覆盖。

阶段结果保存 Playwright 原始 `endedStatus`，仅正常 `passed` / `failed` 终态可进入完整报告；超时、中断或终态缺失均保留原结果并报告执行不完整。旧版业务断言失败只有在阶段正常结束、无运行级错误且退出码一致时才能继续当前版；仍保留原失败证据，不计为基线比较通过。旧报告不会被重写，缺失终态的阶段不能据此补认通过。
