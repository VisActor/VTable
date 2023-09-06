import { isEmpty, isValid, merge } from '@visactor/vutils';
import type { IDiscreteTableLegendOption } from '../../../ts-types/component/legend';
import { isPercent } from '../../../tools/calc';
import { transformComponentStyle, transformLegendTitleAttributes, transformToGraphic } from '../../util/transform';

const defaultLegendSpec = {
  orient: 'bottom',
  position: 'middle',
  padding: 30,
  title: {
    visible: false,
    padding: 0,
    textStyle: {
      fontSize: 14,
      fill: '#000000',
      fontWeight: 'normal'
    },
    space: 12
  },
  item: {
    visible: true,
    spaceCol: 10,
    spaceRow: 10,
    padding: 2,
    background: {
      state: {
        selectedHover: {
          fill: 'gray',
          fillOpacity: 0.7
        },
        unSelectedHover: {
          fill: 'gray',
          fillOpacity: 0.2
        }
      }
    },
    shape: {
      space: 4,
      state: {
        unSelected: {
          fillOpacity: 0.5
        }
      }
    },
    label: {
      space: 4,
      style: {
        fill: '#89909D',
        fontSize: 14
      },
      state: {
        unSelected: {
          fillOpacity: 0.5
        }
      }
    }
  },
  allowAllCanceled: true,
  visible: true
};

export function getLegendAttributes(spec: IDiscreteTableLegendOption, rect: { width: number; height: number }) {
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
  } = merge({}, defaultLegendSpec, spec);

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
