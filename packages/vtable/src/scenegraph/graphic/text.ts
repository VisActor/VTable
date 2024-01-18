export type { ITextGraphicAttribute, IWrapTextGraphicAttribute } from '@src/vrender';
export { Text as WrapText } from '@src/vrender';
// import { getTheme, graphicUtil, Text, CanvasTextLayout, textDrawOffsetX, textLayoutOffsetY } from '@src/vrender';
// import type { Bounds } from '@visactor/vutils';
// import { textMeasure } from '../utils/measure-text';

/* WrapText功能/dist/core/contributions/textMeasure/layout
 * 1. 按照宽度限制自动折行或显示省略号
 * 2. 高度限制控制显示内容及省略号
 */

// const WRAP_TEXT_UPDATE_TAG_KEY = ['heightLimit', 'lineClamp', 'autoWrapText'];

// export interface IWrapTextGraphicAttribute extends ITextGraphicAttribute {
//   // widthLimit: number;
//   heightLimit?: number;
//   lineClamp?: number;
//   autoWrapText?: boolean;
// }
// export class WrapText extends Text {
//   declare attribute: IWrapTextGraphicAttribute;

//   // eslint-disable-next-line no-useless-constructor
//   constructor(params: IWrapTextGraphicAttribute) {
//     super(params);
//   }

//   /**
//    * 计算单行文字的bounds，可以缓存长度以及截取的文字
//    * @param text
//    */
//   updateSingallineAABBBounds(text: number | string) {
//     const textTheme = getTheme(this).text;
//     // const textMeasure = graphicUtil.textMeasure;
//     let width: number;
//     let str: string;
//     const attribute = this.attribute;
//     const {
//       maxLineWidth = textTheme.maxLineWidth,
//       ellipsis = textTheme.ellipsis,
//       textAlign = textTheme.textAlign,
//       textBaseline = textTheme.textBaseline,
//       fontSize = textTheme.fontSize,
//       fontFamily = textTheme.fontFamily,
//       fontWeight = textTheme.fontWeight,
//       stroke = textTheme.stroke,
//       lineHeight = attribute.lineHeight ?? attribute.fontSize ?? textTheme.fontSize,
//       lineWidth = textTheme.lineWidth
//     } = attribute;

//     if (!this.shouldUpdateShape() && this.cache) {
//       width = this.cache.clipedWidth;
//       const dx = textDrawOffsetX(textAlign, width);
//       const dy = textLayoutOffsetY(textBaseline, lineHeight, fontSize);
//       this._AABBBounds.set(dx, dy, dx + width, dy + lineHeight);
//       if (stroke) {
//         this._AABBBounds.expand(lineWidth / 2);
//       }
//       return this._AABBBounds;
//     }

//     if (Number.isFinite(maxLineWidth)) {
//       if (ellipsis) {
//         const strEllipsis = (ellipsis === true ? textTheme.ellipsis : ellipsis) as string;
//         const data = textMeasure.clipTextWithSuffix(
//           text.toString(),
//           { fontSize, fontFamily },
//           maxLineWidth,
//           strEllipsis
//         );
//         str = data.str;
//         width = data.width;
//       } else {
//         const data = textMeasure.clipText(text.toString(), { fontSize, fontFamily }, maxLineWidth);
//         str = data.str;
//         width = data.width;
//       }
//       this.cache.clipedText = str;
//       this.cache.clipedWidth = width;
//       // todo 计算原本的宽度
//     } else {
//       width = textMeasure.measureTextWidth(text.toString(), { fontSize, fontFamily, fontWeight });
//       this.cache.clipedText = text.toString();
//       this.cache.clipedWidth = width;
//     }
//     this.clearUpdateShapeTag();

//     const dx = textDrawOffsetX(textAlign, width);
//     const dy = textLayoutOffsetY(textBaseline, lineHeight, fontSize);
//     this._AABBBounds.set(dx, dy, dx + width, dy + lineHeight);

