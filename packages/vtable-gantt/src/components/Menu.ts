// import { createElement } from '../tools/dom';
// import { importStyle } from './MenuElementStyle';
// importStyle();

// const CLASSNAME = 'vtable__menu-element';
// const ITEM_CLASSNAME = `${CLASSNAME}__item`;
// const CONTENT_CLASSNAME = `${CLASSNAME}__content`;
// const HIDDEN_CLASSNAME = `${CLASSNAME}--hidden`;
// const SHOWN_CLASSNAME = `${CLASSNAME}--shown`;
// const NORAML_CLASSNAME = `${CLASSNAME}--normal`;
// const SELECT_CLASSNAME = `${CLASSNAME}--select`;
// const ICOM_CLASSNAME = `${CLASSNAME}__icon`;
// const SPLIT_CLASSNAME = `${CLASSNAME}__split`;
// const TITLE_CLASSNAME = `${CLASSNAME}__title`;
// const ARROW_CLASSNAME = `${CLASSNAME}__arrow`;
// const NOEVENT_CLASSNAME = `${CLASSNAME}__no-event`;
// const ITEMTEXT_CLASSNAME = `${CLASSNAME}__item-text`;
// function createMenuDomElement(): HTMLElement {
//   const rootElement = createElement('div', [CLASSNAME, HIDDEN_CLASSNAME]);
//   return rootElement;
// }
// export class MenuElement {
//   private _handler: EventHandler;
//   private _rootElement?: HTMLElement;
//   private _secondElement?: HTMLElement;
//   private _menuInstanceInfo?: MenuInstanceInfo;
//   private _showChildrenIndex: number;
//   private _mouseEnterSecondElement: boolean;
//   constructor(table: BaseTableAPI) {
//     this._handler = new EventHandler();
//     this._rootElement = createMenuDomElement();
//     this._secondElement = createMenuDomElement();
//     (this._secondElement as any).sub = true;
//     this._showChildrenIndex = -1;

//     // 鼠标在菜单上滚动阻止冒泡
//     this._rootElement.addEventListener('wheel', e => {
//       e.stopPropagation();
//     });
//     // 绑定交互事件
//     this._rootElement?.addEventListener('mousedown', e => {
//       e.stopPropagation();
//       e.preventDefault();
//     });
//     // 在移动端_rootElement的click事件在表格的touchend事件后触发，
//     // 表格的touchend事件会引发selecter.start，从而清空菜单
//     // 这样就会导致_rootElement的click事件无法触发
//     // 因此菜_rootElement监听touchend事件，在表格的touchend事件前触发
//     // 执行菜单点击功能
//     this._rootElement?.addEventListener('touchend', e => {
//       e.stopPropagation();
//       e.preventDefault();
//       if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
//         return;
//       }
//       // console.log('menu mousedown', e);
//       // 触发菜单条目点击事件
//       const { col, row, dropDownIndex, menuKey, text, hasChildren } = e.target as any;
//       if (typeof dropDownIndex !== 'number' || hasChildren) {
//         e.stopPropagation();
//         return;
//       }
//       // const field = table.getHeaderField(col, row);
//       const field = table.isPivotTable()
//         ? (table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row)
//         : table.getHeaderField(col, row);

//       const highlight = table._dropDownMenuIsHighlight(col, row, dropDownIndex);
//       table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, {
//         col,
//         row,
//         field: <string>field,
//         menuKey,
//         // fieldKey,
//         // dropDownIndex,
//         text,
//         highlight,
//         cellLocation: table.getCellLocation(col, row),
//         event: e
//       });

