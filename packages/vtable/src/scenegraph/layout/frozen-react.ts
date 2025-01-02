import type { IGraphic, ReactAttributePlugin } from '@src/vrender';
import { getTargetCell } from '../../event/util';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { Scenegraph } from '../scenegraph';

export function createReactContainer(table: BaseTableAPI) {
  const { internalProps } = table;
  internalProps.bodyDomContainer = document.createElement('div');
  internalProps.bodyDomContainer.id = 'vtable-body-dom-container';
  internalProps.bodyDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.bodyDomContainer);

  internalProps.headerDomContainer = document.createElement('div');
  internalProps.headerDomContainer.id = 'vtable-header-dom-container';
  internalProps.headerDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.headerDomContainer);

  internalProps.frozenBodyDomContainer = document.createElement('div');
  internalProps.frozenBodyDomContainer.id = 'vtable-frozen-body-dom-container';
  internalProps.frozenBodyDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.frozenBodyDomContainer);

  internalProps.frozenHeaderDomContainer = document.createElement('div');
  internalProps.frozenHeaderDomContainer.id = 'vtable-frozen-header-dom-container';
  internalProps.frozenHeaderDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.frozenHeaderDomContainer);

  internalProps.rightFrozenBodyDomContainer = document.createElement('div');
  internalProps.rightFrozenBodyDomContainer.id = 'vtable-right-frozen-body-dom-container';
  internalProps.rightFrozenBodyDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.rightFrozenBodyDomContainer);

  internalProps.rightFrozenHeaderDomContainer = document.createElement('div');
  internalProps.rightFrozenHeaderDomContainer.id = 'vtable-right-frozen-header-dom-container';
  internalProps.rightFrozenHeaderDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.rightFrozenHeaderDomContainer);

  internalProps.frozenBottomDomContainer = document.createElement('div');
  internalProps.frozenBottomDomContainer.id = 'vtable-frozen-bottom-dom-container';
  internalProps.frozenBottomDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.frozenBottomDomContainer);

  internalProps.bottomDomContainer = document.createElement('div');
  internalProps.bottomDomContainer.id = 'vtable-bottom-dom-container';
  internalProps.bottomDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.bottomDomContainer);

  internalProps.rightFrozenBottomDomContainer = document.createElement('div');
  internalProps.rightFrozenBottomDomContainer.id = 'vtable-right-frozen-bottom-dom-container';
  internalProps.rightFrozenBottomDomContainer.classList.add('table-component-container');
  internalProps.element.appendChild(internalProps.rightFrozenBottomDomContainer);
}

export function updateReactContainer(table: BaseTableAPI) {
  const {
    headerDomContainer,
    bodyDomContainer,
    frozenBodyDomContainer,
    frozenHeaderDomContainer,
    rightFrozenBodyDomContainer,
    rightFrozenHeaderDomContainer,
    bottomDomContainer,
    frozenBottomDomContainer,
    rightFrozenBottomDomContainer
  } = table.internalProps;
  if (
    !headerDomContainer &&
    !bodyDomContainer &&
    !frozenBodyDomContainer &&
    !frozenHeaderDomContainer &&
    !rightFrozenBodyDomContainer &&
    !rightFrozenHeaderDomContainer &&
    !bottomDomContainer &&
    !frozenBottomDomContainer &&
    !rightFrozenBottomDomContainer
  ) {
    return;
  }
  const allColsWidth = table.getAllColsWidth();
  const tableNoFrameWidth = Math.min(allColsWidth, table.tableNoFrameWidth);
  const frozenColsWidth = table.getFrozenColsWidth();
  const rightFrozenColsWidth = table.getRightFrozenColsWidth();
  const totalFrozenColsWidth = frozenColsWidth + rightFrozenColsWidth;
  const bodyWidth = Math.min(allColsWidth - totalFrozenColsWidth, tableNoFrameWidth - totalFrozenColsWidth);

  const allRowsHeight = table.getAllRowsHeight();
  const tableNoFrameHeight = Math.min(allRowsHeight, table.tableNoFrameHeight);
  const frozenRowsHeight = table.getFrozenRowsHeight();
  const bottomFrozenRowsHeight = table.getBottomFrozenRowsHeight();
  const totalFrozenRowsHeight = frozenRowsHeight + bottomFrozenRowsHeight;
  const bodyHeight = Math.min(allRowsHeight - totalFrozenRowsHeight, tableNoFrameHeight - totalFrozenRowsHeight);

  if (table.frozenColCount > 0) {
    headerDomContainer.style.left = `${table.tableX + frozenColsWidth}px`;
    bodyDomContainer.style.left = `${table.tableX + frozenColsWidth}px`;
    bottomDomContainer.style.left = `${table.tableX + frozenColsWidth}px`;
  } else if (table.frozenColCount === 0) {
    headerDomContainer.style.left = `${table.tableX}px`;
    bodyDomContainer.style.left = `${table.tableX}px`;
    bottomDomContainer.style.left = `${table.tableX}px`;
  }
  frozenBodyDomContainer.style.left = `${table.tableX}px`;
  frozenHeaderDomContainer.style.left = `${table.tableX}px`;

  // headerDomContainer.style.width = `${(headerDomContainer.parentElement?.offsetWidth ?? 1) - 1}px`;
  headerDomContainer.style.width = `${bodyWidth}px`;
  headerDomContainer.style.height = `${frozenRowsHeight}px`;
  bodyDomContainer.style.top = `${table.tableY}px`;

  // bodyDomContainer.style.width = `${(bodyDomContainer.parentElement?.offsetWidth ?? 1) - 1}px`;
  bodyDomContainer.style.width = `${bodyWidth}px`;
  bodyDomContainer.style.height = `${bodyHeight}px`;
  bodyDomContainer.style.top = `${table.tableY + frozenRowsHeight}px`;

  frozenBodyDomContainer.style.width = `${frozenColsWidth}px`;
  frozenBodyDomContainer.style.height = `${bodyHeight}px`;
  frozenBodyDomContainer.style.top = `${table.tableY + frozenRowsHeight}px`;

  frozenHeaderDomContainer.style.width = `${frozenColsWidth}px`;
  frozenHeaderDomContainer.style.height = `${frozenRowsHeight}px`;
  frozenHeaderDomContainer.style.top = `${table.tableY}px`;

  rightFrozenBodyDomContainer.style.width = `${rightFrozenColsWidth}px`;
  rightFrozenBodyDomContainer.style.height = `${bodyHeight}px`;
  rightFrozenBodyDomContainer.style.top = `${table.tableY + frozenRowsHeight}px`;
  rightFrozenBodyDomContainer.style.left = `${table.tableX + tableNoFrameWidth - rightFrozenColsWidth}px`;

  rightFrozenHeaderDomContainer.style.width = `${rightFrozenColsWidth}px`;
  rightFrozenHeaderDomContainer.style.height = `${frozenRowsHeight}px`;
  rightFrozenHeaderDomContainer.style.top = `${table.tableY}px`;
  rightFrozenHeaderDomContainer.style.left = `${table.tableX + tableNoFrameWidth - rightFrozenColsWidth}px`;

  bottomDomContainer.style.width = `${bodyWidth}px`;
  bottomDomContainer.style.height = `${bottomFrozenRowsHeight}px`;
  bottomDomContainer.style.top = `${table.tableY + tableNoFrameHeight - bottomFrozenRowsHeight}px`;

  frozenBottomDomContainer.style.width = `${frozenColsWidth}px`;
  frozenBottomDomContainer.style.height = `${bottomFrozenRowsHeight}px`;
  frozenBottomDomContainer.style.top = `${table.tableY + tableNoFrameHeight - bottomFrozenRowsHeight}px`;

  rightFrozenBottomDomContainer.style.width = `${rightFrozenColsWidth}px`;
  rightFrozenBottomDomContainer.style.height = `${bottomFrozenRowsHeight}px`;
  rightFrozenBottomDomContainer.style.top = `${table.tableY + tableNoFrameHeight - bottomFrozenRowsHeight}px`;
  rightFrozenBottomDomContainer.style.left = `${table.tableX + tableNoFrameWidth - rightFrozenColsWidth}px`;
}

