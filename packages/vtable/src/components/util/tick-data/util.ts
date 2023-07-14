import type { IBaseScale } from '@visactor/vscale';
import type { IBoundsLike, ITextMeasureOption } from '@visactor/vutils';
import { TextMeasure, degreeToRadian, isValidNumber, AABBBounds, get, polarToCartesian } from '@visactor/vutils';
import { getTextBounds, type IGraphic } from '@visactor/vrender';

const DEFAULT_TEXT_FONT_FAMILY =
  // eslint-disable-next-line max-len
  'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol';

const DEFAULT_TEXT_FONT_SIZE = 14;

const initTextMeasure = (
  textSpec?: Partial<any>,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<any> => {
  return new TextMeasure<any>(
    {
      defaultFontParams: {
        fontFamily: DEFAULT_TEXT_FONT_FAMILY,
        fontSize: DEFAULT_TEXT_FONT_SIZE
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: '-/: .,@%\'"~' + TextMeasure.ALPHABET_CHAR_SET + TextMeasure.ALPHABET_CHAR_SET.toUpperCase(),
      ...(option ?? {})
    },
    textSpec
  );
};

export const radians = (angle?: number) => {
  if (!isValidNumber(angle)) {
    return null;
  }
  return degreeToRadian(angle);
};

export const convertDomainToTickData = (domain: any[], op: any): any[] => {
  const ticks = domain.map((t: number, index: number) => {
    return {
      index,
      value: t,
      label: op.labelFormatter ? op.labelFormatter(t) : `${t}`
    };
  });
  return ticks;
};

/** 判断两个label是否有重叠情况 */
export const labelOverlap = (prevLabel: AABBBounds, nextLabel: AABBBounds, gap: number = 0): boolean => {
  const prevBounds = new AABBBounds(prevLabel).expand(gap / 2);
  const nextBounds = new AABBBounds(nextLabel).expand(gap / 2);
  return prevBounds.intersects(nextBounds);
};

/** 判断两个不相交的label相隔的距离 */
export const labelDistance = (prevLabel: AABBBounds, nextLabel: AABBBounds): [number, number] => {
  let horizontal = 0;
  if (prevLabel.x2 < nextLabel.x1) {
    horizontal = nextLabel.x1 - prevLabel.x2;
  } else if (nextLabel.x2 < prevLabel.x1) {
    horizontal = prevLabel.x1 - nextLabel.x2;
  }

  let vertical = 0;
  if (prevLabel.y2 < nextLabel.y1) {
    vertical = nextLabel.y1 - prevLabel.y2;
  } else if (nextLabel.y2 < prevLabel.y1) {
    vertical = prevLabel.y1 - nextLabel.y2;
  }

  return [horizontal, vertical];
};

export function intersect(a: IBoundsLike, b: IBoundsLike, sep: number) {
  return sep > Math.max(b.x1 - a.x2, a.x1 - b.x2, b.y1 - a.y2, a.y1 - b.y2);
}

export interface ILabelItem<T> extends Pick<IGraphic, 'AABBBounds'> {
  value?: T;
}

export function hasOverlap<T>(items: ILabelItem<T>[], pad: number): boolean {
  for (let i = 1, n = items.length, a = items[0], b; i < n; a = b, ++i) {
    b = items[i];
    if (intersect(a.AABBBounds, b.AABBBounds, pad)) {
      return true;
    }
  }
  return false;
}

const MIN_TICK_GAP = 12;

export const getCartesianLabelBounds = (scale: IBaseScale, domain: any[], op: any): AABBBounds[] => {
  const { labelStyle, axisOrientType, labelFlush, labelFormatter, startAngle = 0 } = op;
  const labelAngle = labelStyle.angle ?? 0;
  const isHorizontal = ['bottom', 'top'].includes(axisOrientType);
  const isVertical = ['left', 'right'].includes(axisOrientType);
  let orientAngle = startAngle;
  if (isHorizontal) {
    orientAngle = 0;
  } else if (isVertical) {
    orientAngle = radians(-90);
  }

  const textMeasure = initTextMeasure(labelStyle);
  const labelBoundsList = domain.map((v: any, i: number) => {
    const str = labelFormatter ? labelFormatter(v) : `${v}`;

    // 估算文本宽高
    const { width, height } = textMeasure.quickMeasure(str);
    const textWidth = Math.max(width, MIN_TICK_GAP);
    const textHeight = Math.max(height, MIN_TICK_GAP);

    // 估算文本位置
    const pos = scale.scale(v);
    let textX = Math.cos(orientAngle) * pos;
    let textY = -Math.sin(orientAngle) * pos;

    let align: any;
    if (labelFlush && isHorizontal && i === 0) {
      align = 'left';
    } else if (labelFlush && isHorizontal && i === domain.length - 1) {
      align = 'right';
    } else {
      align = labelStyle.textAlign ?? 'center';
    }
    if (align === 'right') {
      textX -= textWidth;
    } else if (align === 'center') {
      textX -= textWidth / 2;
    }

    let baseline: any;
    if (labelFlush && isVertical && i === 0) {
      baseline = 'top';
    } else if (labelFlush && isVertical && i === domain.length - 1) {
      baseline = 'bottom';
    } else {
      baseline = labelStyle.textBaseline ?? 'middle';
    }
    if (baseline === 'bottom') {
      textY -= textHeight;
    } else if (baseline === 'middle') {
      textY -= textHeight / 2;
    }

    // 计算 label 包围盒
    const bounds = new AABBBounds()
      .set(textX, textY, textX + textWidth, textY + textHeight)
      .rotate(labelAngle, textX + textWidth / 2, textY + textHeight / 2);
    return bounds;
  });

  return labelBoundsList;
};

export const getPolarAngleLabelBounds = (scale: IBaseScale, domain: any[], op: any): AABBBounds[] => {
  const { labelStyle, getRadius, axisSpec, labelFormatter } = op;
  const radius = getRadius?.();
  const labelAngle = labelStyle.angle ?? 0;

  const labelOffset = getAxisLabelOffset(axisSpec);

  const textMeasure = initTextMeasure(labelStyle);
  const labelBoundsList = domain.map((v: any) => {
    const str = labelFormatter ? labelFormatter(v) : `${v}`;

    // 估算文本宽高
    const { width, height } = textMeasure.quickMeasure(str);
    const textWidth = Math.max(width, MIN_TICK_GAP);
    const textHeight = Math.max(height, MIN_TICK_GAP);

    // 估算文本位置
    const angle = scale.scale(v);
    let textX = 0;
    let textY = 0;
    const orient = angleLabelOrientAttribute(angle);
    const { x, y } = polarToCartesian({ x: 0, y: 0 }, radius + labelOffset, angle);
    textX = x + (orient.align === 'right' ? -textWidth : orient.align === 'center' ? -textWidth / 2 : 0);
    textY = y + (orient.baseline === 'bottom' ? -textHeight : orient.baseline === 'middle' ? -textHeight / 2 : 0);

    // 计算 label 包围盒
    const bounds = new AABBBounds()
      .set(textX, textY, textX + textWidth, textY + textHeight)
      .rotate(labelAngle, textX + textWidth / 2, textY + textHeight / 2);
    return bounds;
  });

  return labelBoundsList;
};

export function getAxisLabelOffset(axisSpec: any) {
  let labelOffset = 0;
  if (get(axisSpec, 'tick.visible')) {
    labelOffset += get(axisSpec, 'tick.tickSize');
  }

  if (get(axisSpec, 'label.visible')) {
    labelOffset += get(axisSpec, 'label.space');
  }

  return labelOffset;
}

export function angleLabelOrientAttribute(angle: number) {
  let align: any = 'center';
  let baseline: any = 'middle';

  angle = normalizeAngle(angle);

  // left: 5/3 - 1/3; right: 2/3 - 4/3; center: 5/3 - 1/3 & 2/3 - 4/3
  if (angle >= Math.PI * (5 / 3) || angle <= Math.PI * (1 / 3)) {
    align = 'left';
  } else if (angle >= Math.PI * (2 / 3) && angle <= Math.PI * (4 / 3)) {
    align = 'right';
  } else {
    align = 'center';
  }

  // bottom: 7/6 - 11/6; top: 1/6 - 5/6; middle: 11/6 - 1/6 & 5/6 - 7/6
  if (angle >= Math.PI * (7 / 6) && angle <= Math.PI * (11 / 6)) {
    baseline = 'bottom';
  } else if (angle >= Math.PI * (1 / 6) && angle <= Math.PI * (5 / 6)) {
    baseline = 'top';
  } else {
    baseline = 'middle';
  }

  return { align, baseline };
}

export function normalizeAngle(angle: number): number {
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  while (angle >= Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  return angle;
}