//       // table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null); // 清除菜单
//       // table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU, null); // 清除菜单
//       e.stopPropagation();
//     });
//     this._rootElement?.addEventListener('click', e => {
//       e.stopPropagation();
//       e.preventDefault();
//       if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
//         return;
//       }
//       // console.log('menu mousedown', e);
//       // 触发菜单条目点击事件
//       const { col, row, dropDownIndex, menuKey, text, hasChildren } = e.target as any;
//       if (typeof dropDownIndex !== 'number' || hasChildren) {
//         e.stopPropagation();
//         return;
//       }
//       const field = table.isPivotTable()
//         ? (table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row)
//         : table.getHeaderField(col, row);

//       const highlight = table._dropDownMenuIsHighlight(col, row, dropDownIndex);
//       table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, {
//         col,
//         row,
//         field: <string>field,
//         menuKey,
//         text,
//         highlight,
//         cellLocation: table.getCellLocation(col, row),
//         event: e
//       });

//       // table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null); // 清除菜单
//       // table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU, null); // 清除菜单
//       e.stopPropagation();
//     });
//     this._rootElement?.addEventListener('mousemove', e => {
//       if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
//         return;
//       }

//       e.stopPropagation();

//       // 处理二级菜单
//       const { hasChildren, dropDownIndex, col, row, sub } = e.target as any;
//       if (hasChildren) {
//         // 更新二级菜单
//         this._showChildrenIndex = dropDownIndex;
//         const secondElement = this._secondElement;
//         secondElement?.classList.remove(HIDDEN_CLASSNAME);
//         secondElement?.classList.add(SHOWN_CLASSNAME);
//         secondElement.innerHTML = '';

//         // 添加item
//         const children = (this._menuInstanceInfo.content[dropDownIndex] as any)?.children;
//         for (let i = 0; i < children.length; i++) {
//           const menuItem = children[i];
//           const isHighlight = table.stateManager.menu.dropDownMenuHighlight
//             ? isMenuHighlight(
//                 table,
//                 table.stateManager.menu.dropDownMenuHighlight,
//                 typeof menuItem === 'object' ? menuItem?.menuKey || menuItem?.text : menuItem,
//                 col,
//                 row,
//                 i
//               )
//             : false;

//           const item = createItem(menuItem, isHighlight) as any;
//           // dom绑定相关属性
//           item.col = col;
//           item.row = row;
//           item.dropDownIndex = i;
//           if (typeof menuItem === 'string') {
//             item.text = menuItem;
//             item.menuKey = menuItem;
//           } else if (typeof menuItem === 'object') {
//             item.text = menuItem.text;
//             item.menuKey = menuItem.menuKey || menuItem.text;
//           }
//           item.sub = true;
//           item.sub = true;
//           secondElement.appendChild(item);
//         }

//         // 对齐菜单位置
//         const rect = (e.target as any).getBoundingClientRect();
//         this._bindSecondElement(table, col, row, rect.right, rect.top);
//       } else if (hasChildren && this._showChildrenIndex === dropDownIndex) {
//         const secondElement = this._secondElement;
//         secondElement?.classList.remove(HIDDEN_CLASSNAME);
//         secondElement?.classList.add(SHOWN_CLASSNAME);
//       } else if (!sub && this._secondElement?.classList.contains(SHOWN_CLASSNAME)) {
//         setTimeout(() => {
//           //因为增加了主菜单和子菜单的间距 鼠标在移入子菜单的过程中 可能引起子菜单消失 这里增加延时处理
//           if (this._mouseEnterSecondElement !== true) {
//             this._showChildrenIndex = -1;
//             const secondElement = this._secondElement;
//             secondElement?.classList.remove(SHOWN_CLASSNAME);
//             secondElement?.classList.add(HIDDEN_CLASSNAME);
//           }
//         }, 300);
//       }
//     });

//     // 鼠标在菜单上滚动阻止冒泡
//     this._secondElement?.addEventListener('wheel', e => {
//       e.stopPropagation();
//     });
//     this._secondElement?.addEventListener('mousemove', e => {
//       if (this._rootElement.classList.contains(HIDDEN_CLASSNAME)) {
//         return;
//       }
//       // console.log('menu mousemove', e);
//       // table.hoverIcon = undefined;

