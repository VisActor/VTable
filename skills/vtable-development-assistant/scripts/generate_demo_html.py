from pathlib import Path
import argparse


def escape_js_string(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace("`", "\\`")
        .replace("${", "\\${")
        .replace("\n", "\\n")
        .replace("\r", "\\r")
        .replace("\t", "\\t")
    )


def main():
    parser = argparse.ArgumentParser(description="Generate VTable demo HTML")
    parser.add_argument("--title", default="VTable 表格示例")
    parser.add_argument("--desc", default="基于需求生成的可运行表格配置")
    parser.add_argument("--feature", default="补充主要功能说明")
    parser.add_argument("--tips", default="补充编辑提示")
    parser.add_argument("--spec-file")
    parser.add_argument("--output", default="output/demo.html")
    args = parser.parse_args()

    template_path = Path(__file__).resolve().parent.parent / "template" / "demo.html"
    if not template_path.exists():
        raise FileNotFoundError(f"模板不存在: {template_path}")

    if args.spec_file:
        spec_path = Path(args.spec_file)
        if not spec_path.exists():
            raise FileNotFoundError(f"配置文件不存在: {spec_path}")
        spec_code = spec_path.read_text(encoding="utf-8")
    else:
        spec_code = """const tableInstance = new VTable.ListTable({
  container: document.getElementById('container'),
  records: [{ name: "张三", age: 25 }],
  columns: [
    { field: "name", title: "姓名", width: 100 },
    { field: "age", title: "年龄", width: 80 }
  ],
  width: 600,
  height: 400
});"""

    html = template_path.read_text(encoding="utf-8")
    html = html.replace("{{REPORT_TITLE}}", args.title)
    html = html.replace("{{REPORT_DESC}}", args.desc)
    html = html.replace("{{FEATURE_DESC}}", args.feature)
    html = html.replace("{{EDIT_TIPS}}", args.tips)
    html = html.replace("{{INITIAL_CODE}}", escape_js_string(spec_code.strip()))

    output_path = Path(args.output)
    output_path.parent.mkdir(parents=True, exist_ok=True)
    output_path.write_text(html, encoding="utf-8")
    print(f"生成完成: {output_path.resolve()}")


if __name__ == "__main__":
    main()
