# 冻结视觉执行阶段接口

原`node packages/vtable/scripts/visual-test.mjs`完整运行命令保持不变。可信编排方可使用：

```sh
node packages/vtable/scripts/visual-test.mjs --phase build --request /workspace/request.json
```

`--phase`仅接受`build`、`capture`、`compare`，必须与`--request`独立配套使用。阶段只运行已提交、无改动的SDK源码，不联网或安装。输出目录必须为空，两侧构建及采集分别使用独立工作区和输出目录。

请求`schemaVersion: 1`包含`stage`、`side`（baseline/current；compare为null）、`identity`（repository、headSha、baseSha）、`suiteDigest`、`environmentDigest`、`dependencyDigests`（两侧完整SHA256）、`sourceRoot`、`suiteRoot`及`output`。`capture`的`inputs.build`指向同侧构建输出；`compare`的`inputs.baseline/current`指向两侧采集输出。head套件摘要使用`fileManifest`的排序清单JSON计算，固定同一份业务用例、断言和像素策略；`sourceRoot`在基线构建时指向base SDK，其余阶段指向head源码。调用方负责逐侧验证依赖及冻结运行环境。

每个成功结束的阶段输出`stage.json`，绑定输入、完整用例ID、文件摘要、执行码和问题。构建/采集产物的`admissionEvidence`始终为false，不能表示比较通过。完整比较报告继续使用原summary格式，额外保存阶段诊断。基线普通执行失败始终保留失败；只有原显式业务断言失败规则可以形成`new_baseline`。截图阶段和比较阶段分开执行原生Playwright比较器，不更新共享标准图。
