import { isArray, isFunction, isString, merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { ICellAxisOption } from '../../ts-types/component/axis';
import { DEFAULT_TEXT_FONT_FAMILY, DEFAULT_TEXT_FONT_SIZE, commonAxis } from './get-axis-attributes';

export type ComputeAxisComponentWidth = (config: ICellAxisOption, table: BaseTableAPI) => number;
export type ComputeAxisComponentHeight = (config: ICellAxisOption, table: BaseTableAPI) => number;
/**
 * @description: compuational vertical axis width
 * @param {ICellAxisOption} config
 * @return {*}
 */
export function computeAxisComponentWidth(config: ICellAxisOption, table: BaseTableAPI) {
  const attribute = merge({}, commonAxis, config);
  // tick
  let tickWidth = 0;
  if (attribute.tick.visible !== false) {
    tickWidth = attribute.tick.width ?? 4;
  }

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
          fontSize: attribute.label?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
          fontWeight: attribute.label?.style?.fontWeight ?? 'normal',
          fontFamily: attribute.label?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
        });
        const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
        const angel =
          (attribute.label?.style?.angle ?? 0) + (attribute.label?.style?.direction === 'vertical' ? 90 : 0);
        labelWidth = Math.max(labelWidth, getSizeAfterResize(Math.min(width, widthLimit), height, angel).width);
      });
    } else {
      let ticks: string[];
      if (config.sync?.tickAlign && isFunction(config.tick?.tickMode)) {
        ticks = config.tick.tickMode();
      } else if (isArray((config as any).__ticksForVTable)) {
        ticks = (config as any).__ticksForVTable;
      } else {
        const range = attribute.range;
        const minNumber = Math.abs(range.min) > 1 ? Math.round(range.min) : range.min;
        const maxNumber = Math.abs(range.max) > 1 ? Math.round(range.max) : range.max;
        // abs>1取整保留两位有效数字，abs<1保留一位有效数字
        const minString = formatDecimal(minNumber);
        const maxString = formatDecimal(maxNumber);
        // 这里测量的是预估的最大最小range，与实际现实的label可能不同
        ticks = [minString, maxString];
      }
      ticks.forEach(text => {
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
          fontWeight: attribute.label?.style?.fontWeight ?? 'normal',
          fontFamily: attribute.label?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
        });
        const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
        const angle =
          (attribute.label?.style?.angle ?? 0) + (attribute.label?.style?.direction === 'vertical' ? 90 : 0);
        labelWidth = Math.max(labelWidth, getSizeAfterResize(Math.min(width, widthLimit), height, angle).width);
      });
    }
    labelWidth += attribute.label.space ?? 4;
  }

  // title
  let titleWidth = 0;
  // align with vrender-component, use isString()
  if (attribute.title.visible && isString(attribute.title.text)) {
    const { width, height } = table.measureText(attribute.title.text, {
      fontSize: attribute.title?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
      fontWeight: attribute.title?.style?.fontWeight ?? 'normal',
      fontFamily: attribute.title?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
    });
    const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
    const size = getSizeAfterResize(Math.min(width, widthLimit), height, attribute.title?.style?.angle);
    if ((config.orient === 'left' || config.orient === 'right') && attribute.title.autoRotate) {
      titleWidth = size.height;
    } else {
      titleWidth = size.width;
    }
    titleWidth += attribute.title.space ?? 4;
  }
  return Math.ceil(tickWidth + labelWidth + titleWidth + 1); // 2 is buffer
}

/**
 * @description: compuational horizontal axis height
 * @param {ICellAxisOption} config
 * @return {*}
 */
export function computeAxisComponentHeight(config: ICellAxisOption, table: BaseTableAPI) {
  const attribute = merge({}, commonAxis, config);
  // tick
  let tickHeight = 0;
  if (attribute.tick.visible !== false) {
    tickHeight = attribute.tick.width ?? 4;
  }

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
          fontSize: attribute.label?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
          fontWeight: attribute.label?.style?.fontWeight ?? 'normal',
          fontFamily: attribute.label?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
        });
        const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
        const angle =
          (attribute.label?.style?.angle ?? 0) + (attribute.label?.style?.direction === 'vertical' ? 90 : 0);
        labelHeight = Math.max(labelHeight, getSizeAfterResize(Math.min(width, widthLimit), height, angle).height);
      });
    } else {
      let ticks: string[];
      if (config.sync?.tickAlign && isFunction(config.tick?.tickMode)) {
        ticks = config.tick.tickMode();
      } else if (isArray((config as any).__ticksForVTable)) {
        ticks = (config as any).__ticksForVTable;
      } else {
        const range = attribute.range;
        const minNumber = Math.abs(range.min) > 1 ? Math.round(range.min) : range.min;
        const maxNumber = Math.abs(range.max) > 1 ? Math.round(range.max) : range.max;
        // abs>1取整保留两位有效数字，abs<1保留一位有效数字
        const minString = formatDecimal(minNumber);
        const maxString = formatDecimal(maxNumber);
        // 这里测量的是预估的最大最小range，与实际现实的label可能不同
        ticks = [minString, maxString];
      }
      ticks.forEach(text => {
        if (attribute.label.formatMethod) {
          text = attribute.label.formatMethod(text);
        }
        const { width, height } = table.measureText(text, {
          fontSize: attribute.label?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
          fontWeight: attribute.label?.style?.fontWeight ?? 'normal',
          fontFamily: attribute.label?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
        });
        const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
        const angle =
          (attribute.label?.style?.angle ?? 0) + (attribute.label?.style?.direction === 'vertical' ? 90 : 0);
        labelHeight = Math.max(labelHeight, getSizeAfterResize(Math.min(width, widthLimit), height, angle).height);
      });
    }
    labelHeight += attribute.label.space ?? 4;
  }

  // title
  let titleHeight = 0;
  if (attribute.title.visible && attribute.title.text) {
    const { width, height } = table.measureText(attribute.title.text, {
      fontSize: attribute.title?.style?.fontSize ?? DEFAULT_TEXT_FONT_SIZE,
      fontWeight: attribute.title?.style?.fontWeight ?? 'normal',
      fontFamily: attribute.title?.style?.fontFamily ?? DEFAULT_TEXT_FONT_FAMILY
    });
    const widthLimit = attribute.label?.style?.maxLineWidth || Infinity;
    const size = getSizeAfterResize(Math.min(width, widthLimit), height, attribute.title?.style?.angle);
    if ((config.orient === 'bottom' || config.orient === 'top') && attribute.title.autoRotate) {
      titleHeight = size.width;
    } else {
      titleHeight = size.height;
    }
    titleHeight += attribute.title.space ?? 4;
  }

  return tickHeight + labelHeight + titleHeight + 1; // 2 is buffer
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
