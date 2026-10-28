# VTable 本地视觉回归

本工具在本机将当前工作区与官方 `VisActor/VTable` 的 `develop` 构建逐例截图比较。用例由 BugServer Photo case 人工筛选、去业务化改写而来，另含少量独立的基础用例；运行不依赖 BugServer。两侧共用冻结的用例副本，只替换 VTable 构建产物。截图差异需要人工检查；自比较通过只说明运行稳定。

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

## 三项建议工作流灰度准备

自动工作流先只提供 CR、单测和全量 Playwright 建议；BugServer 结果由管理员人工核查，当前提交的管理员 Approve 表示已确认，合入仍由管理员手动执行。Photo 自动执行并展示原始结果，自动差异评估、强制门禁和标准图更新暂停；Playwright 截图通过不替代 BugServer 人工确认。

灰度使用完整 SHA 的 `--baseline <40 位 SHA> --offline`，宿主提前准备匹配当前工程清单的只读依赖和浏览器；缺少提交、依赖或预装工具时停止，不回退联网安装，也不把自比较作为正式通过证据。每次保留真实 head/base、全量范围、执行错误及差异解释，更新提交后重新核对版本。

当前仅本仓 `codex/workflow-cn-acceptance-20261028` 分支的 PR 暂停旧 `Bug Server CI`；其他分支、fork 和手动入口保持原触发行为，不能将 Bot 的 manual 模式理解为全仓旧 CI 已停用。旧 BugServer 工作流预计在新工作流正式上线并验收后统一删除；删除前须另行核对自动/手动/回调入口、分支保护及下游引用。本次 CN 真实工作流会自动触发 Photo 并展示原始结果，暂停其自动差异分析、强制门禁和标准图更新；管理员核查后人工批准与合入。

触发范围回归可在仓库根目录执行：

```sh
node --test .github/scripts/bug-server-gray-scope.test.cjs
```