//       e.stopPropagation();
//     });
//     this._secondElement?.addEventListener('mouseenter', e => {
//       this._mouseEnterSecondElement = true;
//     });
//     this._secondElement?.addEventListener('mouseleave', e => {
//       this._mouseEnterSecondElement = false;
//     });
//     this._secondElement?.addEventListener('mousedown', e => {
//       e.stopPropagation();
//       e.preventDefault();
//     });
//     this._secondElement?.addEventListener('click', e => {
//       e.stopPropagation();
//       e.preventDefault();
//       if (this._secondElement.classList.contains(HIDDEN_CLASSNAME)) {
//         return;
//       }
//       // 触发菜单条目点击事件
//       const { col, row, dropDownIndex, menuKey, text, hasChildren } = e.target as any;
//       if (typeof dropDownIndex !== 'number' || hasChildren) {
//         e.stopPropagation();
//         return;
//       }
//       const field = table.isPivotTable()
//         ? (table.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row)
//         : table.getHeaderField(col, row);
//       let highlight = false;
//       const menus = <MenuListItem[]>this._menuInstanceInfo.content;
//       menus.forEach((menu, i) => {
//         if (typeof menu === 'object' && menu.children && menu.children.length) {
//           for (let j = 0; j < menu.children.length; j++) {
//             const childItem = menu.children[j];
//             if (
//               isMenuHighlight(
//                 table,
//                 table.stateManager.menu.dropDownMenuHighlight,
//                 typeof childItem === 'object' ? childItem?.menuKey : childItem,
//                 col,
//                 row,
//                 -1
//               ) &&
//               menuKey === (typeof childItem === 'object' ? childItem?.menuKey : childItem)
//             ) {
//               highlight = true;
//               return;
//             }
//           }
//         }
//       });

//       table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLICK, {
//         col,
//         row,
//         field: <string>field,
//         cellHeaderPaths: table.isPivotTable() ? table.getCellHeaderPaths(col, row) : undefined,
//         menuKey,
//         text,
//         highlight,
//         cellLocation: table.getCellLocation(col, row),
//         event: e
//       });

//       table.fireListeners(TABLE_EVENT_TYPE.DROPDOWN_MENU_CLEAR, null); // 清除菜单
//       table.fireListeners(TABLE_EVENT_TYPE.HIDE_MENU, null); // 清除菜单
//       e.stopPropagation();
//     });
//   }
//   get rootElement() {
//     return this._rootElement;
//   }
//   release(): void {
//     this.unbindFromCell();

//     const rootElement = this._rootElement;
//     if (rootElement?.parentElement) {
//       rootElement.parentElement.removeChild(rootElement);
//     }

//     this._handler.release();
//     delete this._rootElement;
//   }
//   bindToCell(table: BaseTableAPI, col: number, row: number, menuInstanceInfo: MenuInstanceInfo): boolean {
//     const rootElement = this._rootElement;
//     const secondElement = this._secondElement;
//     this._menuInstanceInfo = menuInstanceInfo;

//     rootElement?.classList.remove(SHOWN_CLASSNAME);
//     rootElement?.classList.add(HIDDEN_CLASSNAME);
//     secondElement?.classList.remove(SHOWN_CLASSNAME);
//     secondElement?.classList.add(HIDDEN_CLASSNAME);

//     if (this._canBindToCell(table, col, row)) {
//       // 生成下拉菜单dom
//       rootElement.innerHTML = '';

//       if (Array.isArray(menuInstanceInfo.content)) {
//         const menuListItem = menuInstanceInfo.content;
//         for (let i = 0; i < menuListItem?.length ?? 0; i++) {
//           const menuItem = menuListItem[i];
//           let isHighlight = table.stateManager.menu.dropDownMenuHighlight
//             ? isMenuHighlight(
//                 table,
//                 table.stateManager.menu.dropDownMenuHighlight,
//                 typeof menuItem === 'object' ? menuItem?.menuKey || menuItem?.text : menuItem,
//                 col,
//                 row,
//                 i
//               )
//             : false;

