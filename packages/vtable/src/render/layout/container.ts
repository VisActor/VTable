import { isArray } from '@visactor/vutils';
import type { IGroupGraphicAttribute } from '@src/vrender';
import { Group } from '@src/vrender';
import type { percentCalcObj } from './percent-calc';

export type IContainerOptions = {
  width?: number | percentCalcObj;
  height?: number | percentCalcObj;
  marginTop?: number;
  marginRight?: number;
  marginBottom?: number;
  marginLeft?: number;
} & IGroupGraphicAttribute;

export class Container extends Group {
  constructor(containerOptions: IContainerOptions) {
    if ((containerOptions as any).direction) {
      containerOptions.flexDirection = (containerOptions as any).direction;
    }
    if (
      containerOptions.justifyContent &&
      ((containerOptions.justifyContent as any) === 'start' || (containerOptions.justifyContent as any) === 'end')
    ) {
      containerOptions.justifyContent = ('flex-' + containerOptions.justifyContent) as any;
    }

    if (
      containerOptions.alignItems &&
      ((containerOptions.alignItems as any) === 'start' || (containerOptions.alignItems as any) === 'end')
    ) {
      containerOptions.alignItems = ('flex-' + containerOptions.alignItems) as any;
    }

    if (
      containerOptions.alignContent &&
      ((containerOptions.alignContent as any) === 'start' || (containerOptions.alignContent as any) === 'end')
    ) {
      containerOptions.alignContent = ('flex-' + containerOptions.alignContent) as any;
    }
    containerOptions.display = 'flex';
    if (!containerOptions.flexDirection) {
      containerOptions.flexDirection = 'row';
    }

    containerOptions.clip = true;
    containerOptions.fill = (containerOptions?.background as any)?.fill;
    containerOptions.stroke = (containerOptions?.background as any)?.stroke;
    containerOptions.lineWidth = (containerOptions?.background as any)?.lineWidth;
    containerOptions.cornerRadius = (containerOptions?.background as any)?.cornerRadius;
    // containerOptions.flexWrap = 'nowrap';

    const isPaddingNumber = isArray(containerOptions.boundsPadding);
    const padding = [
      containerOptions.marginTop ??
        (isPaddingNumber ? containerOptions.boundsPadding[0] : containerOptions.boundsPadding) ??
        0,
      containerOptions.marginRight ??
        (isPaddingNumber ? containerOptions.boundsPadding[1] : containerOptions.boundsPadding) ??
        0,
      containerOptions.marginBottom ??
        (isPaddingNumber
          ? containerOptions.boundsPadding[2] ?? containerOptions.boundsPadding[0]
          : containerOptions.boundsPadding) ??
        0,
      containerOptions.marginLeft ??
        (isPaddingNumber
          ? containerOptions.boundsPadding[3] ?? containerOptions.boundsPadding[1]
          : containerOptions.boundsPadding) ??
        0
    ];
    containerOptions.boundsPadding = padding;

    super(containerOptions);
  }
}
