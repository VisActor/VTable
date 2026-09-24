# VTable 开发约定

## 本地视觉测试

- 使用 Node.js 22，在仓库根目录运行视觉测试。开发完成后按改动范围执行相关单例或目录，例如 `node packages/vtable/scripts/visual-test.mjs --case list-basic` 或 `node packages/vtable/scripts/visual-test.mjs --dir pivot`；影响多个模块时扩大测试范围。
- 提交 PR 前运行全量：`node packages/vtable/scripts/visual-test.mjs`。检查报告中的基线、当前和差异图；执行错误或无法运行时如实说明，不把 `--self-compare` 当作官方基线通过，也不通过跳过断言或放宽阈值掩盖差异。
- 新增功能、修复 bug 或发现覆盖空缺时，可以新增有明确目的的确定性用例，或补强现有用例。新用例登记在 `packages/vtable/__tests__/visual/cases/index.mjs`；交互用例须执行真实动作并断言结果。新增或修改用例先运行单例 `--self-compare`，再运行相关目录。
- 开发者或编码 Agent 独立新增的用例**完全省略** `BugServer case IDs` 行，不填写空值、占位或虚构 ID。由现有 BugServer case 迁移的用例保留真实来源 ID，合并来源时列出全部真实 ID。未来同步到 BugServer 成功后，再补写服务返回的真实 ID；本期没有同步脚本。
- 环境准备、报告和清理见 [视觉测试说明](./packages/vtable/__tests__/visual/README.md)；目录与用例格式见 [用例指南](./packages/vtable/__tests__/visual/cases/README.md)。本次任务启动的浏览器、服务和其他测试进程在结束时应停止。
