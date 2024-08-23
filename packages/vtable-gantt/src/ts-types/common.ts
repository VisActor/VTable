/**
 * 当前表格的交互状态：
 * Default 默认展示
 * grabing 拖拽中
 *   -Resize column 改变列宽
 *   -column move 调整列顺序
 *   -drag select 拖拽多选
 * Scrolling 滚动中
 */
export enum InteractionState {
  'default' = 'default',
  'grabing' = 'grabing',
  'scrolling' = 'scrolling'
}