//           if (
//             table.stateManager.menu.dropDownMenuHighlight &&
//             typeof menuItem === 'object' &&
//             Array.isArray(menuItem.children) &&
//             menuItem.children.length
//           ) {
//             // 判断子项目是否高亮
//             for (let i = 0; i < menuItem.children.length; i++) {
//               const childItem = menuItem.children[i];
//               // eslint-disable-next-line max-depth
//               if (
//                 isMenuHighlight(
//                   table,
//                   table.stateManager.menu.dropDownMenuHighlight,
//                   typeof childItem === 'object' ? childItem?.menuKey || childItem?.text : childItem,
//                   col,
//                   row,
//                   i
//                 )
//               ) {
//                 isHighlight = true;
//                 break;
//               }
//             }
//           }

//           const item = createItem(menuItem, isHighlight) as any;
//           // dom绑定相关属性
//           item.col = col;
//           item.row = row;
//           item.dropDownIndex = i;
//           if (typeof menuItem === 'string') {
//             item.text = menuItem;
//             item.menuKey = menuItem;
//           } else if (typeof menuItem === 'object') {
//             item.text = menuItem.text;
//             item.menuKey = menuItem.menuKey || menuItem.text;
//             if (menuItem.children?.length) {
//               item.hasChildren = true;
//             }
//           }
//           rootElement.appendChild(item);
//         }
//       }
//       const binded = this._bindToCell(table, col, row, menuInstanceInfo.position, menuInstanceInfo.referencePosition);

//       if (binded) {
//         rootElement?.classList.add(SHOWN_CLASSNAME);
//         rootElement?.classList.remove(HIDDEN_CLASSNAME);
//         return true;
//       }
//     } else {
//       this.unbindFromCell();
//     }
//     return false;
//   }
//   unbindFromCell(): void {
//     const rootElement = this._rootElement;
//     const secondElement = this._secondElement;
//     this._menuInstanceInfo = undefined;
//     if (rootElement?.parentElement) {
//       rootElement.classList.remove(SHOWN_CLASSNAME);
//       rootElement.classList.add(HIDDEN_CLASSNAME);
//     }
//     if (secondElement?.parentElement) {
//       secondElement.classList.remove(SHOWN_CLASSNAME);
//       secondElement.classList.add(HIDDEN_CLASSNAME);
//     }
//   }
//   _canBindToCell(table: BaseTableAPI, col: number, row: number): boolean {
//     const rect = table.getCellRangeRelativeRect({ col, row });
//     const element = table.getElement();
//     const { top, bottom, left, right } = rect;
//     if (table.isFrozenCell(col, row)) {
//       return true;
//     } else if (
//       bottom < table.getFrozenRowsHeight() ||
//       right < table.getFrozenColsWidth() ||
//       left > table.tableNoFrameWidth - table.getRightFrozenColsWidth() ||
//       top > table.tableNoFrameHeight - table.getBottomFrozenRowsHeight()
//     ) {
//       // 范围外
//       return false;
//     }
//     const { offsetHeight, offsetWidth } = element;
//     if (offsetHeight < top) {
//       return false;
//     }
//     if (offsetWidth < left) {
//       return false;
//     }
//     return true;
//   }
//   _bindToCell(
//     table: BaseTableAPI,
//     col: number,
//     row: number,
//     position?: { x: number; y: number },
//     referencePosition?: { rect: RectProps; placement?: Placement }
//   ): boolean {
//     const rootElement = this._rootElement;
//     const element = table.getElement();
//     const { width: containerWidth, height: containerHeight } = table.internalProps.element.getBoundingClientRect();
//     if (rootElement) {
//       if (rootElement.parentElement !== element) {
//         element.appendChild(rootElement); // 之前在做dom边缘躲避的时候放到了table.getParentElement()上，但发现不是相对定位导致位置错位
//       }
//       rootElement.style.left = `0px`;
//       //设置最宽尺寸
//       const maxWidth = containerWidth * 0.8;
//       rootElement.style.maxWidth = `${maxWidth}px`;
//       //计算弹出框的宽度
//       const rootElementWidth = rootElement.clientWidth;
//       const rootElementHeight = rootElement.clientHeight;
//       let rootElementLeft;
//       let rootElementTop;
//       if (position) {
//         rootElementLeft = position.x;
//         rootElementTop = position.y;
//       } else if (referencePosition) {
//         rootElementLeft = referencePosition.rect.right - rootElementWidth;
//         rootElementTop = referencePosition.rect.bottom;
//       }
//       //  rootElementLeft = position.x - rootElementWidth;
//       // let leftStyle = rootElementLeft;
//       // 检测下方能否容纳，不能容纳向上偏移
//       if (rootElementTop + rootElementHeight > containerHeight) {
//         rootElementTop = containerHeight - rootElementHeight;
//         // rootElementLeft += rootElementWidth - 2;
//       }
//       // 偏移后上方超出canvas范围，居中显示
//       if (rootElementTop < 0) {
//         rootElementTop = rootElementTop / 2;
//       }
//       rootElement.style.top = `${rootElementTop}px`;

