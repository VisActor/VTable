# 新增 BugServer Photo 用例完整流程

> **权限前提：只有对应 BugServer 项目的管理员有权新增平台用例。** 外部开发者和未获该项目管理员权限的贡献者，应提供可复现材料并由管理员代为创建；不要执行下方创建命令。拥有 GitHub 仓库写权限、能查看报告或 CLI 登录成功，都不等于拥有新增用例权限。不要共享账号、Cookie 或令牌。

本页说明 VTable 用例从提交材料、管理员创建、回填真实 caseId，到新版本工作流执行和首次基准处理的完整过程。本地 Playwright 与平台 Photo 是两套用例，**不会自动同步**；仅在 PR 模板填 ID 也不会创建或执行用例。

## 1. 贡献者准备材料，管理员确认范围

贡献者先按[本地用例指南](./cases/README.md)补充可复现的本地测试，并向项目管理员提供：关联 issue/PR、验证目的、固定的公开数据与配置、操作步骤、预期状态及图像、当前提交 SHA、本地用例路径和实际测试结果。外部开发者无需为此安装或登录 BugServer；尚未创建平台用例时，在 PR 中说明“待项目管理员补充”，不要填写占位或虚构 ID。

管理员先检查已有平台目录和相似 case，决定复用已有覆盖还是新增。公开 PR 和仓库只保存允许公开的 ID、链接及去业务化材料；内部业务源码、数据、凭据和截图通过受限渠道处理。

## 2. 仅项目管理员：编写并创建平台用例

管理员将场景整理成适合 BugServer 浏览器注入环境的 JavaScript。不能直接上传含 Playwright/Jest API 的测试文件，也不能直接上传本地用例模块：本地的 `mount(container)`、`exercise(page)`、`verify(page)` 需要按平台 SDK、容器和交互约定改写。先参考同产品既有用例，在资源、渲染和目标状态就绪后调用 `BUGSERVER_SCREENSHOT()`，不能在尚未完成动作时提前申请截图。

保留与缺陷有关的动作和状态检查。Photo 的图片比较不能代替本地语义、安全或交互断言；不要通过放宽像素阈值、略过动作或替换标准图让用例通过。需要录制交互时，由管理员使用平台已有交互编辑能力配置；下述 CLI 只创建源码用例，不接收交互配置。

管理员通过团队发布渠道准备兼容的 BugServer CLI，检查 `--version` / `--help` 包含 `case create`、`workflow get`、`baseline set` 及其条件更新参数，并使用自己的项目管理员身份登录。正式 CN 默认为 `https://bugserver.cn.goofy.app`，认证状态的 `previewEnv` 应为空；核对环境配置，不要混入 PPE 参数或会话。外部贡献者不执行这些操作。

```bash
# 仅对应 BugServer 项目管理员执行；先核对身份、产品和正式环境。
bugserver --version
bugserver auth status --json
bugserver folder list --product VTable --page 1 --page-size 100 --json
bugserver case list --product VTable --folder "替换为已选目录" --json
```

按返回分页继续查询，查完相关目录和相似用例后选择功能目录；不要求使用 Agent 专用目录。创建时 `--folder` 必填，新目录随用例保存出现。源码文件必须是非空 UTF-8 JavaScript，最多 512 KiB；当前正式环境沿用默认视口，不随意指定自定义宽高。

```bash
# 仅项目管理员执行写入；替换名称、目录和源码路径后再运行。
# requestId 只生成一次并保存；不要在结果未知时重新生成。
case_request_id=$(node -e "console.log(require('node:crypto').randomBytes(12).toString('hex'))")
bugserver case create --product VTable \
  --name "替换为用例名称" --folder "替换为已选目录" \
  --code-file ./case.photo.js --request-id "$case_request_id" --json
```

保存返回的 `caseId`、`casePath` 和 `requestId`，再用 `bugserver case get '<真实caseId>' --product VTable --json` 核对内容。以返回链接为准。

创建成功只代表已保存：新 case 自动带 Photo 标签、没有基准图，**不会立即触发测试，也不会覆盖同名用例**。响应未知时先保留原 requestId，仅用相同 ID 和完全相同输入恢复原创建请求；不要换 ID 重复建用例。无权限或认证失败应由对应项目管理员处理，不指导外部开发者绕过权限。

## 3. 回填真实 caseId 并更新现有 PR

只有管理员确认平台创建成功后，才在相关本地用例头部的 `BugServer case IDs: <真实ID>` 追溯注释中增加服务返回 ID，并在 PR 中填写允许公开的 caseId/链接、目录、关联本地用例与预期结果。已有迁移来源 ID 必须保留，合并场景保留全部真实 ID。ID 仅供追溯，不建立实时同步关系；两边内容变化仍需分别维护。

