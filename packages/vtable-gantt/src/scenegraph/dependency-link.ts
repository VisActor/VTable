import type { Line } from '@visactor/vtable/es/vrender';
import { Group, createLine, createRect, Polygon } from '@visactor/vtable/es/vrender';
import type { Scenegraph } from './scenegraph';
// import { Icon } from './icon';
import { createDateAtMidnight, parseStringTemplate, toBoxArray } from '../tools/util';
import { isValid } from '@visactor/vutils';
import { findRecordByTaskKey, getSubTaskRowIndexByRecordDate, getTextPos } from '../gantt-helper';
import type { GanttTaskBarNode } from './gantt-node';
import type { ITaskLink } from '../ts-types';
import { DependencyType, TasksShowMode } from '../ts-types';

export class DependencyLink {
  group: Group;
  linkLinesContainer: Group;

  _scene: Scenegraph;
  width: number;
  height: number;
  selectedEffectNodes: (Line | Polygon)[];
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

    let linkedToTaskStartDate;
    let linkedToTaskEndDate;
    let linkedToTaskTaskDays;
    let linkedFromTaskStartDate;
    let linkedFromTaskEndDate;
    let linkedFromTaskTaskDays;

    let linkedToTaskShowIndex;
    let linkedFromTaskShowIndex;

