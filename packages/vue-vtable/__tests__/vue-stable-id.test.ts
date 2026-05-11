/* eslint-env jest */
/* eslint-disable no-undef */
// @ts-nocheck
/**
 * 测试 Vue DOM 组件稳定 ID 注入
 * 对应 issue: https://github.com/VisActor/VTable/issues/5038
 *
 * 验证 createCustomLayout 在处理带 vue 属性的 Group 时：
 * 1. 自动注入 cell_col_row_index 格式的稳定 ID
 * 2. 多次调用（模拟场景图重建）产生相同 ID
 * 3. 用户自定义 ID 不被覆盖
 * 4. 同一 cell 内多个 vue Group 的 ID 唯一
 */

import { createCustomLayout } from '../src/utils/customLayoutUtils';

// Mock VTable CustomLayout 组件
jest.mock('@visactor/vtable', () => {
  class MockGroup {
    attribute: any;
    children: any[] = [];
    constructor(attrs: any) {
      this.attribute = attrs;
    }
    add(child: any) {
      this.children.push(child);
    }
    addEventListener() {}
  }
  return {
    CustomLayout: {
      Group: MockGroup,
      Image: MockGroup,
      Text: MockGroup,
      Tag: MockGroup,
      Radio: MockGroup,
      CheckBox: MockGroup
    }
  };
});

// Mock vue 的 isVNode / cloneVNode
jest.mock('vue', () => ({
  isVNode: (val: any) => val && val.__v_isVNode === true,
  cloneVNode: (vnode: any, extra: any) => ({ ...vnode, ...extra })
}));

function makeGroupChild(vueProps: any = {}, typeName = 'Group') {
  return {
    type: { name: typeName },
    props: {
      width: 200,
      height: 40,
      vue: { ...vueProps }
    },
    children: null
  };
}

function makeArgs(col: number, row: number) {
  return {
    col,
    row,
    table: {
      headerDomContainer: document.createElement('div'),
      bodyDomContainer: document.createElement('div')
    }
  };
}

describe('Vue 稳定 ID 注入', () => {
  test('应为 vue Group 注入 cell_col_row_index 格式的稳定 ID', () => {
    const child = makeGroupChild({});
    const args = makeArgs(3, 5);

    createCustomLayout(child, false, args);

    expect(child.props.vue.id).toBe('cell_3_5_0');
  });

  test('多次调用应产生相同的 ID（模拟场景图重建）', () => {
    const args = makeArgs(2, 7);

    const child1 = makeGroupChild({});
    createCustomLayout(child1, false, args);

    const child2 = makeGroupChild({});
    createCustomLayout(child2, false, args);

    expect(child1.props.vue.id).toBe(child2.props.vue.id);
    expect(child1.props.vue.id).toBe('cell_2_7_0');
  });

  test('用户指定的 id 不应被覆盖', () => {
    const child = makeGroupChild({ id: 'my-custom-id' });
    const args = makeArgs(1, 1);

    createCustomLayout(child, false, args);

    expect(child.props.vue.id).toBe('my-custom-id');
  });

  test('同一 cell 内多个 vue Group 应有不同的稳定 ID', () => {
    // 构造一个包含两个 vue Group 子节点的父 Group
    const vueChild1 = makeGroupChild({});
    const vueChild2 = makeGroupChild({});

    const parentChild = {
      type: { name: 'Group' },
      props: { width: 400, height: 80 },
      children: {
        default: () => [vueChild1, vueChild2]
      }
    };

    const args = makeArgs(4, 10);
    createCustomLayout(parentChild, false, args);

    // 两个子节点都应被注入稳定 ID
    expect(vueChild1.props.vue.id).toBe('cell_4_10_0');
    expect(vueChild2.props.vue.id).toBe('cell_4_10_1');
  });

  test('isHeader=true 时应使用 headerDomContainer', () => {
    const args = makeArgs(0, 0);
    const child = makeGroupChild({});

    createCustomLayout(child, true, args);

    expect(child.props.vue.container).toBe(args.table.headerDomContainer);
    expect(child.props.vue.id).toBe('cell_0_0_0');
  });

  test('isHeader=false 时应使用 bodyDomContainer', () => {
    const args = makeArgs(1, 3);
    const child = makeGroupChild({});

    createCustomLayout(child, false, args);

    expect(child.props.vue.container).toBe(args.table.bodyDomContainer);
  });
});

describe('VTableVueAttributePlugin 缓存命中同步渲染', () => {
  test('renderGraphicHTML 缓存命中时应同步调用 doRenderGraphic', () => {
    // 直接引入插件类进行行为验证
    const { VTableVueAttributePlugin } = require('../src/components/custom/vtable-vue-attribute-plugin');

    const plugin = new VTableVueAttributePlugin();
    plugin.htmlMap = {};
    plugin.renderId = 1;

    const mockWrapContainer = document.createElement('div');
    document.body.appendChild(mockWrapContainer);

    const stableId = 'vue_cell_3_5_0';

    // 预填充缓存条目
    plugin.htmlMap[stableId] = {
      wrapContainer: mockWrapContainer,
      nativeContainer: document.body,
      container: document.body,
      renderId: 0,
      graphic: null,
      isInViewport: true,
      lastPosition: null,
      lastStyle: {}
    };

    // 追踪 doRenderGraphic 是否被同步调用
    let doRenderCalled = false;
    const originalDoRender = plugin.doRenderGraphic;
    plugin.doRenderGraphic = function (graphic: any) {
      doRenderCalled = true;
    };

    const mockGraphic = {
      attribute: {
        vue: {
          id: 'cell_3_5_0',
          element: { __v_isVNode: true },
          container: document.body
        }
      },
      stage: {
        window: { getContainer: () => document.body },
        AABBBounds: { x1: 0, x2: 100, y1: 0, y2: 100 }
      },
      globalAABBBounds: { x1: 10, x2: 50, y1: 10, y2: 50 },
      id: null,
      _uid: 999
    };

    plugin.renderGraphicHTML(mockGraphic);

    // 缓存命中 → 同步调用 doRenderGraphic，不走 rAF
    expect(doRenderCalled).toBe(true);
    expect(plugin.renderQueue.size).toBe(0);

    document.body.removeChild(mockWrapContainer);
  });

  test('renderGraphicHTML 无缓存时应走异步队列', () => {
    const { VTableVueAttributePlugin } = require('../src/components/custom/vtable-vue-attribute-plugin');

    const plugin = new VTableVueAttributePlugin();
    plugin.htmlMap = {};
    plugin.renderId = 1;

    // mock scheduleRender 避免 vglobal 在 jsdom 中不可用
    const originalSchedule = plugin.scheduleRender;
    plugin.scheduleRender = jest.fn();

    const mockGraphic = {
      attribute: {
        vue: {
          id: 'cell_0_0_0',
          element: { __v_isVNode: true },
          container: document.body
        }
      },
      stage: {
        window: { getContainer: () => document.body },
        AABBBounds: { x1: 0, x2: 100, y1: 0, y2: 100 }
      },
      globalAABBBounds: { x1: 10, x2: 50, y1: 10, y2: 50 },
      id: null,
      _uid: 123
    };

    plugin.renderGraphicHTML(mockGraphic);

    // 无缓存 → 加入异步队列并调用 scheduleRender
    expect(plugin.renderQueue.size).toBe(1);
    expect(plugin.scheduleRender).toHaveBeenCalled();
  });
});
