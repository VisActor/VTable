import { Group, createLine, createRect, Polygon } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
// import { Icon } from './icon';
import { createDateAtMidnight, parseStringTemplate, toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { findRecordByTaskKey, getTextPos } from '../gantt-helper';
import type { GanttTaskBarNode } from './gantt-node';
import { DependencyType } from '../ts-types';

export class DependencyLink {
  group: Group;
  linkLinesContainer: Group;

  _scene: Scenegraph;
  width: number;
  height: number;
  distanceToTaskBar: number = 20;
  arrowWidth: number = 10;
  arrowHeight: number = 5;
  constructor(scene: Scenegraph) {
    this._scene = scene;
    // const height = Math.min(scene._gantt.tableNoFrameHeight, scene._gantt.drawHeight);
    this.width = scene._gantt.tableNoFrameWidth;
    this.height = scene._gantt.gridHeight;
    this.group = new Group({
      x: 0,
      y: scene._gantt.getAllHeaderRowsHeight(),
      width: this.width,
      height: this.height,
      pickable: false,
      clip: true
    });
    this.group.name = 'dependency-link-container';
    scene.tableGroup.addChild(this.group);
    this.initLinkLines();
  }

  initLinkLines() {
    this.linkLinesContainer = new Group({
      x: 0,
      y: 0,
      width: this._scene._gantt._getAllColsWidth(),
      height: this._scene._gantt.getAllTaskBarsHeight(),
      pickable: false,
      clip: true
    });
    this.group.appendChild(this.linkLinesContainer);

    for (let i = 0; i < this._scene._gantt.parsedOptions.dependencyLinks?.length ?? 0; i++) {
      this.initLinkLine(i);
    }
  }
  initLinkLine(index: number) {
    const { taskKeyField, dependencyLinks } = this._scene._gantt.parsedOptions;
    const link = dependencyLinks[index];
    const { linkedToTaskKey, linkedFromTaskKey, type } = link;
    const linkedToTaskRecord = findRecordByTaskKey(this._scene._gantt.records, taskKeyField, linkedToTaskKey);
    if (!linkedToTaskRecord.record.vtable_gantt_linkedTo) {
      linkedToTaskRecord.record.vtable_gantt_linkedTo = [];
    }
    linkedToTaskRecord.record.vtable_gantt_linkedTo.push(link);
    const linkedFromTaskRecord = findRecordByTaskKey(this._scene._gantt.records, taskKeyField, linkedFromTaskKey);
    if (!linkedFromTaskRecord.record.vtable_gantt_linkedFrom) {
      linkedFromTaskRecord.record.vtable_gantt_linkedFrom = [];
    }
    linkedFromTaskRecord.record.vtable_gantt_linkedFrom.push(link);

    const {
      startDate: linkedToTaskStartDate,
      endDate: linkedToTaskEndDate,
      taskDays: linkedToTaskTaskDays
    } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index);
    const {
      startDate: linkedFromTaskStartDate,
      endDate: linkedFromTaskEndDate,
      taskDays: linkedFromTaskTaskDays
    } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index);
    if (!linkedFromTaskTaskDays || !linkedToTaskTaskDays) {
      return;
    }
    const minDate = createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);

    let startDate;
    let endDate;
    let points: { x: number; y: number }[] = [];
    let arrowPoints: { x: number; y: number }[] = [];
    if (type === DependencyType.FinishToStart) {
      startDate = linkedFromTaskEndDate;
      endDate = linkedToTaskStartDate;
      points = [
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 1)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * linkedToTaskRecord.index
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        }
      ];
      const lastPoint = points[points.length - 1];
      arrowPoints = [
        {
          x: lastPoint.x,
          y: lastPoint.y
        },
        {
          x: lastPoint.x - this.arrowWidth,
          y: lastPoint.y - this.arrowHeight
        },
        {
          x: lastPoint.x - this.arrowWidth,
          y: lastPoint.y + this.arrowHeight
        },
        {
          x: lastPoint.x,
          y: lastPoint.y
        }
      ];
    } else if (type === DependencyType.StartToFinish) {
      startDate = linkedFromTaskStartDate;
      endDate = linkedToTaskEndDate;
      points = [
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 1)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * linkedToTaskRecord.index
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        }
      ];
      const lastPoint = points[points.length - 1];
      arrowPoints = [
        {
          x: lastPoint.x,
          y: lastPoint.y
        },
        {
          x: lastPoint.x + this.arrowWidth,
          y: lastPoint.y - this.arrowHeight
        },
        {
          x: lastPoint.x + this.arrowWidth,
          y: lastPoint.y + this.arrowHeight
        },
        {
          x: lastPoint.x,
          y: lastPoint.y
        }
      ];
    } else if (type === DependencyType.StartToStart) {
      startDate = linkedFromTaskStartDate;
      endDate = linkedToTaskStartDate;
      points = [
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(
                Math.abs(Math.min(startDate.getTime(), endDate.getTime()) - minDate.getTime()) / (1000 * 60 * 60 * 24)
              ) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              Math.ceil(
                Math.abs(Math.min(startDate.getTime(), endDate.getTime()) - minDate.getTime()) / (1000 * 60 * 60 * 24)
              ) -
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        }
      ];
      const lastPoint = points[points.length - 1];
      arrowPoints = [
        {
          x: lastPoint.x,
          y: lastPoint.y
        },
        {
          x: lastPoint.x - this.arrowWidth,
          y: lastPoint.y - this.arrowHeight
        },
        {
          x: lastPoint.x - this.arrowWidth,
          y: lastPoint.y + this.arrowHeight
        },
        {
          x: lastPoint.x,
          y: lastPoint.y
        }
      ];
    } else if (type === DependencyType.FinishToFinish) {
      startDate = linkedFromTaskEndDate;
      endDate = linkedToTaskEndDate;
      points = [
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(
                Math.abs(Math.max(startDate.getTime(), endDate.getTime()) - minDate.getTime()) / (1000 * 60 * 60 * 24)
              ) +
                1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedFromTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
              (Math.ceil(
                Math.abs(Math.max(startDate.getTime(), endDate.getTime()) - minDate.getTime()) / (1000 * 60 * 60 * 24)
              ) +
                1) +
            this.distanceToTaskBar,
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        },
        {
          x:
            this._scene._gantt.parsedOptions.colWidthPerDay *
            (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1),
          y: this._scene._gantt.parsedOptions.rowHeight * (linkedToTaskRecord.index + 0.5)
        }
      ];
      const lastPoint = points[points.length - 1];
      arrowPoints = [
        {
          x: lastPoint.x,
          y: lastPoint.y
        },
        {
          x: lastPoint.x + this.arrowWidth,
          y: lastPoint.y - this.arrowHeight
        },
        {
          x: lastPoint.x + this.arrowWidth,
          y: lastPoint.y + this.arrowHeight
        },
        {
          x: lastPoint.x,
          y: lastPoint.y
        }
      ];
    }

    const lineStyle = this._scene._gantt.parsedOptions.dependencyLinkLineStyle;
    const lineObj = createLine({
      pickable: true,
      stroke: lineStyle.lineColor,
      lineWidth: lineStyle.lineWidth,
      lineDash: lineStyle.lineDash,
      points
    });
    this.linkLinesContainer.appendChild(lineObj);
    (link as any).vtable_gantt_linkLineNode = lineObj;

    const arrow = new Polygon({
      fill: lineStyle.lineColor,
      points: arrowPoints
    });
    this.linkLinesContainer.appendChild(arrow);
    (link as any).vtable_gantt_linkArrowNode = arrow;
  }

  setX(x: number) {
    this.linkLinesContainer.setAttribute('x', x);
  }
  setY(y: number) {
    this.linkLinesContainer.setAttribute('y', y);
  }
  /** 重新创建任务条节点 */
  refresh() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttributes({
      height: this.height,
      width: this.width,
      y: this._scene._gantt.getAllHeaderRowsHeight()
    });
    this.linkLinesContainer.removeAllChild();
    this.group.removeChild(this.linkLinesContainer);
    this.initLinkLines();
  }
  resize() {
    this.width = this._scene._gantt.tableNoFrameWidth;
    this.height = this._scene._gantt.gridHeight;
    this.group.setAttribute('width', this.width);
    this.group.setAttribute('height', this.height);
  }
}