//       // 判断如果超出左右范围则靠边显示
//       if (rootElementLeft < 0) {
//         rootElementLeft = 0;
//       } else if (rootElementLeft + rootElementWidth > containerWidth) {
//         rootElementLeft = containerWidth - rootElementWidth;
//       }
//       rootElement.style.left = `${rootElementLeft}px`;

//       return true;
//     }
//     return false;
//   }
//   _bindSecondElement(table: BaseTableAPI, col: number, row: number, x: number, y: number): boolean {
//     const secondElement = this._secondElement;
//     const rootElement = this._rootElement;
//     const element = table.getElement();
//     const {
//       width: containerWidth,
//       left: containerLeft,
//       top: containerTop
//     } = table.internalProps.element.getBoundingClientRect();
//     const { x: rootLeft, y: rootTop, width: rootWidth } = rootElement.getBoundingClientRect();

//     if (secondElement) {
//       // if (secondElement.parentElement !== rootElement) {
//       //   rootElement.appendChild(secondElement);
//       // }
//       if (secondElement.parentElement !== element) {
//         element.appendChild(secondElement);
//       }

//       secondElement.style.left = `0px`;
//       //设置最宽尺寸
//       const maxWidth = containerWidth * 0.8;
//       secondElement.style.maxWidth = `${maxWidth}px`;
//       //计算弹出框的宽度
//       const secondElementWidth = secondElement.clientWidth;
//       // const secondElementHeight = secondElement.clientHeight;

//       const secondElementTop = y - 4 - containerTop;
//       const secondElementLeft = x - containerLeft;

//       secondElement.style.top = `${secondElementTop}px`;
//       let leftStyle = secondElementLeft;

//       // 判断如果超出右范围则靠左边显示
//       if (leftStyle + secondElementWidth > containerWidth) {
//         leftStyle = leftStyle - secondElementWidth - rootWidth;
//       } else {
//         leftStyle += 4; //位置调整 需要和主菜单之间有4px的间隔
//       }
//       secondElement.style.left = `${leftStyle}px`;

//       return true;
//     }
//     return false;
//   }
//   /** 鼠标坐标位置 是否位于下拉菜单内 */
//   pointInMenuElement(x: number, y: number): boolean {
//     const rootElement = this._rootElement;

