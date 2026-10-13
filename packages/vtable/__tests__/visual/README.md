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

结果写入 Git 忽略的 `.vtable-visual/runs/<run-id>/`：`index.html` 可离线查看基线、当前和差异三图，`agent-summary.md` 便于快速定位失败，`summary.json` 保留结构化证据。退出码 `0` 表示所选用例均通过，`1` 表示视觉差异，`2` 表示执行、构建、资源或清理错误。报告可以整体复制，单独复制 HTML 会丢失相对图片。

正常结束、失败或 Ctrl+C 后，工具会回收本轮测试子进程、浏览器、HTTP 服务和临时基线 worktree。SIGKILL/断电后，先确认进程已结束，再检查 `git worktree list` 和 `.vtable-visual/running.lock`；不要删除其他任务的 worktree。

## 冻结套件导出

平台接入和归档可以复用同一个命令导出完整用例与当前构建，不需要 BugServer 登录：

```sh
node packages/vtable/scripts/visual-test.mjs --export-suite .vtable-visual/suites/current
node packages/vtable/scripts/visual-test.mjs --export-suite .vtable-visual/suites/next --previous-suite .vtable-visual/suites/current/suite-manifest.json
```

导出目录必须是新目录，位于工作区外或 Git 忽略目录；已有目录不会被覆盖。此模式不能与单例、目录、基线、列举或环境预检选项混用。它使用既有构建链生成所需的 `current-<resource>.js`，冻结原格式用例、页面、Playwright 运行器和辅助文件，并保存包版本与依赖锁文件。完整清单包含实际使用的 editors、gantt、plugins、sheet 和锁定 VChart 资源；VChart 版本来自已安装包，不使用 latest 或 CDN。此模式不下载官方基线、不运行截图、不接受视觉差异。

`suite-manifest.json` 使用 `schemaVersion=1`、`contractVersion=1.0`、`kind=suite_manifest`。所有文件记录相对路径、字节大小和 SHA-256；`suiteDigest` 标识规范化完整清单，`filesDigest` 标识冻结文件集合，`bundleDigest` 标识实际产品资源。`caseDigest` 包含用例、相对导入、公共运行器和使用的资源，截图键固定为 `final`，对应现有单例最终截图。历史 BugServer IDs 仅记录来源，不用于覆盖 Photo 用例，也不会写回源码。命令的 JSON 输出包含清单位置及按稳定 case ID 识别的 add/update/archive；归档只表示清单差异，不删除平台数据。

导出时校验唯一 ID/模块、完整资源、导入路径、符号链接及构建期工作区变化；失败退出 `2`，回收本次子进程，保留日志和 export-failure.json，移除不可消费的成功清单；重试使用新目录。套件列举和导入会执行 JavaScript：平台须把导出/发现放入隔离 worker，不能在有内网或业务凭据的控制进程执行。清单中的环境要求固定 Node 22、实际 Playwright 版本和现有截图设置；完整镜像、浏览器、字体和网络隔离仍由平台环境验收负责，导出成功不表示视觉测试或隔离验收通过。

确定性和非法输入检查：

```sh
node --test packages/vtable/scripts/visual-suite.test.mjs
```

## 冻结候选与指定只读基准

同一用例还可以验证冻结构建并与平台提供的 PNG 集合比较，不重新构建或采集基准：

```sh
node packages/vtable/scripts/visual-test.mjs --run-suite .vtable-visual/suites/current --run-request /path/to/run-request.json --baseline-set /path/to/baselines
# 可选 --output <新目录>；默认输出到 .vtable-visual/runs/<run-id>
```

三个输入必须配套，不能混用 `--case`、`--dir`、`--baseline`、`--self-compare` 或导出选项。输出须是新目录，位于工作区外或 Git 忽略目录，不能包含或覆盖输入；已有目录不会被覆盖。`suite-manifest.json` 需要 `adapterVersion=1.1.0`，增加实际提交的 `sourceParents` 与 `sourceDirty`；旧导出须重新生成。

