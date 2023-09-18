import type { ITextGraphicAttribute, TextOptionsType } from '@visactor/vrender';
import {
  DefaultTextStyle,
  getTextBounds,
  DefaultTextMeasureContribution,
  TextMeasureContribution
} from '@visactor/vrender';
// eslint-disable-next-line max-len
// import {
//   DefaultTextMeasureContribution,
//   TextMeasureContribution
// } from '@visactor/vrender/es/core/contributions/textMeasure/textMeasure-contribution';
import type { ITextMeasureOption } from '@visactor/vutils';
import { TextMeasure } from '@visactor/vutils';
import { ContainerModule } from 'inversify';

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  bind(FastTextMeasureContribution).toSelf().inSingletonScope();
  rebind(TextMeasureContribution).toService(FastTextMeasureContribution);
});

export const initTextMeasure = (
  textSpec?: ITextGraphicAttribute,
  option?: Partial<ITextMeasureOption>,
  useNaiveCanvas?: boolean
): TextMeasure<ITextGraphicAttribute> => {
  return new TextMeasure<ITextGraphicAttribute>(
    {
      defaultFontParams: {
        fontFamily: DefaultTextStyle.fontFamily,
        fontSize: DefaultTextStyle.fontSize
      },
      getTextBounds: useNaiveCanvas ? undefined : getTextBounds,
      specialCharSet: `{}()//&-/: .,@%'"~${
        TextMeasure.ALPHABET_CHAR_SET
      }${TextMeasure.ALPHABET_CHAR_SET.toUpperCase()}`,
      ...(option ?? {})
    },
    textSpec
  );
};

const fastTextMeasureCache: Map<string, TextMeasure<ITextGraphicAttribute>> = new Map();

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

    const { fontSize, fontFamily, fontWeight, fontStyle } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontWeight, fontFamily, fontStyle);
    const textMeasure = fastTextMeasure.measure(text);
    return textMeasure.width;
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

    const { fontSize, fontFamily, fontWeight, fontStyle } = options;
    const fastTextMeasure = getFastTextMeasure(fontSize, fontWeight, fontFamily, fontStyle);
    const textMeasure = fastTextMeasure.measure(text);
    return textMeasure;
  }
}