export function updateReactComponentContainer(scene: Scenegraph) {
  if (!scene.table.reactCustomLayout) {
    return;
  }
  const { table, stage } = scene;
  const plugin = stage.pluginService.findPluginsByName('ReactAttributePlugin')[0] as ReactAttributePlugin;
  const { htmlMap, renderId: stageRenderId } = plugin;

  for (const key in htmlMap) {
    const item = htmlMap[key];
    const { graphic, wrapContainer, renderId } = item as typeof item & { graphic: IGraphic };
    if (renderId !== stageRenderId) {
      continue;
    }
    let targetContainer: HTMLElement;
    if (scene.frozenColCount > table.frozenColCount) {
      // move columnGroup from rowHeaderGroup into bodyGroup(from cornerHeaderGroup into colHeaderGroup)
      const targetCell = getTargetCell(graphic);
      if (!targetCell) {
        continue;
      }
      const { col, row } = targetCell;
      if (
        row >= table.rowCount - table.bottomFrozenRowCount &&
        col < scene.frozenColCount &&
        col >= table.frozenColCount &&
        graphic.attribute.react.container === table.frozenBottomDomContainer
      ) {
        targetContainer = table.bottomDomContainer;
      } else if (
        row >= table.frozenRowCount &&
        col < scene.frozenColCount &&
        col >= table.frozenColCount &&
        graphic.attribute.react.container === table.frozenBodyDomContainer
      ) {
        targetContainer = table.bodyDomContainer;
      } else if (
        row < table.frozenRowCount &&
        col < scene.frozenColCount &&
        col >= table.frozenColCount &&
        graphic.attribute.react.container === table.frozenHeaderDomContainer
      ) {
        targetContainer = table.headerDomContainer;
      }
    } else if (scene.frozenColCount < table.frozenColCount) {
      // move columnGroup from bodyGroup into rowHeaderGroup(from colHeaderGroup into cornerHeaderGroup)
      const targetCell = getTargetCell(graphic);
      if (!targetCell) {
        continue;
      }
      const { col, row } = targetCell;
      if (
        row >= table.rowCount - table.bottomFrozenRowCount &&
        col < table.frozenColCount &&
        col >= scene.frozenColCount &&
        graphic.attribute.react.container === table.bottomDomContainer
      ) {
        targetContainer = table.frozenBottomDomContainer;
      } else if (
        row >= table.frozenRowCount &&
        col < table.frozenColCount &&
        col >= scene.frozenColCount &&
        graphic.attribute.react.container === table.bodyDomContainer
      ) {
        targetContainer = table.frozenBodyDomContainer;
      } else if (
        row < table.frozenRowCount &&
        col < table.frozenColCount &&
        col >= scene.frozenColCount &&
        graphic.attribute.react.container === table.headerDomContainer
      ) {
        targetContainer = table.frozenHeaderDomContainer;
      }
    }

    if (targetContainer) {
      targetContainer.appendChild(wrapContainer);
      item.nativeContainer = targetContainer;
      item.container = targetContainer;
      graphic.attribute.react.container = targetContainer;
      plugin.updateStyleOfWrapContainer(graphic, stage, wrapContainer, targetContainer, graphic.attribute.react);
    }
  }
}
