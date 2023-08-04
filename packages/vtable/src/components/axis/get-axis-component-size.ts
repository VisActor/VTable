import { merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ICellAxisOption } from '../../ts-types/component/axis';
import { commonAxis } from './get-axis-attributes';

/**
 * @description: compuational vertical axis width
 * @param {ICellAxisOption} config
 * @return {*}
 */
export function computeAxisConpomentWidth(config: ICellAxisOption, table: BaseTableAPI) {
  const attribute = merge({}, commonAxis, config);
  // tick
  const tickWidth = attribute.tick.width ?? 4;

  // text
  let labelWidth = 0;
  if (attribute.label.visible) {
    if (attribute.type === 'band') {
      const domain = attribute.domain;
      domain.forEach((text: string) => {
        labelWidth = Math.max(
          labelWidth,
          table.measureText(text, {
            fontSize: attribute.label?.style?.fontSize,
            fontFamily: attribute.label?.style?.fontFamily
          }).width
        );
      });
    } else {
      const range = attribute.range;
      const minNumber = Math.abs(range.min) > 1 ? Math.round(range.min) : range.min;
      const maxNumber = Math.abs(range.max) > 1 ? Math.round(range.max) : range.max;
      // abs>1取整保留两位有效数字，abs<1保留一位有效数字
      const minString = formatDecimal(minNumber);
      const maxString = formatDecimal(maxNumber);
      // 这里测量的是预估的最大最小range，与实际现实的label可能不同
      [minString, maxString].forEach(text => {
        labelWidth = Math.max(
          labelWidth,
          table.measureText(text, {
            fontSize: attribute.label?.style?.fontSize,
            fontFamily: attribute.label?.style?.fontFamily
          }).width + 2
        );
      });
    }
    labelWidth += attribute.label.space ?? 4;
  }

  // title
  let titleWidth = 0;
  if (attribute.title.visible && attribute.title.text) {
    if (attribute.title.autoRotate) {
      titleWidth =
        table.measureText(attribute.title.text as string, {
          fontSize: attribute.title?.style?.fontSize,
          fontFamily: attribute.title?.style?.fontFamily
        }).height + 2;
    } else {
      titleWidth =
        table.measureText(attribute.title.text as string, {
          fontSize: attribute.title?.style?.fontSize,
          fontFamily: attribute.title?.style?.fontFamily
        }).width + 2;
    }
    titleWidth += attribute.title.space ?? 4;
  }

  return tickWidth + labelWidth + titleWidth;
}

// 保留一位有效数字
function formatDecimal(number: number) {
  if (typeof number !== 'number') {
    number = Number(number);
  }

  return Number(number.toPrecision(1)).toString(); // 避免科学计数法
}