创建尚未完成时，本地独立用例完全省略该 ID 行，PR 中说明待管理员处理即可，不能填写空行、示例 ID 或虚构 ID。

## 4. 用新提交接入工作流

先完成平台创建，再将回填 ID 和必要用例改动提交到现有 PR 分支，形成真实的新 SHA。符合当前准入范围的 PR 会以新版本重新执行检查，并在 Photo 阶段获取包含该产品新增 Photo case 的全量范围。只有同仓、目标为 `develop`、满足启用时间等准入条件的非 Draft PR 才自动接入；fork、存量或其他目标分支不能假定会自动执行，由管理员按[贡献流程](../../../../CONTRIBUTING.zh-CN.md#pr-检查与合入流程)安排验证。

Photo 范围是该产品所有带 Photo 标签的用例及其已配置交互，不按 PR 中填写的 caseId 过滤；新增 case 也会进入该产品后续其他 PR 的新批次。

**已冻结的范围和已触发的批次不会因为新增 case 自动扩容。** 刷新页面、等待旧批次结束或普通重试旧批次，都不能证明新增用例已运行。推荐以上述实际补用例提交建立新版本；旧版本和旧失败证据继续保留。未知创建/发布必须按原请求回读，不能删状态或换 ID 绕过去重；新提交也不会消除旧未知请求。

Photo 依赖前置阶段允许继续执行并成功生成对应聚合产物。CR、Playwright 或构建受阻时，先核查并修复相应问题，不把“平台已有 case”当作已执行。需要恢复任务时联系管理员按原任务恢复，不手工另触发一个批次冒充工作流结果。已合入 PR 需补覆盖时，使用后续真实变更 PR 或管理员明确安排的独立测试，不能改写旧批次。

## 5. 核查新版本结果

管理员或有平台读取权限的人员可查询：

```bash
bugserver workflow get --product VTable --repository VisActor/VTable --pr '<PR编号>' --json
bugserver run get '<工作流关联的真实批次ID>' --product VTable --json
bugserver report list --run '<同一批次ID>' --product VTable --json
bugserver report get '<新case对应的报告ID>' --product VTable --json
```

逐项核对：当前 head/base SHA 和实际测试版本；工作流关联的 Photo 批次；任务清单确实含新增 caseId 及应覆盖的交互；执行是否终结；测试图、基准图、差异和错误是否符合该场景。`case get` 只表示当前保存内容，不能证明历史批次运行了该内容；应结合当次任务与报告核查。没有平台读取权限的外部开发者由管理员提供允许公开的结果，不要求其自行访问内部数据。

CI/CR、Playwright 与 Photo 分别报告。当前 Photo 为 report-only：差异、缺基准、执行错误和未完成状态如实保留，不参与三项自动建议的阻断；工作流完成不等于 Photo 全部通过。新增 case 的脚本执行、请求或状态语义仍须结合相应断言验证，不能仅凭图片相似确认缺陷已修复。

## 6. 首次缺基准：人工核查、单独授权、重新验证

新 case 首次出现 `missing_baseline` 是尚无标准图的事实；先确认本轮执行成功、目标状态和测试图正确，再由维护者决定后续处理。缺图、执行异常、未完成或无法确认的测试图不能采用为基准。

**Approve/Merge 不授权自动采用测试图，工作流也不会在合入后自动建立或更新基准。** 由具有基准更新权限的项目管理员，在明确获得本次共享基准更新授权后，核对准确的产品、case/interaction、报告与 taskId，再通过平台或 CLI 采用已审阅的测试图：

```bash
# 仅有相应基准写权限且已获本次更新授权的项目管理员执行。
# 此处仅用于管理员已确认该任务当前无基准的首次设置；null 是条件检查。
baseline_request_id=$(node -e "console.log(require('node:crypto').randomBytes(12).toString('hex'))")
bugserver baseline set --product VTable \
  --report '<已审阅的报告ID>' --task '<同一报告对应的taskId>' \
  --request-id "$baseline_request_id" --expected-standard null --json
```

设置前读取当前基准。上述命令要求 CLI 支持条件更新，并使用固定 requestId；只有已确认无基准时才能使用 `null`，不能用未知值代替。若已有基准，停止首次设置流程，由管理员另行审阅并授权更新，使用已读取的原标准引用作为条件；不能无条件覆盖。写入结果未知时保留原 requestId 和输入，核查后恢复原请求，不换 ID 重复写入。**基准按 case/interaction 共享，不按 PR、分支或 commit 隔离**，修改会影响后续测试，应由管理员统筹时机。

保存设置回执和来源，再由管理员安排新的 Photo 执行并核对结果。设置成功不代表测试通过，原批次的 `missing_baseline` 或差异仍保留，不能把旧报告改写成通过。PR 中分别说明本轮测试事实、首次基准是否已审阅/采用，以及尚待完成的复验。
