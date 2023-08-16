import { degreeToRadian, isEmpty, merge } from '@visactor/vutils';

export function transformLegendTitleAttributes(title: any) {
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

export function transformToGraphic(style: any) {
  if (isEmpty(style)) {
    return style;
  }
  if (style.angle) {
    style.angle = degreeToRadian(style.angle);
  }

  return style;
}

export function transformComponentStyle(cfg: any = {}) {
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

export function transformStateStyle(stateStyle: any) {
  if (isEmpty(stateStyle)) {
    return null;
  }
  Object.keys(stateStyle).forEach(key => {
    if (!isEmpty(stateStyle[key])) {
      stateStyle[key] = transformToGraphic(stateStyle[key]);
    }
  });

  return stateStyle;
}

export function transformAxisLineStyle(lineCfg: any) {
  transformComponentStyle(lineCfg);
  transformComponentStyle(lineCfg.startSymbol);
  transformComponentStyle(lineCfg.endSymbol);

  return lineCfg;
}
