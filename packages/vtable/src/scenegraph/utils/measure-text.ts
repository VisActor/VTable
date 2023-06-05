import type { ITextMeasureOption, ITextSize } from '@visactor/vutils';
// eslint-disable-next-line no-duplicate-imports
import { TextMeasure } from '@visactor/vutils';
import type { ITextGraphicAttribute } from '@visactor/vrender';
import { getTextBounds } from '@visactor/vrender';
// import type { ITextMarkSpec } from '../typings';
// import { DEFAULT_TEXT_FONT_FAMILY, DEFAULT_TEXT_FONT_SIZE } from '../theme';

export const DEFAULT_TEXT_FONT_FAMILY =
  // eslint-disable-next-line max-len
  'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol';

export const DEFAULT_TEXT_FONT_SIZE = 11;

export const initTextMeasure = (
  textSpec?: ITextGraphicAttribute,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextGraphicAttribute> => {
  return new TextMeasure<ITextGraphicAttribute>(
    {
      defaultFontParams: {
        fontFamily: DEFAULT_TEXT_FONT_FAMILY,
        fontSize: DEFAULT_TEXT_FONT_SIZE
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: `-/: .,@%'"~${TextMeasure.ALPHABET_CHAR_SET}${TextMeasure.ALPHABET_CHAR_SET.toUpperCase()}`,
      ...(option ?? {})
    },
    textSpec
  );
};

const fastTextMeasureCache: Map<string, TextMeasure<ITextGraphicAttribute>> = new Map();

function getFastTextMeasure(fontSize: number, fontFamily: string) {
  const key = `${fontSize}-${fontFamily}`;
  const cache = fastTextMeasureCache.get(key);
  if (cache) {
    return cache;
  }
  const fastTextMeasure = initTextMeasure({
    // 16px sans-serif
    fontSize,
    fontFamily
  });
  fastTextMeasureCache.set(key, fastTextMeasure);
  return fastTextMeasure;
}

export class TextMeasureTool {
  /**
   * 获取text宽度，measureText.width
   * @param text
   * @param options
   */
  measureText(text: string, options: ITextGraphicAttribute): ITextSize {
    const { fontSize, fontFamily } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontFamily);
    const textMeasure = fastTextMeasure.measure(text);
    return textMeasure;
  }

  /**
   * 获取text宽度，measureText.width
   * @param text
   * @param options
   */
  measureTextWidth(text: string, options: ITextGraphicAttribute): number {
    const { fontSize, fontFamily = 'sans-serif' } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontFamily);
    const textMeasure = fastTextMeasure.measure(text);
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
