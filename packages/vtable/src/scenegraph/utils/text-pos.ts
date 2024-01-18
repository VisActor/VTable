/* eslint-disable no-undef */
import type { IFullThemeSpec, Text } from '@src/vrender';
import type { Group } from '../graphic/group';
import { getProp } from './get-prop';
import { getQuadProps } from './padding';
import type { BaseTableAPI } from '../../ts-types/base-table';

/**
 * @description: 获取对应样式和容器尺寸下的文字位置
 * @return {*}
 */
export function getTextPos(
  padding: number[],
  textAlign: CanvasTextAlign,
  textBaseline: CanvasTextBaseline,
  width: number,
  height: number
) {
  let textX = padding[3] || 10;
  if (textAlign === 'right' || textAlign === 'end') {
    textX = width - 0 - (padding[1] || 10);
  } else if (textAlign === 'center') {
    textX = 0 + (width - 0 + (padding[3] || 10) - (padding[1] || 10)) / 2;
  }
  let textY = 0 + (padding[0] || 10);
  if (textBaseline === 'bottom' || textBaseline === 'alphabetic' || textBaseline === 'ideographic') {
    textY = height - 0 - (padding[2] || 10);
  } else if (textBaseline === 'middle') {
    textY = 0 + (height - 0 - (padding[0] || 10) - (padding[2] || 10)) / 2 + (padding[0] || 10);
  }

  return {
    x: textX,
    y: textY
  };
}

/**
 * @description: 更新单元格中的文字位置
 * @return {*}
 */
export function updateTextPose(table: BaseTableAPI, cell: Group, col: number, row: number, theme: IFullThemeSpec) {
  const headerStyle = table._getCellStyle(col, row);
  const padding = getQuadProps(getProp('padding', headerStyle, col, row, table));
  const text = cell.getChildByName('text') as Text;
  text.setAttributes(
    getTextPos(padding, theme.text.textAlign, theme.text.textBaseline, cell.attribute.width, cell.attribute.height)
  );
}