    if (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Inline) {
      linkedFromTaskShowIndex = linkedFromTaskRecord.index[0];
      linkedToTaskShowIndex = linkedToTaskRecord.index[0];
      ({
        startDate: linkedToTaskStartDate,
        endDate: linkedToTaskEndDate,
        taskDays: linkedToTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
      ({
        startDate: linkedFromTaskStartDate,
        endDate: linkedFromTaskEndDate,
        taskDays: linkedFromTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
    } else if (
      this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Separate ||
      this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange
    ) {
      const beforeRowCountLinkedFrom =
        this._scene._gantt.getRowsHeightByIndex(0, linkedFromTaskRecord.index[0] - 1) /
        this._scene._gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
      linkedFromTaskShowIndex =
        beforeRowCountLinkedFrom +
        (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange
          ? getSubTaskRowIndexByRecordDate(
              this._scene._gantt.records[linkedFromTaskRecord.index[0]],
              linkedFromTaskRecord.index[1],
              this._scene._gantt.parsedOptions.startDateField,
              this._scene._gantt.parsedOptions.endDateField
            )
          : linkedFromTaskRecord.index[1]);
      const beforeRowCountLinkedTo =
        this._scene._gantt.getRowsHeightByIndex(0, linkedToTaskRecord.index[0] - 1) /
        this._scene._gantt.parsedOptions.rowHeight; // 耦合了listTableOption的customComputeRowHeight
      linkedToTaskShowIndex =
        beforeRowCountLinkedTo +
        (this._scene._gantt.parsedOptions.tasksShowMode === TasksShowMode.Sub_Tasks_Arrange
          ? getSubTaskRowIndexByRecordDate(
              this._scene._gantt.records[linkedToTaskRecord.index[0]],
              linkedToTaskRecord.index[1],
              this._scene._gantt.parsedOptions.startDateField,
              this._scene._gantt.parsedOptions.endDateField
            )
          : linkedToTaskRecord.index[1]);
      ({
        startDate: linkedToTaskStartDate,
        endDate: linkedToTaskEndDate,
        taskDays: linkedToTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskRecord.index[0], linkedToTaskRecord.index[1]));
      ({
        startDate: linkedFromTaskStartDate,
        endDate: linkedFromTaskEndDate,
        taskDays: linkedFromTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskRecord.index[0], linkedFromTaskRecord.index[1]));
    } else {
      linkedFromTaskShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedFromTaskRecord.index);
      linkedToTaskShowIndex = this._scene._gantt.getTaskShowIndexByRecordIndex(linkedToTaskRecord.index);

      ({
        startDate: linkedToTaskStartDate,
        endDate: linkedToTaskEndDate,
        taskDays: linkedToTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedToTaskShowIndex));
      ({
        startDate: linkedFromTaskStartDate,
        endDate: linkedFromTaskEndDate,
        taskDays: linkedFromTaskTaskDays
      } = this._scene._gantt.getTaskInfoByTaskListIndex(linkedFromTaskShowIndex));
    }
    if (!linkedFromTaskTaskDays || !linkedToTaskTaskDays) {
      return;
    }
    const minDate = createDateAtMidnight(this._scene._gantt.parsedOptions.minDate);

    const { arrowPoints, linePoints } = generateLinkLinePoints(
      type,
      linkedFromTaskStartDate,
      linkedFromTaskEndDate,
      linkedFromTaskShowIndex,
      linkedToTaskStartDate,
      linkedToTaskEndDate,
      linkedToTaskShowIndex,
      minDate,
      this._scene._gantt.parsedOptions.rowHeight,
      this._scene._gantt.parsedOptions.colWidthPerDay
    );

    const lineStyle = this._scene._gantt.parsedOptions.dependencyLinkLineStyle;
    const lineObj = createLine({
      pickable: true,
      stroke: lineStyle.lineColor,
      lineWidth: lineStyle.lineWidth,
      lineDash: lineStyle.lineDash,
      points: linePoints,
      pickStrokeBuffer: 3,
      vtable_link: link
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
  createSelectedLinkLine(
    selectedLink: ITaskLink & { vtable_gantt_linkArrowNode: Polygon; vtable_gantt_linkLineNode: Line }
  ) {
    const lineNode = selectedLink.vtable_gantt_linkLineNode;
    const arrowNode = selectedLink.vtable_gantt_linkArrowNode;
    const selectedLineNodelineNode = lineNode.clone();
    const selectedLinkArrowNode = arrowNode.clone();
    selectedLineNodelineNode.setAttribute(
      'stroke',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineColor
    );
    selectedLineNodelineNode.setAttribute(
      'lineWidth',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineWidth
    );
    selectedLineNodelineNode.setAttribute(
      'shadowColor',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowColor
    );
    selectedLineNodelineNode.setAttribute(
      'shadowOffsetX',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowOffset
    );
    selectedLineNodelineNode.setAttribute(
      'shadowOffsetY',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowOffset
    );
    selectedLineNodelineNode.setAttribute(
      'shadowBlur',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.shadowBlur
    );
    this.linkLinesContainer.appendChild(selectedLineNodelineNode);
    selectedLinkArrowNode.setAttribute(
      'fill',
      this._scene._gantt.parsedOptions.dependencyLinkSelectedLineStyle.lineColor
    );
    this.linkLinesContainer.appendChild(selectedLinkArrowNode);
    this.selectedEffectNodes = [selectedLineNodelineNode, selectedLinkArrowNode];
  }
  removeSelectedLinkLine() {
    this.selectedEffectNodes?.forEach(node => {
      node.delete();
    });
    this.selectedEffectNodes = [];
  }

  deleteLink(link: ITaskLink) {
    const linkLineNode = link.vtable_gantt_linkLineNode;
    const lineArrowNode = link.vtable_gantt_linkArrowNode;
    linkLineNode.delete();
    lineArrowNode.delete();
  }
}

export function generateLinkLinePoints(
  type: DependencyType,
  linkedFromTaskStartDate: Date,
  linkedFromTaskEndDate: Date,
  linkedFromTaskRecordRowIndex: number,
  linkedToTaskStartDate: Date,
  linkedToTaskEndDate: Date,
  linkedToTaskRecordRowIndex: number,
  minDate: Date,
  rowHeight: number,
  colWidthPerDay: number
) {
  const distanceToTaskBar: number = 20;
  const arrowWidth: number = 10;
  const arrowHeight: number = 5;
  let startDate;
  let endDate;
  let linePoints: { x: number; y: number }[] = [];
  let arrowPoints: { x: number; y: number }[] = [];
  if (type === DependencyType.FinishToStart) {
    startDate = linkedFromTaskEndDate;
    endDate = linkedToTaskStartDate;
    const linkFromPointX =
      colWidthPerDay * (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const linkToPointX =
      colWidthPerDay * Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x: linkFromPointX + distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x: linkFromPointX + distanceToTaskBar,
        y:
          rowHeight *
          (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y:
          rowHeight *
          (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      }
    ];
    if (linkFromPointX + distanceToTaskBar <= linkToPointX - distanceToTaskBar) {
      linePoints.splice(2, 3, {
        x: linkFromPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      });
    }
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.StartToFinish) {
    startDate = linkedFromTaskStartDate;
    endDate = linkedToTaskEndDate;
    const linkFromPointX =
      colWidthPerDay * Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const linkToPointX =
      colWidthPerDay * (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x: linkFromPointX - distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x: linkFromPointX - distanceToTaskBar,
        y:
          rowHeight *
          (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y:
          rowHeight *
          (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1))
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      }
    ];
    if (linkFromPointX - distanceToTaskBar >= linkToPointX + distanceToTaskBar) {
      linePoints.splice(2, 3, {
        x: linkFromPointX - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      });
    }
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.StartToStart) {
    startDate = linkedFromTaskStartDate;
    endDate = linkedToTaskStartDate;
    const linkFromPointX =
      colWidthPerDay * Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const linkToPointX =
      colWidthPerDay * Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y:
          rowHeight *
          (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5))
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y:
          rowHeight *
          (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5))
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkToPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      }
    ];
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.FinishToFinish) {
    startDate = linkedFromTaskEndDate;
    endDate = linkedToTaskEndDate;
    const linkFromPointX =
      colWidthPerDay * (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const linkToPointX =
      colWidthPerDay * (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5)
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
        y:
          rowHeight *
          (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5))
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y:
          rowHeight *
          (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5))
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5)
      }
    ];
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  }
  return { linePoints, arrowPoints };
}

