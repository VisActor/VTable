import type { ITextGraphicAttribute, TextOptionsType } from '@src/vrender';
import {
  DefaultTextStyle,
  getTextBounds,
  DefaultTextMeasureContribution,
  TextMeasureContribution,
  ContainerModule,
  container,
  Text
} from '@src/vrender';
import { MeasureModeEnum } from '@src/vrender';
// eslint-disable-next-line max-len
// import {
//   DefaultTextMeasureContribution,
//   TextMeasureContribution
// } from '@visactor/vrender/es/core/contributions/textMeasure/textMeasure-contribution';
import type { ITextMeasureOption, ITextSize } from '@visactor/vutils';
import { isValid, TextMeasure } from '@visactor/vutils';

let customAlphabetCharSet = '';
let textMeasureMode: 'quick' | 'canvas' = 'quick';

type ITextGraphicAttributeFroMeasure = Omit<ITextGraphicAttribute, 'lineHeight'> & {
  lineHeight?: number;
};

const textMeasureModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  if (isBound(TextMeasureContribution)) {
    rebind(TextMeasureContribution).to(FastTextMeasureContribution).inSingletonScope();
  } else {
    bind(TextMeasureContribution).to(FastTextMeasureContribution).inSingletonScope();
  }
});

const restoreTextMeasureModule = new ContainerModule((bind, unbind, isBound, rebind) => {
  if (isBound(TextMeasureContribution)) {
    rebind(TextMeasureContribution).to(DefaultTextMeasureContribution).inSingletonScope();
  } else {
    bind(TextMeasureContribution).to(DefaultTextMeasureContribution).inSingletonScope();
  }
});

export default textMeasureModule;

