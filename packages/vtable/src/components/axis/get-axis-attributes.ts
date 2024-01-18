import { degreeToRadian, isNil, merge, pickWithout } from '@visactor/vutils';
import { transformAxisLineStyle, transformStateStyle, transformToGraphic } from '../util/transform';
import type { ICellAxisOption } from '../../ts-types/component/axis';

const DEFAULT_TITLE_STYLE = {
  left: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  right: {
    textAlign: 'center',
    textBaseline: 'bottom'
  },
  radius: {},
  angle: {}
};

export const DEFAULT_TEXT_FONT_FAMILY =
  // eslint-disable-next-line max-len
  'PingFang SC,Microsoft Yahei,system-ui,-apple-system,segoe ui,Roboto,Helvetica,Arial,sans-serif, apple color emoji,segoe ui emoji,segoe ui symbol';

export const DEFAULT_TEXT_FONT_SIZE = 14;

export const THEME_CONSTANTS = {
  FONT_FAMILY: DEFAULT_TEXT_FONT_FAMILY,
  LABEL_FONT_SIZE: DEFAULT_TEXT_FONT_SIZE,
  MAP_LABEL_FONT_SIZE: 10,
  TITLE_FONT_SIZE: 18,
  AXIS_TICK_SIZE: 4
};

export const commonAxis = {
  domainLine: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#D9DDE4',
      strokeOpacity: 1
    }
  },
  grid: {
    visible: true,
    style: {
      lineWidth: 1,
      stroke: '#EBEDF2',
      strokeOpacity: 1,
      lineDash: [] as any[]
    }
  },
  subGrid: {
    visible: false,
    style: {
      lineWidth: 1,
      stroke: '#EBEDF2',
      strokeOpacity: 1,
      lineDash: [4, 4]
    }
  },
  tick: {
    visible: true,
    tickSize: THEME_CONSTANTS.AXIS_TICK_SIZE,
    style: {
      lineWidth: 1,
      stroke: '#D9DDE4',
      strokeOpacity: 1
    }
  },
  subTick: {
    visible: false,
    tickSize: THEME_CONSTANTS.AXIS_TICK_SIZE / 2,
    style: {
      lineWidth: 1,
      stroke: '#D9DDE4',
      strokeOpacity: 1
    }
  },
  label: {
    visible: true,
    space: 1, // hack: VChart中为0，为了方便fs调试暂时改为1
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      fill: '#89909D',
      fontWeight: 'normal',
      fillOpacity: 1
    },
    autoLimit: true
  },
  title: {
    space: 10,
    style: {
      fontSize: THEME_CONSTANTS.LABEL_FONT_SIZE,
      fill: '#333333',
      fontWeight: 'normal',
      fillOpacity: 1
    }
  }
};

export function getCommonAxis(theme: any) {
  if (!theme?.colorScheme?.default?.palette) {
    return commonAxis;
  }
  return merge({}, commonAxis, {
    tick: {
      style: {
        stroke: theme.colorScheme.default.palette.axisDomainColor || '#D9DDE4'
      }
    },
    subTick: {
      style: {
        stroke: theme.colorScheme.default.palette.axisDomainColor || '#D9DDE4'
      }
    },
    label: {
      style: {
        fill: theme.colorScheme.default.palette.axisLabelFontColor || '#89909D'
      }
    },
    title: {
      style: {
        fill: theme.colorScheme.default.palette.secondaryFontColor || '#333333'
      }
    }
  });
}

export function getAxisAttributes(option: ICellAxisOption) {
  const spec = merge({}, option);
  // const spec = option;
  let titleAngle = spec.title?.angle ?? 0;
  let titleTextStyle;
  if (spec.orient === 'left' || spec.orient === 'right') {
    // 处理纵轴的标题样式
    if (spec.title?.autoRotate && isNil(spec.title.angle)) {
      titleAngle = spec.orient === 'left' ? -90 : 90;
      titleTextStyle = DEFAULT_TITLE_STYLE[spec.orient];
    }
  }

  const labelSpec = pickWithout(spec.label, ['style', 'formatMethod', 'state']);

  return {
    orient: spec.orient,
    select: spec.select,
    hover: spec.hover,
    line: transformAxisLineStyle(spec.domainLine),
    label: {
      style:
        // isFunction(spec.label.style)
        //   ? (datum: Datum, index: number) => {
        //       const style = this._preprocessSpec(spec.label.style(datum.rawValue, index, datum));

        //       return transformToGraphic(this._preprocessSpec(merge({}, this._theme.label?.style, style)));
        //     }
        //   :
        transformToGraphic(spec.label.style),
      formatMethod: spec.label.formatMethod
        ? (value: any, datum: any, index: number) => {
            return spec.label.formatMethod(datum.rawValue, datum);
          }
        : null,
      state: transformStateStyle(spec.label.state),
      ...labelSpec
    },
    tick: {
      visible: spec.tick.visible,
      length: spec.tick.tickSize,
      inside: spec.tick.inside,
      alignWithLabel: spec.tick.alignWithLabel,
      style:
        // isFunction(spec.tick.style)
        //   ? (datum: Datum, index: number) => {
        //       const style = this._preprocessSpec(spec.tick.style(datum.rawValue, index, datum));

        //       return transformToGraphic(this._preprocessSpec(merge({}, this._theme.tick?.style, style)));
        //     }
        //   :
        transformToGraphic(spec.tick.style),
      state: transformStateStyle(spec.tick.state),
      dataFilter: spec.tick.dataFilter
    },
    subTick: {
      visible: spec.subTick.visible,
      length: spec.subTick.tickSize,
      inside: spec.subTick.inside,
      count: spec.subTick.tickCount,
      style: transformToGraphic(spec.subTick.style),
      state: transformStateStyle(spec.subTick.state)
    },
    grid: {
      type: 'line',
      visible: spec.grid.visible,
      alternateColor: spec.grid.alternateColor,
      alignWithLabel: spec.grid.alignWithLabel,
      style:
        // isFunction(spec.grid.style)
        //   ? (datum: Datum, index: number) => {
        //       const style = spec.grid.style(datum.datum?.rawValue, index, datum.datum);

        //       return transformToGraphic(this._preprocessSpec(merge({}, this._theme.grid?.style, style)));
        //     }
        //   :
        transformToGraphic(spec.grid.style)
    },
    subGrid: {
      type: 'line',
      visible: spec.subGrid.visible,
      alternateColor: spec.subGrid.alternateColor,
      style: transformToGraphic(spec.subGrid.style)
    },
    title: {
      visible: spec.title.visible,
      position: spec.title.position,
      space: spec.title.space,
      autoRotate: false, // 默认不对外提供该配置
      angle: titleAngle ? degreeToRadian(titleAngle) : null,
      textStyle: merge({}, titleTextStyle, transformToGraphic(spec.title.style)),
      padding: spec.title.padding,
      shape: {
        visible: spec.title.shape?.visible,
        space: spec.title.shape?.space,
        style: transformToGraphic(spec.title.shape?.style)
      },
      background: {
        visible: spec.title.background?.visible,
        style: transformToGraphic(spec.title.background?.style)
      },
      state: {
        text: transformStateStyle(spec.title.state),
        shape: transformStateStyle(spec.title.shape?.state),
        background: transformStateStyle(spec.title.background?.state)
      }
    },
    panel: {
      visible: spec.background?.visible,
      style: transformToGraphic(spec.background?.style),
      state: transformStateStyle(spec.background?.state)
    }
  };
}