/**
 *
 * @param type 依赖关联类型
 * @param linkedFromTaskStartDate 关联源任务的开始时间
 * @param linkedFromTaskEndDate 关联源任务的结束时间
 * @param linkedFromTaskRecordRowIndex  关联源任务所在的行索引
 * @param fromNodeDiffY 关联源任务的偏移量，如果在拖拽过程中，会有偏移量
 * @param linkedToTaskStartDate   关联目标任务的开始时间
 * @param linkedToTaskEndDate    关联目标任务的结束时间
 * @param linkedToTaskRecordRowIndex  关联目标任务所在的行索引
 * @param toNodeDiffY    关联目标任务的偏移量，如果在拖拽过程中，会有偏移量
 * @param minDate 甘特图设置的最开始时间
 * @param rowHeight   单个任务条占用的行高
 * @param colWidthPerDay   单个日期占用的列宽
 * @param linkedFromMovedTaskBarNode  关联源任务的任务场景树节点
 * @param linkedToMovedTaskBarNode   关联目标任务的任务场景树节点
 * @returns
 */
export function updateLinkLinePoints(
  type: DependencyType,
  linkedFromTaskStartDate: Date,
  linkedFromTaskEndDate: Date,
  linkedFromTaskRecordRowIndex: number,
  fromNodeDiffY: number,
  linkedToTaskStartDate: Date,
  linkedToTaskEndDate: Date,
  linkedToTaskRecordRowIndex: number,
  toNodeDiffY: number,
  minDate: Date,
  rowHeight: number,
  colWidthPerDay: number,
  linkedFromMovedTaskBarNode: GanttTaskBarNode,
  linkedToMovedTaskBarNode: GanttTaskBarNode
) {
  const distanceToTaskBar: number = 20;
  const arrowWidth: number = 10;
  const arrowHeight: number = 5;
  let startDate;
  let endDate;
  let linePoints: { x: number; y: number }[] = [];
  let arrowPoints: { x: number; y: number }[] = [];
  if (type === DependencyType.FinishToStart) {
    startDate = linkedFromTaskEndDate;
    endDate = linkedToTaskStartDate;
    const linkFromPointX = linkedFromMovedTaskBarNode
      ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width
      : colWidthPerDay * (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const linkToPointX = linkedToMovedTaskBarNode
      ? linkedToMovedTaskBarNode.attribute.x
      : colWidthPerDay * Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));

    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x: linkFromPointX + distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x: linkFromPointX + distanceToTaskBar,
        y:
          rowHeight *
            (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) +
          fromNodeDiffY
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y:
          rowHeight *
            (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) +
          fromNodeDiffY
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      }
    ];
    if (linkFromPointX + distanceToTaskBar <= linkToPointX - distanceToTaskBar) {
      linePoints.splice(2, 3, {
        x: linkFromPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      });
    }
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.StartToFinish) {
    startDate = linkedFromTaskStartDate;
    endDate = linkedToTaskEndDate;

    const linkFromPointX = linkedFromMovedTaskBarNode
      ? linkedFromMovedTaskBarNode.attribute.x
      : colWidthPerDay * Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const linkToPointX = linkedToMovedTaskBarNode
      ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width
      : colWidthPerDay * (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x: linkFromPointX - distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x: linkFromPointX - distanceToTaskBar,
        y:
          rowHeight *
            (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) +
          fromNodeDiffY
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y:
          rowHeight *
            (linkedFromTaskRecordRowIndex + (linkedFromTaskRecordRowIndex > linkedToTaskRecordRowIndex ? 0 : 1)) +
          fromNodeDiffY
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      }
    ];
    if (linkFromPointX - distanceToTaskBar >= linkToPointX + distanceToTaskBar) {
      linePoints.splice(2, 3, {
        x: linkFromPointX - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      });
    }
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.StartToStart) {
    startDate = linkedFromTaskStartDate;
    endDate = linkedToTaskStartDate;
    const linkFromPointX = linkedFromMovedTaskBarNode
      ? linkedFromMovedTaskBarNode.attribute.x
      : colWidthPerDay * Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    const linkToPointX = linkedToMovedTaskBarNode
      ? linkedToMovedTaskBarNode.attribute.x
      : colWidthPerDay * Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24));
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y:
          rowHeight *
            (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5)) +
          toNodeDiffY
      },
      {
        x: linkToPointX - distanceToTaskBar,
        y:
          rowHeight *
            (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5)) +
          toNodeDiffY
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkToPointX
            : Math.min(linkFromPointX, linkToPointX)) - distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      }
    ];
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x - arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  } else if (type === DependencyType.FinishToFinish) {
    startDate = linkedFromTaskEndDate;
    endDate = linkedToTaskEndDate;
    const linkFromPointX = linkedFromMovedTaskBarNode
      ? linkedFromMovedTaskBarNode.attribute.x + linkedFromMovedTaskBarNode.attribute.width
      : colWidthPerDay * (Math.ceil(Math.abs(startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const linkToPointX = linkedToMovedTaskBarNode
      ? linkedToMovedTaskBarNode.attribute.x + linkedToMovedTaskBarNode.attribute.width
      : colWidthPerDay * (Math.ceil(Math.abs(endDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    linePoints = [
      {
        x: linkFromPointX,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
        y: rowHeight * (linkedFromTaskRecordRowIndex + 0.5) + fromNodeDiffY
      },
      {
        x:
          (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex
            ? linkFromPointX
            : Math.max(linkFromPointX, linkToPointX)) + distanceToTaskBar,
        y:
          rowHeight *
            (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5)) +
          toNodeDiffY
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y:
          rowHeight *
            (linkedToTaskRecordRowIndex + (linkedFromTaskRecordRowIndex === linkedToTaskRecordRowIndex ? 1 : 0.5)) +
          toNodeDiffY
      },
      {
        x: linkToPointX + distanceToTaskBar,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      },
      {
        x: linkToPointX,
        y: rowHeight * (linkedToTaskRecordRowIndex + 0.5) + toNodeDiffY
      }
    ];
    const lastPoint = linePoints[linePoints.length - 1];
    arrowPoints = [
      {
        x: lastPoint.x,
        y: lastPoint.y
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y - arrowHeight
      },
      {
        x: lastPoint.x + arrowWidth,
        y: lastPoint.y + arrowHeight
      },
      {
        x: lastPoint.x,
        y: lastPoint.y
      }
    ];
  }
  return { linePoints, arrowPoints };
}
