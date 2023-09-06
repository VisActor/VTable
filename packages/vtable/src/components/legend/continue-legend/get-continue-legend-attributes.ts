import { isEmpty, isValid, merge } from '@visactor/vutils';
import type { IColorTableLegendOption, ISizeTableLegendOption } from '../../../ts-types/component/legend';
import { transformComponentStyle, transformLegendTitleAttributes, transformToGraphic } from '../../util/transform';

const defaultContinueLegendSpec = {
  orient: 'right',
  position: 'middle',
  padding: 30,
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: 14,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'titleFontColor' }
    },
    space: 12
  },
  handler: {
    visible: true
  },
  startText: {
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  },
  endText: {
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  },
  handlerText: {
    style: {
      fontSize: 14,
      fontWeight: 'normal',
      fill: { type: 'palette', key: 'labelFontColor' }
    }
  }
};

const defaultColorLegendSpec = {
  horizontal: {
    ...defaultContinueLegendSpec,
    rail: {
      width: 200,
      height: 8,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    }
  },
  vertical: {
    ...defaultContinueLegendSpec,
    rail: {
      width: 8,
      height: 200,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    }
  }
};

const defaultSizeLegendSpec = {
  horizontal: {
    sizeBackground: {
      fill: '#cdcdcd'
    },
    track: {
      style: {
        fill: 'rgba(20,20,20,0.1)'
      }
    },
    rail: {
      width: 200,
      height: 4,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    },
    ...defaultContinueLegendSpec
  },
  vertical: {
    sizeBackground: {
      fill: '#cdcdcd'
    },
    track: {
      style: {
        fill: 'rgba(20,20,20,0.1)'
      }
    },
    rail: {
      width: 4,
      height: 200,
      style: {
        fill: 'rgba(0,0,0,0.04)'
      }
    },
    ...defaultContinueLegendSpec
  }
};

export function getContinuousLegendAttributes(
  spec: IColorTableLegendOption | ISizeTableLegendOption,
  rect: { width: number; height: number }
) {
  const {
    // 需要进行样式转换的属性
    title = {},
    handler = {},
    rail = {},
    track = {},
    startText,
    endText,
    handlerText,
    sizeBackground,
    background = {},

    // 以下不属于 legend 需要的属性，单独拿出来以免污染传递给组件的属性
    type,
    id,
    visible,
    orient,
    position,
    data,
    defaultSelected,
    field,
    filter,
    regionId,
    regionIndex,
    seriesIndex,
    seriesId,
    padding, // vchart 布局模块已经处理了

    ...restSpec
  } = merge(
    {},
    (spec.type === 'color' ? defaultColorLegendSpec : defaultSizeLegendSpec)[
      spec.orient === 'bottom' || spec.orient === 'top' ? 'horizontal' : 'vertical'
    ],
    spec
  );

  const attrs = restSpec;

  // transform title
  if (title.visible) {
    attrs.title = transformLegendTitleAttributes(title);
  }

  // handlerStyle
  attrs.showHandler = handler.visible !== false;
  if (!isEmpty(handler.style)) {
    attrs.handlerStyle = transformToGraphic(handler.style);
  }
  if (isValid(rail.width)) {
    attrs.railWidth = rail.width;
  }
  if (isValid(rail.height)) {
    attrs.railHeight = rail.height;
  }
  if (!isEmpty(rail.style)) {
    attrs.railStyle = transformToGraphic(rail.style);
  }
  if (!isEmpty(track.style)) {
    attrs.trackStyle = transformToGraphic(track.style);
  }

  attrs.startText = transformComponentStyle(startText);
  attrs.endText = transformComponentStyle(endText);
  attrs.handlerText = transformComponentStyle(handlerText);

  if (!isEmpty(sizeBackground)) {
    attrs.sizeBackground = transformToGraphic(sizeBackground);
  }

  if (background.visible && !isEmpty(background.style)) {
    merge(attrs, background.style);
    if (isValid(background.padding)) {
      attrs.padding = background.padding;
    }
  }

  return attrs;
}
