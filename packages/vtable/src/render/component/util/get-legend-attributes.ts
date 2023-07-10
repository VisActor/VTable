import { degreeToRadian, isEmpty, isValid, merge } from '@visactor/vutils';
import type { ITableLegendOption } from '../../../ts-types/component/legend';
import { isPercent } from '../../../tools/calc';
import { ITitle } from '@visactor/vchart/esm/component';

export function getLegendAttributes(spec: ITableLegendOption, rect: { width: number; height: number }) {
  const {
    // 需要进行样式转换的属性
    title = {},
    item = {},
    pager = {},
    background = {},

    // 以下不属于 legend 需要的属性，单独拿出来以免污染传递给组件的属性
    type,
    id,
    visible,
    orient,
    position,
    data,
    filter,
    regionId,
    regionIndex,
    seriesIndex,
    seriesId,
    padding, // vchart 布局模块已经处理了

    ...restSpec
  } = merge({}, spec);

  const attrs: any = restSpec;

  // transform title
  if (title.visible) {
    attrs.title = transformLegendTitleAttributes(title);
  }

  // transform item
  if (!isEmpty(item.focusIconStyle)) {
    transformToGraphic(item.focusIconStyle);
  }
  transformComponentStyle(item.shape);
  transformComponentStyle(item.label);
  transformComponentStyle(item.value);
  transformComponentStyle(item.background);

  if (isPercent(item.maxWidth)) {
    item.maxWidth = (Number(item.maxWidth.substring(0, item.maxWidth.length - 1)) * rect.width) / 100;
  }
  if (isPercent(item.width)) {
    item.width = (Number(item.width.substring(0, item.width.length - 1)) * rect.width) / 100;
  }
  if (isPercent(item.height)) {
    item.height = (Number(item.height.substring(0, item.height.length - 1)) * rect.width) / 100;
  }
  attrs.item = item;

  // transform pager
  if (!isEmpty(pager.textStyle)) {
    transformToGraphic(pager.textStyle);
  }
  transformComponentStyle(pager.handler);
  attrs.pager = pager;

  if (background.visible && !isEmpty(background.style)) {
    merge(attrs, background.style);
    if (isValid(background.padding)) {
      attrs.padding = background.padding;
    }
  }

  return attrs;
}

function transformLegendTitleAttributes(title: any) {
  const transformedTitle = {
    ...title
  };
  if (!isEmpty(title.style)) {
    transformedTitle.textStyle = transformToGraphic(title.style);
  }
  if (!isEmpty(title.textStyle)) {
    merge(transformedTitle.textStyle, transformToGraphic(title.textStyle));
  }

  if (title.shape?.style) {
    transformToGraphic(transformedTitle.shape.style);
  }

  if (title.background?.style) {
    transformToGraphic(transformedTitle.background.style);
  }
  return transformedTitle;
}

function transformToGraphic(style: any) {
  if (isEmpty(style)) {
    return style;
  }
  if (style.angle) {
    style.angle = degreeToRadian(style.angle);
  }

  return style;
}

function transformComponentStyle(cfg: any = {}) {
  if (!isEmpty(cfg.style)) {
    cfg.style = transformToGraphic(cfg.style);
  }

  if (!isEmpty(cfg.state)) {
    Object.keys(cfg.state).forEach(key => {
      if (!isEmpty(cfg.state[key])) {
        cfg.state[key] = transformToGraphic(cfg.state[key]);
      }
    });
  }

  return cfg;
}
