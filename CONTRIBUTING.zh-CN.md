# VTable 开源代码贡献指南

首先为你选择加入开源贡献行列的行为点赞 👍🏻。再者，十分感谢你选择参与到 VisActor 社区，为这个开源项目做出贡献。

## VTable 贡献指南

VisActor 团队通常在 github 上进行开发和 issue 维护，请打开 [Github 网站](https://github.com/)，点击右上角 `Sign up` 按钮，注册一个自己的账号，开启你开源之旅的第一步。

如果因为特殊情况，你无法打开 Github 站点，也可以通过 [Gitee](https://gitee.com/VisActor/VTable) 进行项目开发。

在 [VTable 仓库](https://github.com/VisActor/VTable)中，我们有一份面向所有开源贡献者的[指南](https://github.com/VisActor/VTable/blob/develop/CONTRIBUTING.zh-CN.md)，介绍了有关版本管理、分支管理等内容，**请花几分钟时间阅读了解一下**。

## 你的第一个 PullRequest

### Step1：安装 Git

Git 是一种版本控制系统，用于跟踪和管理软件开发项目中的代码变更。它帮助开发者记录和管理代码的历史记录，方便团队协作、代码版本控制、合并代码等操作。通过 Git，您可以追踪每个文件的每个版本，并轻松地在不同版本之间进行切换和比较。Git 还提供了分支管理功能，使得可以同时进行多个并行开发任务。

- 访问 Git 官方网站：<https://git-scm.com/>
- 下载最新版本的 Git 安装程序。
- 运行下载的安装程序，按照安装向导的提示进行安装。
- 安装完成后，你可以通过命令行使用 `git version` 命令确认安装成功。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_1.png" />
  </div>

### Step2：Fork 项目

- 首先需要 fork 这个项目，进入[VTable 项目页面](https://github.com/VisActor/VTable)，点击右上角的 Fork 按钮

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_2.png" />
  </div>

- 你的 github 帐号中会出现 xxxx(你的 github 用户名)/VTable 这个项目
- 在本地电脑上使用以下命令: 得到一个 VTable 文件夹

```
// ssh
git clone git@github.com:xxxx(你的github用户名)/VTable.git
// https
git clone https://github.com/xxxx(你的github用户名)/VTable.git
```

### Step3：获取项目代码

- 进入 VTable 文件夹，添加 VTable 的远程地址

```
git remote add upstream https://github.com/VisActor/VTable.git
```

- 获取 VTable 最新源码

```
git pull upstream develop
```

### Step4：创建分支

- 好了，现在可以开始贡献我们的代码了。VTable 默认分支为 develop 分支。无论是功能开发、bug 修复、文档编写，都请新建立一个分支，再合并到 develop 分支上。使用以下代码创建分支：

```
// 创建功能开发分支
git checkout -b feat/xxxx

// 创建问题修复开发分支
git checkout -b fix/xxxx

// 创建文档、demo分支
git checkout -b docs/add-funnel-demo
```

假设我们创建了文档修改分支 `docs/add-funnel-demo`

- 现在我们可以在分支上更改代码了
- 假设我们已经添加了一些代码，提交到代码库
- git commit -a -m "docs: add custom funnel demo and related docs" 。VisActor 的 commit 提交信息遵循 [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) 规范

  - `<type>[optional scope]: <description>`
  - 其中常用 `type`包括 docs（文档、日志修改）、feat（新功能）、fix（问题修复）、refactor（代码重构）等，请根据实际情况选择。
  - 请用简短精确的英文描述编写 description
  - 提交 commit 之前，我们会进行 commit lint 检查，具体可以查看[检查规则](https://github.com/VisActor/VTable/blob/develop/common/autoinstallers/lint/commitlint.config.js)

### Step5：合并修改

- 一个常见的问题是远程的 upstream (@visactor/VTable) 有了新的更新， 从而会导致我们提交的 Pull Request 时会导致冲突。 因此我们可以在提交前先把远程其他开发者的 commit 和我们的 commit 合并。使用以下代码切换到 develop 分支:

```
git checkout develop
```

- 使用以下代码拉出远程的最新代码:

```
git pull upstream develop
```

- 切换回自己的开发分支:

```
git checkout docs/add-funnel-demo
```

- 把 develop 的 commit 合并到 `add-funnel-demo`:

```
git rebase develop
```

- 把更新代码提交到自己的分支中:

```
git push origin docs/add-funnel-demo
```

### Step6：提交 Pull Request

你可以在你的 github 代码仓库页面点击 `pull requests` 按钮，点击`New pull request`。

 <div style="width: 80%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_3.png" />
  </div>

选择提交到 develop 分支。

按照模板填写本次提交的修改内容：

- 勾选这是什么类型的修改
<div style="display: flex;">
 <div style="width: 30%; text-align: center; ">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_4.png" />
  </div>
    </div>

- 填写关联的 issue
<div style="display: flex;">
 <div style="width: 20%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_5.png" />
  </div>
  </div>

- 若有复杂变更，请说明背景和解决方案
<div style="display: flex;">
 <div style="width: 60%; text-align: center;">
     <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/contribution_6.png" />
  </div>
  </div>
相关信息填写完成后，点击 Create pull request 提交。

## PR 检查与合入流程

**接入状态快照（2026-10-29）**：Bot 与 BugServer 支持代码已部署；旧 Photo CI 交接尚待本 PR 审核合入，新 PR 自动发现和仓库级身份尚未启用。启用起点及首次完整初始化将在正式启用时确认。以下范围描述启用后的行为，文档合入不等于自动启用；最新启用进度和时间以[本仓交接 PR](https://github.com/VisActor/VTable/pull/5358)中的维护者更新为准。

本仓库使用自动代码审查和 PR 检查工作流辅助维护者评审。自动结果用于提供检查结论与合入建议；最终批准和合入由维护者人工完成。

### 适用范围

新工作流接入完成启用初始化后新建、符合接入时间要求，且源分支和目标分支均属于本仓库的非 Draft PR。这里的“内部 PR”指同仓库分支之间的 PR，不以作者是否为公司员工判断。

符合创建时间条件的新 Draft PR，在转为 Ready for review 后进入流程。启用前已有的 PR 不因推送提交、重新打开或转为 Ready 而自动补跑；fork PR 暂不接入这套工作流。单独指定的灰度 PR 以维护者公布的范围为准。

自动代码审查和 GitHub Actions 各自有独立的执行范围。没有出现新工作流摘要，不表示该 PR 不需要测试或人工评审。

### 提交前

完成与改动相关的单元测试，并按本仓库[视觉测试说明](./packages/vtable/__tests__/visual/README.md)执行必要验证。现有提交前全量视觉测试要求继续适用。

在 PR 中说明测试命令、结果、预期视觉变化和未完成项。无法运行的测试应写明原因；自比较只能验证稳定性，不能代替与官方基线的比较。

### 提交后检查哪些结果

查看 Bot 的代码审查 Review、GitHub 单测运行，以及 PR 中的工作流摘要。先核对摘要中的当前提交和比较基线，再判断结果是否适用于本次改动。

| 检查项 | 作用与处理方式 |
| --- | --- |
| 代码审查 CR | 阅读问题及对应源码位置，修复后提交更新；关闭讨论本身不等于问题已验证修复 |
| 单元测试 | 使用关联当前版本的 CI 结果；缺失、跳过、运行中或失败不能视为通过 |
| Playwright | 自动执行全量视觉比较并调查差异；差异需要结合图像和源码判断，执行错误不能视为通过 |
| BugServer Photo | 自动执行并保留原始结果，由维护者人工核查；当前为 report-only，不参与三项自动建议的阻断判断 |

Photo 的差异、缺少基准、执行错误和未完成状态会如实保留。三项自动检查完成，不表示 Photo 全部通过。

### 根据工作流状态采取行动

| 显示状态（概述） | 应采取的行动 |
| --- | --- |
| 等待执行／执行中 | 等待当前阶段完成，不把尚无结果理解为通过 |
| 存在待修复或待调查项 | 阅读具体问题，修复或补充证据 |
| 流程受阻 | 查看待办；涉及权限、服务或任务恢复时联系维护者 |
| 等待人工批准 | 维护者核对当前版本的三项结果，并人工核查 Photo |
| 等待人工合入 | 已识别有效批准，由维护者完成最终检查和合入 |
| 流程已完成 | 表示流程收尾完成，Photo 原有差异或错误仍保留 |
| 被新版本替代／未合入关闭 | 前者应查看新版本结果；后者不表示变更已合入或基准已更新 |

### 修改代码之后

推送新提交或比较基线变化后，工作流会重新核对版本并执行必要检查。旧版本结果保留为历史，不能直接作为新版本的通过依据；新提交需要对应的有效批准。

### 批准与合入

工作流识别具有仓库 Maintain 或 Admin 权限的维护者对当前提交作出的有效 GitHub Approve。该批准同时表示维护者已经人工核查 BugServer Photo 结果。

Bot 不自动 Approve 或 Merge。是否能够点击 Merge 还受 GitHub 仓库规则约束；本工作流不会新增强制 Checks 或修改分支保护。

当前暂停 Photo 自动差异评估和标准图自动更新。正常合入后的“跳过标准图更新”属于预期行为；Approve 不会触发自动采用差异图。提前合入也不会使未完成或失败的检查自动变为通过。

### 遇到异常

联系维护者时提供 PR 链接、当前提交 SHA、相关 Review 或 CI 链接，以及可公开的错误说明。没有 BugServer 访问权限的贡献者，由维护者协助核查内部报告。

不要为触发重跑而反复开关 PR、创建重复 PR，或手动编辑 Bot 受管摘要。不要在公开讨论中粘贴凭据、内部报告内容或私有运行日志。

## Mini Task 开发指南

"**good first issue**" 是一个在开源社区常见的标签，这个标签的目的是帮助新贡献者找到适合入门的问题。

VTable 的入门问题，你可以通过 [issue 列表](https://github.com/VisActor/VTable/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) 查看，目前包括两类：

- Demo 编写
- bug 修复及简单功能开发

如果你当前**有时间和意愿**参与到社区贡献，可以在 issue 里看一看 **good first issue**，选择一个感兴趣、适合自己的认领。

相信你一定是一个有始有终的同学，所以，当你了解并决定认领一个 issue 后，请在 issue 下留言告知大家。

### Demo Task

我们准备了一些在实际应用场景中常见的案例，需要思考如何利用 VTable 的能力实现。

你可以通过这类任务，上手对 VTable 的使用。VTable 提供了丰富的能力，每个人或许都有不同的实现思路，**你可以在 issue 下留言，和大家讨论自己的方案**。

任务完成后，你可以将自己制作的案例提交到官网 demo，让更多需要的人学习和使用。

所有的 demo 存放在 `docs/assets/demo` 目录下

1.  请基于 develop 分支，新拉一个 `docs/***`分支进行开发

1.  （如果你已经安装，请跳过此步骤）全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`

1.  根目录下运行 `rush update`

1.  运行`rush docs` 在本地预览目前 demo 内容

1.  `docs` 目录下

    1.  `docs/assets/demo/menu.json` 目录文件中添加你的 demo 信息
    1.  在`zh`/`en`目录下分别完成中英文 demo 文档
    1.  封面地址 cover 字段 可以联系 vtable 的团队成员帮忙上传。

1.  提交所有代码，并在 Github 创建 Pull Request，邀请其他人进行 review

### Bug fix/Feature Task

我们准备了一些简单、易上手的特性开发任务，如果你有一定的 Javascript / Typescript 基础，可以认领这类任务。

你可以通过 bug 的修复及需求的开发过程，从而更快地了解 VTable 代码架构。**你可以在 issue 下留言，和大家讨论自己的方案**。

1.  请基于 develop 分支，新拉一个 `feat/***` or `fix/***`分支进行开发
1.  （如果你已经安装，请跳过此步骤）全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`。

常用的项目命令行如下：

```
# 注释：安装依赖。 install dependencies
$ rush update
# 注释：进入vtable目录。 enter vtable package
$ cd packages/vtable
# 注释：启动开发测试页面。 execute in file path: ./packages/vtable
$ rushx demo
# 注释：在外层目录启动官网页面。 start site development server, execute in file path: ./
$ rush docs
# 注释：提交代码后生成changelog。 after execut git commit, please run the following command to update the change log. Please execute in file path: ./
$ rush change-all
```


4.  提交所有代码，并在 Github 创建 Pull Request，邀请其他人进行 review



### 推广任务贡献指南

推广任务是指你将和VisActor相关的文章、demo、视频 等素材，公开发布到各种媒体渠道的行为。
你可以新建一个 issue，类型选择 `others` 打上 `promotion` 的标签，然后将相关链接，截图，简介等一起发布即可。
例如：[https://github.com/VisActor/VChart/issues/2858](https://github.com/VisActor/VChart/issues/2858)

每个季度我们会评选一些推广VisActor的作品，给予作者一定的物质奖励。

## 拥抱 VisActor 社区

在你为 VisActor 贡献代码之余，我们鼓励你参与其他让社区更加繁荣的事情，比如：

1.  为项目的发展、功能规划 等提建议
1.  创作文章、视频，开办讲座来宣传 VisActor
1.  撰写推广计划，同团队一同执行

VisActor 也在努力帮助参与社区建设的同学一同成长，我们计划（但不限于，期待大家更多的建议）提供如下帮助：

1.  以 VisActor 为基础的数据可视化研发培训，帮助参与的同学在编程技能、可视化理论、架构设计等多个方面快速成长。
1.  定期评选“代码贡献奖”和“社区推广奖”
1.  组织社区成员参与开源活动
