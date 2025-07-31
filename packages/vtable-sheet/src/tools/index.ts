/**
 * 工具函数导出
 * @namespace tools
 */

// 暂时没有导出的工具函数
export {};
/**
 * 检查工作表名称
 */
export function checkTabTitle(newTitle: string): string | null {
  if (!newTitle) {
    return '工作表名称不能为空';
  }
  if (newTitle.length > 100) {
    return '工作表名称不能超过100个字符';
  }
  // 检查是否包含特殊字符，如/ \ ? * [ ] : |
  if (/[\\/:*?"<>|]/.test(newTitle)) {
    return '工作表名称不能包含特殊字符，如/ \\ ? * [ ] : |';
  }
  // 其他规则待补充...
  return null;
}