//     if (stroke) {
//       this._AABBBounds.expand(lineWidth / 2);
//     }

//     return this._AABBBounds;
//   }

//   /**
//    * 计算多行文字的bounds，缓存每行文字的布局位置
//    * 自动折行params.text是数组，因此只重新updateMultilineAABBBounds
//    * @param text
//    */
//   updateMultilineAABBBounds(text: (number | string)[]) {
//     const textTheme = getTheme(this).text;
//     const {
//       fontFamily = textTheme.fontFamily,
//       textAlign = textTheme.textAlign,
//       fontWeight = textTheme.fontWeight,
//       textBaseline = textTheme.textBaseline,
//       fontSize = textTheme.fontSize,
//       lineHeight = this.attribute.lineHeight ?? this.attribute.fontSize ?? textTheme.fontSize,
//       ellipsis = textTheme.ellipsis,
//       maxLineWidth,
//       stroke = textTheme.stroke,
//       lineWidth = textTheme.lineWidth,
//       // widthLimit,
//       heightLimit = -1,
//       lineClamp = (textTheme as any).lineClamp,
//       autoWrapText = (textTheme as any).autoWrapText
//     } = this.attribute;

//     if (!this.shouldUpdateShape() && this.cache?.layoutData) {
//       const bbox = this.cache.layoutData.bbox;
//       this._AABBBounds.set(bbox.xOffset, bbox.yOffset, bbox.xOffset + bbox.width, bbox.yOffset + bbox.height);
//       if (stroke) {
//         this._AABBBounds.expand(lineWidth / 2);
//       }
//       return this._AABBBounds;
//     }

//     // const textMeasure = graphicUtil.textMeasure;
//     const layoutObj = new CanvasTextLayout(fontFamily, { fontSize, fontFamily }, textMeasure as any) as any;

//     // layoutObj内逻辑
//     const lines = text.map(l => l.toString()) as string[];
//     const linesLayout: LayoutItemType[] = [];
//     const bboxWH: [number, number] = [0, 0];

//     let lineCountLimit = Infinity;
//     if (heightLimit > 0) {
//       lineCountLimit = Math.max(Math.floor(heightLimit / lineHeight), 1);
//     }
//     if (lineClamp) {
//       // 处理行数限制
//       lineCountLimit = Math.min(lineCountLimit, lineClamp);
//     }

//     if (!autoWrapText) {
//       // 使用所有行中最长的作为lineWidth
//       let lineWidth = 0;
//       for (let i = 0, len = lines.length; i < len; i++) {
//         // 判断是否超过高度限制
//         if (i < lineCountLimit) {
//           // 当前行为最后一行
//           const clip = layoutObj.textMeasure.clipTextWithSuffix(
//             lines[i],
//             layoutObj.textOptions,
//             maxLineWidth,
//             ellipsis
//           );
//           linesLayout.push({
//             str: clip.str,
//             width: clip.width
//           });
//           lineWidth = Math.max(lineWidth, clip.width);
//         }
//       }
//       bboxWH[0] = lineWidth;
//     } else if (typeof maxLineWidth === 'number' && maxLineWidth !== Infinity) {
//       // widthLimit > 0
//       if (maxLineWidth > 0) {
//         for (let i = 0; i < lines.length; i++) {
//           const str = lines[i] as string;
//           // // 测量当前行宽度
//           // width = Math.min(
//           //   layoutObj.textMeasure.measureTextWidth(str, layoutObj.textOptions),
//           //   maxLineWidth
//           // );

//           // 判断是否超过高度限制
//           if (i === lineCountLimit - 1) {
//             // 当前行为最后一行
//             const clip = layoutObj.textMeasure.clipTextWithSuffix(str, layoutObj.textOptions, maxLineWidth, ellipsis);
//             linesLayout.push({
//               str: clip.str,
//               width: clip.width
//             });
//             break; // 不处理后续行
//           }

