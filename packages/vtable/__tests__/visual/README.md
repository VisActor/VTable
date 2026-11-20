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

自动化隔离环境可使用 `--baseline <完整 SHA> --offline`。宿主须提前从官方仓库准备该提交、按各侧提交分别匹配的依赖及浏览器；执行期间不 fetch 或安装依赖。两侧仍分别构建、执行原断言和截图比较；独立快照允许两侧使用不同依赖版本，但每侧配置仍须匹配自己的提交，错配时停止。该模式不等于 `--self-compare`。

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

离线自动化宿主可设置 `VISUAL_HEAD_DEPENDENCIES` 和 `VISUAL_BASELINE_DEPENDENCIES`，分别指向已准备的候选及基线只读依赖快照。宿主须将候选快照的依赖链接到当前工作区；运行器不会安装或自动切换依赖，在启动浏览器前按候选完整 SHA 核对显式候选快照，基线快照也按固定基线逐文件核对完整 Rush 配置、锁文件及工程清单。两侧可以使用不同依赖版本，错配、缺文件和越界链接继续失败；未提供独立基线快照时，当前工作区配置必须同时匹配基线。

所有离线执行（含未设置候选快照）都拒绝依赖配置的未提交修改：包括暂存或未暂存的根/项目 `package.json`、`rush.json`、`common/config/rush/` 下文件，以及新增、删除、改名；请先提交配置并准备对应依赖。普通源码修改仍可离线验证，在线模式保留原工作区行为。离线开始快照在预检前记录，预检、构建、执行和清理期间的源码变化都会保留诊断并使本轮失败。

自动安装、缓存和调度属于可信 Bot 宿主能力，本 PR 只补齐 VTable 校验契约；合入不会自动启用 Bot 的 VTable 配置，也不会重试历史 blocked 任务。

基线阶段完整执行后，仅业务断言失败允许继续验证当前版；运行级错误、资源错误、超时及未完成结果仍中止。旧版业务断言失败、当前断言成功并生成截图时，报告标记 `new_baseline`（旧版断言失败，修复待确认），保留原始诊断，不代表像素比较通过。当前失败、普通缺图及不完整报告继续报错；不得自动采用当前图作为标准图。新增/修改断言需要结合源码审查，确认没有删除或弱化覆盖。

阶段结果保存 Playwright 原始 `endedStatus`，仅正常 `passed` / `failed` 终态可进入完整报告；超时、中断或终态缺失均保留原结果并报告执行不完整。旧版业务断言失败只有在阶段正常结束、无运行级错误且退出码一致时才能继续当前版；仍保留原失败证据，不计为基线比较通过。旧报告不会被重写，缺失终态的阶段不能据此补认通过。

只有通过 [assertionError](./assertions.mjs) 显式标记的业务状态断言，且阶段正常结束时，才可用于 `new_baseline`。仅凭 `interaction` / `verify` 阶段不能确认失败性质；浏览器关闭、上下文销毁、协议错误及未标记异常均按执行错误保留并阻断，不因当前版成功而转为待基准。当前版任何断言失败仍失败。旧记录缺少明确业务断言标记时，不补认 `new_baseline`。

复用当前工作区作为基线依赖时，还会比较工作区与固定基线的完整依赖配置差异，包括已提交的新增、删除、改名及内容变化；显式指向当前目录的绝对/相对路径或符号链接别名同样检查。此校验先于基线缓存命中和依赖链接创建执行，不能用缓存绕过。两侧配置不同时请分别准备独立快照；合法的独立基线快照和普通源码修改仍保留支持。

独立快照（可以不含 `.git`）还会双向核对源码依赖配置的文件集合，再逐文件校验内容。额外或缺失的 Rush 配置、根/项目清单都会停止执行，快照自身的 Git/忽略规则不能隐藏差异。枚举跳过 `node_modules`、`common/temp`、`.git`、`.rush`、视觉报告，以及根目录或已知项目目录下的常见构建产物；冻结提交实际跟踪的配置仍强制核对，Rush 配置目录不会被产物规则跳过。源码目录链接不得越界或成环，额外配置也不能通过内部目录别名隐藏。旧快照不符时请按对应提交重新准备，不补写忽略规则绕过校验。