//     const { x: rootLeft, y: rootTop, width: rootWidth, height: rootHeight } = rootElement.getBoundingClientRect();
//     if (x > rootLeft - 5 && x < rootLeft + rootWidth + 5 && y > rootTop - 5 && y < rootTop + rootHeight + 5) {
//       return true;
//     }
//     const secondElement = this._secondElement;
//     if (secondElement) {
//       const {
//         x: secondLeft,
//         y: secondTop,
//         width: secondWidth,
//         height: secondHeight
//       } = rootElement.getBoundingClientRect();
//       if (
//         x > secondLeft - 5 &&
//         x < secondLeft + secondWidth + 5 &&
//         y > secondTop - 5 &&
//         y < secondTop + secondHeight + 5
//       ) {
//         return true;
//       }
//     }
//     return false;
//   }
// }

// function createItem(info: MenuListItem, isHighlight: boolean): HTMLDivElement {
//   const itemContainer = createElement('div', [
//     ITEM_CLASSNAME,
//     isHighlight ? SELECT_CLASSNAME : NORAML_CLASSNAME
//   ]) as HTMLDivElement;

//   if (typeof info === 'string') {
//     const item = createElement('span', [CONTENT_CLASSNAME, NOEVENT_CLASSNAME, ITEMTEXT_CLASSNAME]);
//     item.innerHTML = info;
//     itemContainer.appendChild(item);
//   } else if (typeof info === 'object') {
//     const type = info.type ?? 'item';
//     if (type === 'split') {
//       itemContainer?.classList.add(SPLIT_CLASSNAME);
//       return itemContainer;
//     }
//     if (info?.icon?.svg) {
//       if (regUrl.test(info.icon.svg)) {
//         const image = new Image();
//         if (info.icon.width) {
//           image.style.width = info.icon.width.toString() + 'px';
//         } else {
//           image.style.width = '16px';
//         }
//         if (info.icon.height) {
//           image.style.height = info.icon.height.toString() + 'px';
//         } else {
//           image.style.height = '16px';
//         }
//         image.src = info.icon.svg;
//         itemContainer.appendChild(image);
//       } else {
//         const svg = createElement('span', [ICOM_CLASSNAME, NOEVENT_CLASSNAME]);
//         svg.innerHTML =
//           isHighlight && info.selectedIcon && info.selectedIcon.svg ? info.selectedIcon.svg : info.icon.svg;
//         info.icon.width && (svg.children[0] as SVGElement).setAttribute('width', info.icon.width.toString());
//         info.icon.height && (svg.children[0] as SVGElement).setAttribute('height', info.icon.height.toString());
//         itemContainer.appendChild(svg);
//       }
//     }
//     const item = createElement('span', [CONTENT_CLASSNAME, NOEVENT_CLASSNAME, ITEMTEXT_CLASSNAME]);
//     item.innerHTML = info.text;
//     itemContainer.appendChild(item);
//     if (type === 'title') {
//       itemContainer?.classList.add(NOEVENT_CLASSNAME, TITLE_CLASSNAME);
//     } else if (info?.children?.length) {
//       const arrow = createElement('span', [CONTENT_CLASSNAME, NOEVENT_CLASSNAME, ARROW_CLASSNAME]);
//       arrow.innerHTML = isHighlight
//         ? '<svg width="8" height="12" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: baseline"><path d="M1.78186 16.7729L0.300378 15.2915L6.8189 8.77295L0.300377 2.25443L1.78186 0.77295L9.78186 8.77295L1.78186 16.7729Z" fill="#2E68CF" fill-opacity="0.65"></path></svg>'
//         : '<svg width="8" height="12" viewBox="0 0 10 17" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: baseline"><path d="M1.78186 16.7729L0.300378 15.2915L6.8189 8.77295L0.300377 2.25443L1.78186 0.77295L9.78186 8.77295L1.78186 16.7729Z" fill="#141414" fill-opacity="0.65"></path></svg>';
//       itemContainer.appendChild(arrow);
//     }
//   }
//   return itemContainer;
// }