//           // 测量截断位置
//           const clip = layoutObj.textMeasure.clipText(str, layoutObj.textOptions, maxLineWidth);
//           if (str !== '' && clip.str === '') {
//             // 宽度限制不足一个字符，至少截取一个字符
//             clip.str = str.substring(0, 1);
//             clip.width = textMeasure.measureTextWidth(clip.str, { fontSize, fontFamily, fontWeight });
//           }

//           linesLayout.push({
//             str: clip.str,
//             width: clip.width
//           });
//           if (clip.str.length === str.length) {
//             // 不需要截断
//           } else {
//             const newStr = str.substring(clip.str.length);
//             lines.splice(i + 1, 0, newStr);
//           }
//         }
//       }
//       // bboxWH[0] = maxLineWidth;
//       let maxWidth = 0;
//       linesLayout.forEach(layout => {
//         maxWidth = Math.max(maxWidth, layout.width);
//       });
//       bboxWH[0] = maxWidth;
//     } else {
//       // 使用所有行中最长的作为lineWidth
//       let lineWidth = 0;
//       let width: number;
//       let text: string;
//       for (let i = 0, len = lines.length; i < len; i++) {
//         // 判断是否超过高度限制
//         if (i === lineCountLimit - 1) {
//           // 当前行为最后一行
//           const clip = layoutObj.textMeasure.clipTextWithSuffix(
//             lines[i],
//             layoutObj.textOptions,
//             maxLineWidth,
//             ellipsis
//           );
//           linesLayout.push({
//             str: clip.str,
//             width: clip.width
//           });
//           lineWidth = Math.max(lineWidth, clip.width);
//           break; // 不处理后续行
//         }

//         text = lines[i] as string;
//         width = layoutObj.textMeasure.measureTextWidth(text, layoutObj.textOptions);
//         lineWidth = Math.max(lineWidth, width);
//         linesLayout.push({ str: text, width });
//       }
//       bboxWH[0] = lineWidth;
//     }
//     bboxWH[1] = linesLayout.length * lineHeight;

//     const bbox = {
//       xOffset: 0,
//       yOffset: 0,
//       width: bboxWH[0],
//       height: bboxWH[1]
//     };

//     layoutObj.LayoutBBox(bbox, textAlign, textBaseline as any);

//     const layoutData = layoutObj.layoutWithBBox(bbox, linesLayout, textAlign, textBaseline as any, lineHeight);

//     // const layoutData = layoutObj.GetLayoutByLines(
//     //   text,
//     //   textAlign,
//     //   textBaseline as any,
//     //   lineHeight,
//     //   ellipsis === true ? (DefaultTextAttribute.ellipsis as string) : ellipsis || undefined,
//     //   maxLineWidth
//     // );
//     // const { bbox } = layoutData;
//     this.cache.layoutData = layoutData;
//     this.clearUpdateShapeTag();
//     this._AABBBounds.set(bbox.xOffset, bbox.yOffset, bbox.xOffset + bbox.width, bbox.yOffset + bbox.height);

//     if (stroke) {
//       this._AABBBounds.expand(lineWidth / 2);
//     }

//     return this._AABBBounds;
//   }

//   needUpdateTags(keys: string[]): boolean {
//     for (let i = 0; i < WRAP_TEXT_UPDATE_TAG_KEY.length; i++) {
//       const attrKey = WRAP_TEXT_UPDATE_TAG_KEY[i];
//       if (keys.indexOf(attrKey) !== -1) {
//         return true;
//       }
//     }
//     return super.needUpdateTags(keys);
//   }
//   needUpdateTag(key: string): boolean {
//     for (let i = 0; i < WRAP_TEXT_UPDATE_TAG_KEY.length; i++) {
//       const attrKey = WRAP_TEXT_UPDATE_TAG_KEY[i];
//       if (key === attrKey) {
//         return true;
//       }
//     }
//     return super.needUpdateTag(key);
//   }
// }
