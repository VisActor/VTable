# 贡献指南

首先非常感谢你能抽出时间为我们的开源项目做贡献。希望这份指南能够清晰地阐明贡献过程并回答你可能有的一些问题，所以请你在提 issue 或者 pull request 之前花几分钟时间阅读。

## 行为准则

我们有一份[行为准则](CODE_OF_CONDUCT.md)，希望所有的贡献者都能遵守，请花时间阅读一遍全文以确保你能明白哪些是可以做的，哪些是不可以做的。

## 透明的开发

我们所有的工作都会放在 [GitHub](https://github.com/VisActor/) 上。不管是核心团队的成员还是外部贡献者的 pull request 都需要经过同样流程的 review。

## 版本管理

VTable 遵循[语义化版本控制](https://semver.org/lang/zh-CN/)。我们发布 patch 补丁版本以修复重要的错误，发布 minor 次要版本以提供新功能或非必要的更改，发布 major 主要版本以适应任何重大更改。当我们进行重大更改时，在次要版本中还会引入弃用警告，以便用户了解即将到来的更改并提前迁移代码。

每个重要的更改我们都会记录在对应项目 CHANGELOG 更新日志中。

## 发布周期

- patch 修订版本号：todo
- minor 次版本号：todo
- major 主版本号：todo

## 分支管理

<!-- TODO：待讨论 -->

**请将所有的更改提交到 `main` 主分支**。我们不使用单独的分支进行开发或即将发布的版本管理。我们尽力保持主分支良好状态，确保所有测试都能通过。

这里需要注意，所有进入主分支的代码必须与最新的稳定版本兼容，它可能包含其他功能，但不能有任何破坏性更改。我们应该能够随时从主分支的末端发布一个新的次要版本。

## Bugs 管理

我们使用 [GitHub Issues](todo) 来追踪所有的缺陷。无论内外部的缺陷，我们都会在 issues 上进行管理，尽量让一切公开、清晰明了。在你报告一个 bug 之前，请先确保已经搜索
过已有的 issues。

如果你想要你发现的 bug 被快速解决，最好的办法就是根据我们提供的 issue 模板进行提问，只需要进入 [New issue](todo) 页面，然后选择其中任意一个开始即可，最好能使用这个[模板](todo) 来提供复现的示例代码。

## 提交变更建议

如果你有改进我们的配置项、接口或者新增功能的想法，我们同样推荐你通过 issue 进行提问，或者进入我们的 [New issue](todo) 页面，选择相应的 issue 模板进行提交，

如果你准备帮助我们修复一个 bug，那么你可以立即提交一个 pull request 请求，但我们仍然建议你先创建一个 issue 并在 issue 中详细说明将要修复的内容，这样可以帮助我们更好得追踪问题。

## 你的第一个 Pull Request

`
如果你还不清楚怎么在 GitHub 上提 Pull Request ，可以阅读下面这篇文章来学习：[如何优雅地在 GitHub 上贡献代码](https://segmentfault.com/a/1190000000736629)

为了能帮助你开始你的第一次尝试，我们用[good first issues](todo)标记了一些比较容易修复的 bug 和小功能。这些 issue 可以很好地作为你的首次尝试。

如果你打算开始处理一个 issue，请先检查一下 issue 下面的留言以确保没有别人正在处理这个 issue。如果当前没有人在处理的话你可以留言告知其他人你将会处理这个 issue，以免别人重复劳动。

如果之前有人留言说会处理这个 issue 但是一两个星期都没有动静，那么你也可以接手处理这个 issue，当然还是需要留言告知其他人。

### 如何发送 Pull Request

VisActor 团队会关注所有的 pull request，我们会 review 以及合并你的代码，也有可能要求你做一些修改或者告诉你我们为什么不能接受这样的修改。我们将尽最大努力在整个过程中提供及时的更新和反馈。

在**你发送 Pull Request 之前**，请确认你是按照下面的步骤来做的：

<!-- TODO: 待完善 -->

1. 基于 `main` 分支做修改
2. （如果你已经安装，请跳过此步骤）全局安装 [@microsoft/rush](https://rushjs.io/pages/intro/get_started/)：`npm i --global @microsoft/rush`
3. 根目录下运行 `rush update --full`
4. 如果你修复了一个 bug 或者新增了一个功能，请确保写了相应的测试，这很重要。
5. 确认所有的测试都是通过的 `rush test`。 小贴士：开发过程中可以用 `rush test -- --watch TestName` 来运行指定的测试。
6. 确保你的代码通过了 lint 检查 `rush lint`. 小贴士: Lint 会在你 git commit 的时候自动运行（通过 Git Hooks）。
7. 运行 `rush compile` 进行 ts 类型检测。

## 开发流程

在你 clone 了 VTable 的代码并且使用 `rush update --full` 安装完依赖后，你还可以运行下面几个常用的命令：

1. `rush start` 在本地运行 VTable 代码的测试页面
2. `rush eslint` 运行所有项目的 eslint 脚本
3. `rush test` 运行所有项目的 test 脚本
4. `rush run -p <project_name> -s <script>` 运行指定项目的指定脚本，eg. `rush run -p @visactor/vtable -s start`
5. `rush prettier --dir <project_relative_path> --ext <file_type>` 格式化指定项目的源代码，eg. `rush prettier --dir packages/vtable --ext ts`

