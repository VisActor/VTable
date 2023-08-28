import { merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ICellAxisOption } from '../../ts-types/component/axis';
import { commonAxis } from './get-axis-attributes';

/**
 * @description: compuational vertical axis width
 * @param {ICellAxisOption} config
 * @return {*}
 */
export function computeAxisComponentWidth(config: ICellAxisOption, table: BaseTableAPI) {
  const attribute = merge({}, commonAxis, config);
  // tick
  const tickWidth = attribute.tick.width ?? 4;

  // text
  let labelWidth = 0;
  if (attribute.label.visible) {
    if (attribute.type === 'band') {
      const domain = attribute.domain;
      domain.forEach((text: string) => {
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize,
          fontWeight: attribute.label?.style?.fontWeight,
          fontFamily: attribute.label?.style?.fontFamily
        });
        labelWidth = Math.max(labelWidth, getSizeAfterResize(width, height, attribute.label?.style?.angle).width);
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
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize,
          fontWeight: attribute.label?.style?.fontWeight,
          fontFamily: attribute.label?.style?.fontFamily
        });
        labelWidth = Math.max(labelWidth, getSizeAfterResize(width, height, attribute.label?.style?.angle).width + 2);
      });
    }
    labelWidth += attribute.label.space ?? 4;
  }

  // title
  let titleWidth = 0;
  if (attribute.title.visible && attribute.title.text) {
    const { width, height } = table.measureText(attribute.title.text, {
      fontSize: attribute.label?.style?.fontSize,
      fontWeight: attribute.label?.style?.fontWeight,
      fontFamily: attribute.label?.style?.fontFamily
    });
    const size = getSizeAfterResize(width, height, attribute.label?.style?.angle);
    if ((config.orient === 'left' || config.orient === 'right') && attribute.title.autoRotate) {
      titleWidth = size.height + 2;
    } else {
      titleWidth = size.width + 2;
    }
    titleWidth += attribute.title.space ?? 4;
  }

  return tickWidth + labelWidth + titleWidth;
}

/**
 * @description: compuational horizontal axis height
 * @param {ICellAxisOption} config
 * @return {*}
 */
export function computeAxisComponentHeight(config: ICellAxisOption, table: BaseTableAPI) {
  const attribute = merge({}, commonAxis, config);
  // tick
  const tickHeight = attribute.tick.width ?? 4;

  // text
  let labelHeight = 0;
  if (attribute.label.visible) {
    if (attribute.type === 'band') {
      const domain = attribute.domain;
      domain.forEach((text: string) => {
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize,
          fontWeight: attribute.label?.style?.fontWeight,
          fontFamily: attribute.label?.style?.fontFamily
        });
        labelHeight = Math.max(labelHeight, getSizeAfterResize(width, height, attribute.label?.style?.angle).height);
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
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize,
          fontWeight: attribute.label?.style?.fontWeight,
          fontFamily: attribute.label?.style?.fontFamily
        });
        labelHeight = Math.max(
          labelHeight,
          getSizeAfterResize(width, height, attribute.label?.style?.angle).height + 2
        );
      });
    }
    labelHeight += attribute.label.space ?? 4;
  }

  // title
  let titleHeight = 0;
  if (attribute.title.visible && attribute.title.text) {
    const { width, height } = table.measureText(attribute.title.text, {
      fontSize: attribute.label?.style?.fontSize,
      fontWeight: attribute.label?.style?.fontWeight,
      fontFamily: attribute.label?.style?.fontFamily
    });
    const size = getSizeAfterResize(width, height, attribute.label?.style?.angle);
    if ((config.orient === 'bottom' || config.orient === 'top') && attribute.title.autoRotate) {
      titleHeight = size.width + 2;
    } else {
      titleHeight = size.height + 2;
    }
    titleHeight += attribute.title.space ?? 4;
  }

  return tickHeight + labelHeight + titleHeight;
}

// 保留一位有效数字
function formatDecimal(number: number) {
  if (typeof number !== 'number') {
    number = Number(number);
  }

  return Number(number.toPrecision(1)).toString(); // 避免科学计数法
}

// 计算旋转后的size
function getSizeAfterResize(width: number, height: number, angle = 0) {
  const theta = (angle * Math.PI) / 180; // 角度转为弧度
  const p1 = { x: -width / 2, y: -height / 2 };
  const p2 = { x: width / 2, y: -height / 2 };
  const p3 = { x: width / 2, y: height / 2 };
  const p4 = { x: -width / 2, y: height / 2 };

  const p1Rotated = {
    x: p1.x * Math.cos(theta) - p1.y * Math.sin(theta),
    y: p1.x * Math.sin(theta) + p1.y * Math.cos(theta)
  };
  const p2Rotated = {
    x: p2.x * Math.cos(theta) - p2.y * Math.sin(theta),
    y: p2.x * Math.sin(theta) + p2.y * Math.cos(theta)
  };
  const p3Rotated = {
    x: p3.x * Math.cos(theta) - p3.y * Math.sin(theta),
    y: p3.x * Math.sin(theta) + p3.y * Math.cos(theta)
  };
  const p4Rotated = {
    x: p4.x * Math.cos(theta) - p4.y * Math.sin(theta),
    y: p4.x * Math.sin(theta) + p4.y * Math.cos(theta)
  };

  const bounds = {
    minX: Math.min(p1Rotated.x, p2Rotated.x, p3Rotated.x, p4Rotated.x),
    maxX: Math.max(p1Rotated.x, p2Rotated.x, p3Rotated.x, p4Rotated.x),
    minY: Math.min(p1Rotated.y, p2Rotated.y, p3Rotated.y, p4Rotated.y),
    maxY: Math.max(p1Rotated.y, p2Rotated.y, p3Rotated.y, p4Rotated.y)
  };

  return {
    width: bounds.maxX - bounds.minX,
    height: bounds.maxY - bounds.minY
  };
}
