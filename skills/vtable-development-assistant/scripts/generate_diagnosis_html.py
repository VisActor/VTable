from pathlib import Path
import argparse


def main():
    parser = argparse.ArgumentParser(description="Generate VTable diagnosis HTML")
    parser.add_argument("--title", default="VTable 问题诊断报告")
    parser.add_argument("--desc", default="基于用户配置的诊断与修复结果")
    parser.add_argument("--config-file")
    parser.add_argument("--output", default="output/diagnosis.html")
    args = parser.parse_args()

    template_path = Path(__file__).resolve().parent.parent / "template" / "diagnosis.html"
    if not template_path.exists():
        raise FileNotFoundError(f"模板不存在: {template_path}")

    if args.config_file:
        config_path = Path(args.config_file)
        if not config_path.exists():
            raise FileNotFoundError(f"配置文件不存在: {config_path}")
        config_block = config_path.read_text(encoding="utf-8")
    else:
        config_block = """const problemReview = {
  specCode: `const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  records: [{ name: "张三", age: 25 }],
  columns: [
    { field: "name", title: "姓名", width: 100 },
    { field: "age", title: "年龄", width: 80 }
  ],
  width: 600,
  height: 400
});`
};

const diagnosis = {
  problem: "示例问题描述",
  cause: "示例原因分析",
  suggestion: "示例修复建议"
};

const solutions = [
  {
    title: "示例修复方案",
    description: "修复方案描述",
    specCode: `const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  records: [{ name: "张三", age: 25 }],
  columns: [
    { field: "name", title: "姓名", width: 120 },
    { field: "age", title: "年龄", width: 80 }
  ],
  width: 600,
  height: 400
});`
  }
];"""

    html = template_path.read_text(encoding="utf-8")
    if "{{CONFIG_BLOCK}}" not in html:
        raise ValueError("模板缺少 CONFIG_BLOCK 占位符")

    html = html.replace("{{REPORT_TITLE}}", args.title)
    html = html.replace("{{REPORT_DESC}}", args.desc)
    html = html.replace("{{CONFIG_BLOCK}}", config_block)

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"生成完成: {output_path.resolve()}")


if __name__ == "__main__":
    main()
