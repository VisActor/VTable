import { isValid } from '@visactor/vutils';
import { getTextPos } from '../gantt-helper';
import { computeCountToTimeScale, toBoxArray } from '../tools/util';
import type { Scenegraph } from './scenegraph';
import { Group, Text, createLine, Image } from '@visactor/vtable/es/vrender';

const DEFAULT_MARKLINE_CREATION_ICON = `<svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1471" width="24" height="24"> <path d="M840.05 153.35a27.61875 27.61875 0 0 0-22.95-4.95c-56.25 13.05-218.25 39.6-289.8 2.25-115.65-60.75-241.65-31.95-299.7-13.05V95.75a27.05625 27.05625 0 0 0-27-27 27.05625 27.05625 0 0 0-27 27v834.75c0 14.85 12.15 27 27 27s27-12.15 27-27V611.9c44.1-13.95 199.35-56.25 293.85 1.8 45.9 28.35 96.75 37.8 143.55 37.8 89.1 0 164.7-34.2 169.65-36.45a27.9 27.9 0 0 0 15.75-24.75V174.5a27.5625 27.5625 0 0 0-10.35-21.15z" fill="#f54319" p-id="1472"></path></svg>`;
export class TimelineHeader {
  group: Group;
  _scene: Scenegraph;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    this.initNodes();
  }
  initNodes() {
    const { _scene: scene } = this;
    const dateHeader = new Group({
      x: 0,
      y: 0,
      width: scene._gantt.getAllDateColsWidth(), //width - 2,
      height: scene._gantt.getAllHeaderRowsHeight(),
      clip: true,
      pickable: false
      // fill: 'purple',
      // stroke: 'green',
      // lineWidth: 2
    });
    this.group = dateHeader;
    dateHeader.name = 'date-header-container';
    scene.ganttGroup.addChild(this.group);
    const { unit: minUnit, step } = scene._gantt.parsedOptions.reverseSortedTimelineScales[0];
    let y = 0;
    for (let i = 0; i < scene._gantt.timeLineHeaderLevel; i++) {
      const { timelineDates, customLayout, visible } = scene._gantt.parsedOptions.sortedTimelineScales[i];
      if (visible === false) {
        continue;
      }
      const rowHeader = new Group({
        x: 0,
        y,
        width: scene._gantt.getAllDateColsWidth(),
        height: scene._gantt.parsedOptions.timeLineHeaderRowHeights[i],
        clip: false
      });
      y += rowHeader.attribute.height;
      rowHeader.name = 'row-header';
      dateHeader.addChild(rowHeader);

      for (let j = 0; j < timelineDates?.length; j++) {
        const { days, endDate, startDate, title, dateIndex, unit } = timelineDates[j];
        const x = Math.ceil(
          computeCountToTimeScale(startDate, scene._gantt.parsedOptions.minDate, minUnit, step) *
            scene._gantt.parsedOptions.timelineColWidth
        );
        const right_x = Math.ceil(
          computeCountToTimeScale(endDate, scene._gantt.parsedOptions.minDate, minUnit, step, 1) *
            scene._gantt.parsedOptions.timelineColWidth
        );
        const width = right_x - x;
        const date = new Group({
          x,
          y: 0,
          width,
          height: rowHeader.attribute.height,
          clip: false,
          fill: scene._gantt.parsedOptions.timelineHeaderBackgroundColor
        });
        date.name = 'date-header-cell';
        let rootContainer;
        let renderDefaultText = true;

        const height = rowHeader.attribute.height;
        if (customLayout) {
          let customLayoutObj;
          if (typeof customLayout === 'function') {
            const arg = {
              width,
              height,
              index: j,
              startDate,
              endDate,
              days,
              dateIndex,
              title,
              ganttInstance: this._scene._gantt
            };
            customLayoutObj = customLayout(arg);
          } else {
            customLayoutObj = customLayout;
          }
          if (customLayoutObj) {
            // if (customLayoutObj.rootContainer) {
            //   customLayoutObj.rootContainer = decodeReactDom(customLayoutObj.rootContainer);
            // }
            rootContainer = customLayoutObj.rootContainer;
            renderDefaultText = customLayoutObj.renderDefaultText ?? false;
            rootContainer.name = 'task-bar-custom-render';
          }
          rootContainer && date.appendChild(rootContainer);
        }
        if (renderDefaultText) {
          const {
            padding,
            textAlign,
            textBaseline,
            textOverflow,
            fontSize,
            fontWeight,
            color,
            strokeColor,
            textStick
          } = scene._gantt.parsedOptions.timelineHeaderStyles[i];

          const position = getTextPos(toBoxArray(padding), textAlign, textBaseline, width, height);
          const text = new Text({
            x: position.x,
            y: position.y,
            maxLineWidth: width,
            heightLimit: height,
            // clip: true,
            pickable: true,
            text: title.toLocaleString(),
            fontSize: fontSize,
            fontWeight: fontWeight,
            fill: color,
            stroke: strokeColor,
            lineWidth: 2,
            textAlign,
            textBaseline,
            ellipsis:
              textOverflow === 'clip'
                ? ''
                : textOverflow === 'ellipsis'
                ? '...'
                : isValid(textOverflow)
                ? textOverflow
                : undefined
          });
          (text.attribute as any).textStick = textStick;
          date.appendChild(text);
          text.name = 'date-header-cell-text';
        }
        if (
          i === scene._gantt.timeLineHeaderLevel - 1 &&
          scene._gantt.parsedOptions.markLineCreateOptions &&
          scene._gantt.parsedOptions.markLineCreateOptions.markLineCreatable
        ) {
          const markLineStyle = scene._gantt.parsedOptions.markLineCreateOptions.markLineCreationStyle || {};
          const size = markLineStyle.size || 24;
          const iconSize = markLineStyle.iconSize || 18;
          const marklineCreateIcon = markLineStyle.svg || DEFAULT_MARKLINE_CREATION_ICON;
          // 是否开启里程碑功能
          const marklineCreateGroup = new Group({
            x: width / 2 - size / 2,
            y: height / 2 - size / 2,
            width: size,
            height: size,
            visible: true
          });
          marklineCreateGroup.name = 'markline-hover-group';
          (marklineCreateGroup as any).data = timelineDates[j];
          const marklineCreateInnerGroup = new Group({
            x: 0,
            y: 0,
            width: size,
            height: size,
            cornerRadius: size / 2,
            fill: markLineStyle.fill || '#ccc',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            visibleAll: false
          });
          marklineCreateInnerGroup.name = 'markline-hover-inner-group';
          marklineCreateGroup.add(marklineCreateInnerGroup);
          const icon = new Image({
            width: iconSize,
            height: iconSize,
            image: marklineCreateIcon,
            cursor: 'pointer',
            pickable: true
          });
          icon.name = 'markline-hover-icon';
          marklineCreateInnerGroup.appendChild(icon);
          date.add(marklineCreateGroup);
        }
        rowHeader.addChild(date);

        if (j > 0) {
          const line = createLine({
            pickable: false,
            stroke: scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle?.lineColor,
            lineWidth: scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle?.lineWidth,
            lineDash: scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle?.lineDash,
            points: [
              { x: scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle?.lineWidth & 1 ? 0.5 : 0, y: 0 },
              {
                x: scene._gantt.parsedOptions.timelineHeaderVerticalLineStyle?.lineWidth & 1 ? 0.5 : 0,
                y: rowHeader.attribute.height
              }
            ]
          });
          date.appendChild(line);
        }
      }
      //创建表头分割线 水平分割线 TODO
      if (i > 0) {
        const line = createLine({
          pickable: false,
          stroke: scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineColor,
          lineWidth: scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineWidth,
          lineDash: scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineDash,
          points: [
            { x: 0, y: scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineWidth & 1 ? 0.5 : 0 },
            {
              x: scene._gantt.getAllDateColsWidth(),
              y: scene._gantt.parsedOptions.timelineHeaderHorizontalLineStyle?.lineWidth & 1 ? 0.5 : 0
            }
          ]
        });
        rowHeader.addChild(line);
      }
    }
  }
  setX(x: number) {
    this.group.setAttribute('x', x);
  }
  setY(y: number) {
    this.group.setAttribute('y', y);
  }
  resize() {
    this.group.setAttribute('width', this.group.attribute?.width ?? 0);
    this.group.setAttribute('height', this.group.attribute?.height ?? 0);
  }

  refresh() {
    this.group?.parent.removeChild(this.group);
    this.initNodes();
  }
  showMarklineIcon(target: any) {
    let innerGroup;
    target.children.forEach((child: any) => {
      if (child.name === 'date-header-cell-text') {
        child.setAttribute('visible', false);
      }
      if (child.name === 'markline-hover-group') {
        innerGroup = child.firstChild;
        innerGroup.setAttribute('visibleAll', true);
      }
    });
    return innerGroup;
  }
  hideMarklineIconHover(target: any) {
    let innerGroup;
    target.children.forEach((child: any) => {
      if (child.name === 'date-header-cell-text') {
        child.setAttribute('visible', true);
      }
      if (child.name === 'markline-hover-group') {
        innerGroup = child.firstChild;
        innerGroup.setAttribute('visibleAll', false);
      }
    });
    return innerGroup;
  }
}
