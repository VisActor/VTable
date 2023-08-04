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
      [Math.ceil(range.min), Math.ceil(range.max)].forEach(text => {
        labelWidth = Math.max(
          labelWidth,
          table.measureText(text.toString(), {
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
  if (attribute.title.visible) {
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