export const initTextMeasure = (
  textSpec?: ITextGraphicAttributeFroMeasure,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextGraphicAttributeFroMeasure> => {
  return new TextMeasure<ITextGraphicAttributeFroMeasure>(
    {
      defaultFontParams: {
        fontFamily: DefaultTextStyle.fontFamily,
        fontSize: DefaultTextStyle.fontSize
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: `{}()//&-/: .,@%'"~…=——${
        TextMeasure.ALPHABET_CHAR_SET
      }${TextMeasure.ALPHABET_CHAR_SET.toUpperCase()}0123456789${customAlphabetCharSet}`,
      ...(option ?? {})
    },
    textSpec
  );
};

const fastTextMeasureCache: Map<string, TextMeasure<ITextGraphicAttributeFroMeasure>> = new Map();

function getFastTextMeasure(
  fontSize: number,
  fontWeight: string | number,
  fontFamily: string,
  fontStyle: string = 'normal'
) {
  const key = `${fontSize}-${fontWeight}-${fontFamily}-${fontStyle}`;
  const cache = fastTextMeasureCache.get(key);
  if (cache) {
    return cache;
  }
  const fastTextMeasure = initTextMeasure({
    // 16px sans-serif
    fontSize,
    fontFamily,
    fontWeight,
    fontStyle
  });
  fastTextMeasureCache.set(key, fastTextMeasure);
  return fastTextMeasure;
}

export class FastTextMeasureContribution extends DefaultTextMeasureContribution {
  _fastMeasure(text: string, options: TextOptionsType) {
    const { fontSize, fontFamily = 'Arial,sans-serif', fontWeight = 'normal', fontStyle = 'normal' } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontWeight, fontFamily, fontStyle);
    const textMeasure = fastTextMeasure.measure(text, textMeasureMode);

    if (!isValid(textMeasure.fontBoundingBoxAscent) && !isValid(textMeasure.fontBoundingBoxDescent)) {
      const { ascent, descent } = this.measureTextBoundADscentEstimate(options);
      textMeasure.fontBoundingBoxAscent = ascent;
      textMeasure.fontBoundingBoxDescent = descent;
    }
    return textMeasure;
  }
  /**
   * 获取text宽度，measureText.width
   * @param text
   * @param options
   */
  measureTextWidth(text: string, options: TextOptionsType): number {
    // if (!this.context) {
    //   return this.estimate(text, options).width;
    // }
    // this.context.setTextStyleWithoutAlignBaseline(options);
    // const textMeasure = this.context.measureText(text);
    // return textMeasure.width;

    return this._fastMeasure(text, options).width;
  }

  /**
   * 获取text测量对象
   * @param text
   * @param options
   */
  measureText(text: string, options: TextOptionsType): TextMetrics | { width: number } {
    // if (!this.context) {
    //   return this.estimate(text, options);
    // }
    // this.context.setTextStyleWithoutAlignBaseline(options);
    // return this.context.measureText(text);

    return this._fastMeasure(text, options);
  }

  protected _measureTextWithoutAlignBaseline(
    text: string,
    options: TextOptionsType,
    compatible?: boolean
  ): { width: number } | TextMetrics {
    return this._fastMeasure(text, options);
  }

  protected _measureTextWithAlignBaseline(text: string, options: TextOptionsType, compatible?: boolean) {
    return this._fastMeasure(text, options);
  }
}

export class TextMeasureTool {
  /**
   * 获取text宽度，measureText.width
   * @param text
   * @param options
   */
  measureText(text: string, options: ITextGraphicAttribute): ITextSize {
    const { fontSize, fontFamily = 'Arial,sans-serif', fontWeight = 'normal', fontStyle = 'normal' } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontWeight, fontFamily, fontStyle);
    const textMeasure = fastTextMeasure.measure(text, textMeasureMode);
    return textMeasure;
  }

  /**
   * 获取text宽度，measureText.width
   * @param text
   * @param options
   */
  measureTextWidth(text: string, options: ITextGraphicAttribute): number {
    const { fontSize, fontFamily = 'Arial,sans-serif', fontWeight = 'normal', fontStyle = 'normal' } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontWeight, fontFamily, fontStyle);
    const textMeasure = fastTextMeasure.measure(text, textMeasureMode);
    return textMeasure.width;
  }

  /**
   * 将文本裁剪到width宽
   * @param text
   * @param options
   * @param width
   */
  clipText(
    text: string,
    options: ITextGraphicAttribute,
    width: number
  ): {
    str: string;
    width: number;
  } {
    if (text.length === 0) {
      return { str: '', width: 0 };
    }
    let length = this.measureTextWidth(text, options);
    if (length <= width) {
      return { str: text, width: length };
    }
    length = this.measureTextWidth(text[0], options);
    if (length > width) {
      return { str: '', width: 0 };
    }
    return this._clipText(text, options, width, 0, text.length - 1);
  }

  // 二分法找到最佳宽
  private _clipText(
    text: string,
    options: ITextGraphicAttribute,
    width: number,
    leftIdx: number,
    rightIdx: number
  ): { str: string; width: number } {
    const middleIdx = Math.floor((leftIdx + rightIdx) / 2);
    const subText = text.substring(0, middleIdx + 1);
    const strWidth = this.measureTextWidth(subText, options);
    let length: number;
    if (strWidth > width) {
      // 如果字符串的宽度大于限制宽度
      if (subText.length <= 1) {
        return { str: '', width: 0 };
      } // 如果子字符串长度小于1，而且大于给定宽的话，返回空字符串
      // 先判断是不是左侧的那个字符
      const str = text.substring(0, middleIdx);
      // 如果到左侧的字符小于或等于width，那么说明就是左侧的字符
      length = this.measureTextWidth(str, options);
      if (length <= width) {
        return { str, width: length };
      }
      // 返回leftIdx到middleIdx
      return this._clipText(text, options, width, leftIdx, middleIdx);
    } else if (strWidth < width) {
      // 如果字符串的宽度小于限制宽度
      if (middleIdx >= text.length - 1) {
        return { str: text, width: this.measureTextWidth(text, options) };
      } // 如果已经到结尾了，返回text
      // 先判断是不是右侧的那个字符
      const str = text.substring(0, middleIdx + 2);
      // 如果到右侧的字符大于或等于width，那么说明就是这个字符串
      length = this.measureTextWidth(str, options);
      if (length >= width) {
        return { str: subText, width: strWidth };
      }
      // 返回middleIdx到rightIdx
      return this._clipText(text, options, width, middleIdx, rightIdx);
    }
    // 如果相同，那么就找到text
    return { str: subText, width: strWidth };
  }

  clipTextWithSuffix(
    text: string,
    options: ITextGraphicAttribute,
    width: number,
    suffix: string
  ): {
    str: string;
    width: number;
  } {
    if (suffix === '') {
      return this.clipText(text, options, width);
    }
    if (text.length === 0) {
      return { str: '', width: 0 };
    }
    const length = this.measureTextWidth(text, options);
    if (length <= width) {
      return { str: text, width: length };
    }
    const suffixWidth = this.measureTextWidth(suffix, options);
    if (suffixWidth > width) {
      return { str: '', width: 0 };
    }
    width -= suffixWidth;
    const data = this._clipText(text, options, width, 0, text.length - 1);
    data.str += suffix;
    data.width += suffixWidth;
    return data;
  }
}

export const textMeasure = new TextMeasureTool();

// add user custom alphabet char set into fast measurement
export function setCustomAlphabetCharSet(str: string) {
  customAlphabetCharSet = str;
  fastTextMeasureCache.clear();
  // container.load(textMeasureModule);
}

// change fast textMeasure into canvas textMeasure
export function restoreMeasureText() {
  textMeasureMode = 'canvas';
  container.load(restoreTextMeasureModule);
}

const utilTextMark = new Text({
  ignoreBuf: true
  // autoWrapText: true
});

export function measureTextBounds(attribute: ITextGraphicAttribute) {
  utilTextMark.initAttributes({
    ...attribute,
    ignoreBuf: true
  });
  return utilTextMark.AABBBounds;
}