`run-request.json` 使用公共接口契约 v1 的 `run_request`：固定仓库、产品、被测提交与源摘要、suite/bundle/policy 摘要、环境 ID、assetRevision、selection 和 executionKey。仅支持 `engines=["playwright"]`，Photo 的 suite/environment 为 `null`，截图键为 `final`。`full` 必须包含冻结清单全部用例；`targeted` 必须逐项列出 ID，不扩展为全量。选择摘要为规范化 items 的 SHA-256，执行键为规范化 `{identity, engines, selectionDigest, rerunSequence}` 的 SHA-256。`pr_head` 必须测试 head；`pr_merge` 必须绑定实际父提交 `[baseSha, headSha]`。本机 `local_workspace` 可包含 dirty 修改，但属于辅助证据，不能替代可信 CI 结果。

基准目录提供 `baseline-manifest.json`：

```json
{
  "schemaVersion": 1,
  "contractVersion": "1.0",
  "kind": "baseline_manifest",
  "artifactId": "selected-baselines",
  "repository": "VisActor/VTable",
  "productKey": "VTable",
  "environmentId": "trusted-worker-environment-id",
  "assetRevision": null,
  "renderer": null,
  "entries": [
    {"caseId": "list-basic", "screenshotId": "final", "baselineExpected": false, "path": null, "digest": null}
  ]
}
```

此示例只声明一个首次基准项。请求 `inputArtifacts` 必须引用该 artifactId 和清单**原始文件字节**的 SHA-256。环境 ID 和 assetRevision 必须与请求一致，所有选中截图均须有唯一条目；路径使用普通相对 POSIX 文件路径，禁止符号链接、越界和内容摘要不符。既有 PNG 填写 `baselineExpected=true`、相对 `path` 与 PNG 的 SHA-256；既有基准意外丢失仍声明 `true`，不得改成首次基准。只要使用既有 PNG，`renderer` 必须精确记录其实际 `{node, platform, arch, playwright, browser, settings}`，并与运行时实测一致。平台环境 ID 的完整镜像、字体、权限、内核和网络约束仍由可信控制器验收，本入口不建立操作系统隔离。

基准只复制到结果目录后用于原生 `toMatchSnapshot`，不开启基准更新；运行前后校验输入和副本不变。用例继续执行原有 mount、exercise/verify、有效绘制、连续稳定截图和 release。交互后再次检查绘制，空白、资源错误或语义断言失败不能发布候选图。

机器结果读取 `run-result.json`（`kind=run_result`、contractVersion=1.0）。逐截图保留三项检查、七类状态 `matched` / `different` / `no_baseline` / `assertion_failed` / `execution_error` / `skipped` / `cancelled`、图像摘要与证据路径；`complete` 仅表示全部选中截图具有终态报告，不表示比较通过。首次基准项经断言和稳定性验证可输出 `role=candidate` 的 PNG，但状态仍为 `no_baseline`、rawOutcome=failed、退出 `2`；意外缺基准另带 `MISSING_BASELINE`。只有完整的原生比较证据可返回 `different` 和退出 `1`；全部匹配返回 `0`；缺图、不完整、执行或清理错误返回 `2`。标准基准的接受、写回与服务接入另由协调流程负责，本入口没有同步或接受命令。

`summary.json`、`agent-summary.md` 和三图 HTML 是同次结果的查看入口；其中“完整比较”仍仅表示所选截图均完成有基准的比较。不要用首次候选已验证推断比较通过，也不要把指定基准或自比较称为官方 develop 通过。

```sh
# 先完成构建或套件导出，随后运行真实浏览器及失败路径专项
node --test packages/vtable/scripts/visual-candidate.test.mjs
```

## 用例维护

目录说明及来源 ID 规则见 [用例指南](./cases/README.md)。开发完成后运行相关目录；提交 PR 前运行默认全量比较并检查差异。新功能或缺陷修复可以加独立用例。不得用放宽截图阈值、跳过语义断言或接受差异代替修复不稳定用例。工具自检：

```sh
node --test packages/vtable/scripts/visual-test.test.mjs
```
