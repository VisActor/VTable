import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { VTable } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt } from '../../src/index';
import { DependencyType } from '../../src/ts-types';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
const report = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD43C" xmlns="http://www.w3.org/2000/svg">
<path d="M13.732 2c-.77-1.333-2.694-1.333-3.464 0L.742 19c-.77 1.334.192 3 1.732 3h19.052c1.54 0 2.502-1.666 
1.733-3L13.732 2ZM10.75 8.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1a.75.75 
0 0 1-.75-.75v-6Zm0 8.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1Z" 
fill="#FFD43C"/>
</svg>
`;
const flag = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#e16531" xmlns="http://www.w3.org/2000/svg">
<path d="M5 15h15.415a1.5 1.5 0 0 0 1.303-2.244l-2.434-4.26a1 1 0 0 1 0-.992l2.434-4.26A1.5 1.5 0 0 0 20.415 1H5a2 
2 0 0 0-2 2v19a1 1 0 0 0 2 .003V15Z" fill="#e16531"/>
</svg>
`;

const add = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M5 3h14v10h2V3a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h7v-2H5V3Z" fill="#2B2F36"/>
  <path d="M7 8a1 1 0 0 1 1-1h3a1 1 0 1 1 0 2H8a1 1 0 0 1-1-1Zm1 3a1 1 0 1 0 0 2h8a1 1 0 1 0 0-2H8Zm9 5a1 
  1 0 1 1 2 0v2h2a1 1 0 1 1 0 2h-2v2a1 1 0 1 1-2 0v-2h-2a1 1 0 1 1 0-2h2v-2Z" fill="#2B2F36"/>
</svg>
`;
const edit = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3 20a1 1 0 1 0 0 2h18a1 1 0 0 0 0-2H3ZM16.275 1.957a1 1 0 0 0-1.415 0l-2.12 2.121 4.03 4.03 2.12-2.12a1
   1 0 0 0 0-1.415l-2.615-2.616Zm-.565 7.212-4.031-4.03-8.4 8.399a1.5 1.5 0 0 0-.439 1.06v2.81a.6.6 0 0 0 .6.6h2.81a1.5
    1.5 0 0 0 1.06-.44l8.4-8.4Z" fill="#2B2F36"/>
</svg>
`;

export const flagIcon = {
  type: 'svg',
  svg: flag,
  width: 20,
  height: 20,
  name: 'flag',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};

export const reportIcon = {
  type: 'svg',
  svg: report,
  width: 20,
  height: 20,
  name: 'report',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};

export const addIcon = {
  type: 'svg',
  svg: add,
  width: 20,
  height: 20,
  name: 'add',
  visibleTime: 'mouseenter_cell',
  positionType: VTable.TYPES.IconPosition.contentRight,
  cursor: 'pointer'
};

export const editIcon = {
  type: 'svg',
  svg: edit,
  width: 20,
  height: 20,
  name: 'edit',
  visibleTime: 'mouseenter_cell',
  positionType: VTable.TYPES.IconPosition.contentRight,
  cursor: 'pointer'
};

VTable.register.icon('flag', flagIcon);
VTable.register.icon('report', reportIcon);
VTable.register.icon('add', addIcon);
VTable.register.icon('edit', editIcon);

export function createTable() {
  const customLayout = args => {
    const { width, height, taskRecord } = args;
    const container = new VTableGantt.VRender.Group({
      width,
      height,
      cornerRadius: 10,
      fill: taskRecord?.timeConflict
        ? '#f0943a'
        : taskRecord?.keyNode
        ? '#446eeb'
        : taskRecord?.confirmed
        ? '#63bb5c'
        : '#ebeced',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      boundsPadding: 10
    });

    if (taskRecord?.timeConflict) {
      const reportIcon = new VTableGantt.VRender.Image({
        width: 20,
        height: 20,
        image: report
      });
      container.add(reportIcon);
    }

    if (taskRecord?.keyNode) {
      const reportIcon = new VTableGantt.VRender.Image({
        width: 20,
        height: 20,
        image: flag
      });
      container.add(reportIcon);
    }

    const name = new VTableGantt.VRender.Text({
      text: taskRecord.name,
      fill: taskRecord?.keyNode ? '#fff' : '#0f2819',
      suffixPosition: 'end',
      fontSize: 14,
      boundsPadding: 10
    });

    container.add(name);

    // container.addEventListener('click', event => {
    //   clickRef.current = true;
    //   setTimeout(() => {
    //     clickRef.current = false;
    //   });
    //   const containerRect = ganttRef.current.getBoundingClientRect();
    //   const targetY = event.target.globalAABBBounds.y1;
    //   showTooltip([taskRecord.developer], event.client.x, targetY + containerRect.top - 20);
    // });

    // container.addEventListener('mouseenter', event => {
    //   const containerRect = ganttRef.current.getBoundingClientRect();
    //   const targetY = event.target.globalAABBBounds.y1;
    //   showNameTooltip(taskRecord, event.client.x, targetY + containerRect.top + 32);
    // });

    // container.addEventListener('mouseleave', () => {
    //   hideNameTooltip();
    // });

    return {
      rootContainer: container
    };
  };
  const records = [
    {
      id: null,
      processType: null,
      flowType: null,
      closingVersionId: 0,
      name: 'FA账期关闭',
      processorIds: null,
      processorNames: null,
      planStartDay: 'DAY1',
      planStartTime: '10:00:00',
      planFinishDay: 'DAY3',
      planFinishTime: '00:00:00',
      conflictDesc: '',
      canEdit: false,
      canAddChildNode: false,
      canAdjustPlanStartTime: false,
      canAdjustPlanFinishTime: false,
      confirmed: false,
      timeConflict: false,
      keyNode: false,
      key: '0',
      check: {
        checked: false,
        disable: true
      },
      planStartFormat: 'DAY1 10:00:00',
      planFinishFormat: 'DAY3 00:00:00',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-03 00:00:00',
      hierarchyState: 'expand',
      children: [
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: 'FA账期关闭',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '13:30',
          planFinishDay: 'DAY2',
          planFinishTime: '15:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: true,
          key: '0,0',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 13:30',
          planFinishFormat: 'DAY2 15:00',
          planStartCalendar: '2025-01-02 13:30',
          planFinishCalendar: '2025-01-02 15:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46396',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['7186351', '8068265'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '13:30',
              planFinishDay: 'DAY2',
              planFinishTime: '15:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '0,0,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '7186351, 8068265',
              planStartFormat: 'DAY2 13:30',
              planFinishFormat: 'DAY2 15:00',
              planStartCalendar: '2025-01-02 13:30',
              planFinishCalendar: '2025-01-02 15:00'
            }
          ]
        }
      ]
    },
    {
      id: null,
      processType: null,
      flowType: null,
      closingVersionId: 0,
      name: 'GL资金结账',
      processorIds: null,
      processorNames: null,
      planStartDay: 'DAY1',
      planStartTime: '10:00:00',
      planFinishDay: 'DAY5',
      planFinishTime: '00:00:00',
      conflictDesc: '',
      canEdit: false,
      canAddChildNode: false,
      canAdjustPlanStartTime: false,
      canAdjustPlanFinishTime: false,
      confirmed: false,
      timeConflict: false,
      keyNode: false,
      key: '1',
      check: {
        checked: false,
        disable: true
      },
      planStartFormat: 'DAY1 10:00:00',
      planFinishFormat: 'DAY5 00:00:00',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-05 00:00:00',
      hierarchyState: 'expand',
      children: [
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '第三方提现中转核对',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY3',
          planFinishTime: '12:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,0',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY3 12:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46361',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9228206'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY3',
              planFinishTime: '12:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,0,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9228206',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY3 12:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-03 12:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '红包提现流水入账',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY3',
          planStartTime: '10:30',
          planFinishDay: 'DAY3',
          planFinishTime: '12:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,1',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY3 10:30',
          planFinishFormat: 'DAY3 12:00',
          planStartCalendar: '2025-01-03 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46364',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: [
                '1372633',
                '3597200',
                '6655520',
                '8302516',
                '5911977',
                '1252176',
                '9328852',
                '5100667',
                '2677388',
                '7619692',
                '5157711',
                '7767803',
                '1223020',
                '2709303',
                '7363853',
                '9205197'
              ],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '10:30',
              planFinishDay: 'DAY3',
              planFinishTime: '12:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,1,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: `1372633, 3597200, 6655520, 8302516, 5911977, 1252176, 9328852, 5100667, 2677388, 
                7619692, 5157711, 7767803, 1223020, 2709303, 7363853, 9205197`,
              planStartFormat: 'DAY3 10:30',
              planFinishFormat: 'DAY3 12:00',
              planStartCalendar: '2025-01-03 10:30',
              planFinishCalendar: '2025-01-03 12:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金中转对平',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY3',
          planStartTime: '16:00',
          planFinishDay: 'DAY3',
          planFinishTime: '19:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,2',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY3 16:00',
          planFinishFormat: 'DAY3 19:00',
          planStartCalendar: '2025-01-03 16:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46362',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9228206'],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '16:00',
              planFinishDay: 'DAY3',
              planFinishTime: '19:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,2,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9228206',
              planStartFormat: 'DAY3 16:00',
              planFinishFormat: 'DAY3 19:00',
              planStartCalendar: '2025-01-03 16:00',
              planFinishCalendar: '2025-01-03 19:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '投资组完成境内流水认款',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY3',
          planStartTime: '10:00',
          planFinishDay: 'DAY3',
          planFinishTime: '19:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,3',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY3 10:00',
          planFinishFormat: 'DAY3 19:00',
          planStartCalendar: '2025-01-03 10:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46363',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9676080'],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '10:00',
              planFinishDay: 'DAY3',
              planFinishTime: '19:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,3,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9676080',
              planStartFormat: 'DAY3 10:00',
              planFinishFormat: 'DAY3 19:00',
              planStartCalendar: '2025-01-03 10:00',
              planFinishCalendar: '2025-01-03 19:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,4',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46365',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['5551881'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,4,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '5551881',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-通用',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,5',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46366',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9228206'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,5,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9228206',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-电商',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,6',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46367',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['6558558'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,6,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '6558558',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-财经',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,7',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46368',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['5100667'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,7,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '5100667',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-互娱',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,8',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46369',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['7767803'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,8,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '7767803',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-商业化',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,9',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46370',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9328852'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,9,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9328852',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-游戏医疗',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,10',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46371',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['1372633'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,10,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '1372633',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '资金结平POC确认-懂车帝',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY4',
          planStartTime: '10:00',
          planFinishDay: 'DAY4',
          planFinishTime: '11:30',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '1,11',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY4 10:00',
          planFinishFormat: 'DAY4 11:30',
          planStartCalendar: '2025-01-04 10:00',
          planFinishCalendar: '2025-01-04 11:30',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46372',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['2280611'],
              processorNames: null,
              planStartDay: 'DAY4',
              planStartTime: '10:00',
              planFinishDay: 'DAY4',
              planFinishTime: '11:30',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '1,11,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '2280611',
              planStartFormat: 'DAY4 10:00',
              planFinishFormat: 'DAY4 11:30',
              planStartCalendar: '2025-01-04 10:00',
              planFinishCalendar: '2025-01-04 11:30'
            }
          ]
        }
      ]
    },
    {
      id: null,
      processType: null,
      flowType: null,
      closingVersionId: 0,
      name: 'AP资金结账',
      processorIds: null,
      processorNames: null,
      planStartDay: 'DAY1',
      planStartTime: '10:00:00',
      planFinishDay: 'DAY6',
      planFinishTime: '00:00:00',
      conflictDesc: '',
      canEdit: false,
      canAddChildNode: false,
      canAdjustPlanStartTime: false,
      canAdjustPlanFinishTime: false,
      confirmed: false,
      timeConflict: false,
      keyNode: false,
      key: '2',
      check: {
        checked: false,
        disable: true
      },
      planStartFormat: 'DAY1 10:00:00',
      planFinishFormat: 'DAY6 00:00:00',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-06 00:00:00',
      hierarchyState: 'expand',
      children: [
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: 'OA付款-“AP待处理”手工入账',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY1',
          planStartTime: '10:30',
          planFinishDay: 'DAY1',
          planFinishTime: '16:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,0',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY1 10:30',
          planFinishFormat: 'DAY1 16:00',
          planStartCalendar: '2025-01-01 10:30',
          planFinishCalendar: '2025-01-01 16:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46354',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '1883187'],
              processorNames: null,
              planStartDay: 'DAY1',
              planStartTime: '10:30',
              planFinishDay: 'DAY1',
              planFinishTime: '16:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,0,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 1883187',
              planStartFormat: 'DAY1 10:30',
              planFinishFormat: 'DAY1 16:00',
              planStartCalendar: '2025-01-01 10:30',
              planFinishCalendar: '2025-01-01 16:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '报销-特殊付款处理',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY1',
          planStartTime: '10:30',
          planFinishDay: 'DAY1',
          planFinishTime: '18:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,1',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY1 10:30',
          planFinishFormat: 'DAY1 18:00',
          planStartCalendar: '2025-01-01 10:30',
          planFinishCalendar: '2025-01-01 18:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46353',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['2936819', '6019793', '9063992'],
              processorNames: null,
              planStartDay: 'DAY1',
              planStartTime: '10:30',
              planFinishDay: 'DAY1',
              planFinishTime: '18:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,1,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '2936819, 6019793, 9063992',
              planStartFormat: 'DAY1 10:30',
              planFinishFormat: 'DAY1 18:00',
              planStartCalendar: '2025-01-01 10:30',
              planFinishCalendar: '2025-01-01 18:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '银行流水入账',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY1',
          planStartTime: '10:30',
          planFinishDay: 'DAY1',
          planFinishTime: '19:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,2',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY1 10:30',
          planFinishFormat: 'DAY1 19:00',
          planStartCalendar: '2025-01-01 10:30',
          planFinishCalendar: '2025-01-01 19:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46356',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '9063992', '1883187'],
              processorNames: null,
              planStartDay: 'DAY1',
              planStartTime: '10:30',
              planFinishDay: 'DAY1',
              planFinishTime: '19:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,2,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 9063992, 1883187',
              planStartFormat: 'DAY1 10:30',
              planFinishFormat: 'DAY1 19:00',
              planStartCalendar: '2025-01-01 10:30',
              planFinishCalendar: '2025-01-01 19:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '第三方流水入账',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY2',
          planFinishTime: '14:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,3',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY2 14:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-02 14:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46357',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY2',
              planFinishTime: '14:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,3,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 1883187',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY2 14:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-02 14:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: 'OA付款处理状态检查',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY2',
          planFinishTime: '16:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,4',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY2 16:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-02 16:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46355',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY2',
              planFinishTime: '16:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,4,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 1883187',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY2 16:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-02 16:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '银行流水对账差异核对',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY2',
          planFinishTime: '16:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,5',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY2 16:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-02 16:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46358',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '9063992', '1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY2',
              planFinishTime: '15:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,5,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 9063992, 1883187',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY2 15:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-02 15:00'
            },
            {
              id: {
                closingVersionId: '1314',
                businessId: '46358',
                processorRole: 'REVIEWER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '复核人',
              processorIds: ['1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '15:00',
              planFinishDay: 'DAY2',
              planFinishTime: '16:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,5,1',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '1883187',
              planStartFormat: 'DAY2 15:00',
              planFinishFormat: 'DAY2 16:00',
              planStartCalendar: '2025-01-02 15:00',
              planFinishCalendar: '2025-01-02 16:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '营收平台差异池核对',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY2',
          planFinishTime: '18:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,6',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY2 18:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-02 18:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46360',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '9063992', '1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY2',
              planFinishTime: '18:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,6,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 9063992, 1883187',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY2 18:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-02 18:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '第三方流水对账差异核对',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY2',
          planStartTime: '10:30',
          planFinishDay: 'DAY2',
          planFinishTime: '19:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '2,7',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY2 10:30',
          planFinishFormat: 'DAY2 19:00',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-02 19:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46359',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['3530170', '6019793', '3139068', '5280758', '2936819', '1293750', '1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '10:30',
              planFinishDay: 'DAY2',
              planFinishTime: '18:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,7,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '3530170, 6019793, 3139068, 5280758, 2936819, 1293750, 1883187',
              planStartFormat: 'DAY2 10:30',
              planFinishFormat: 'DAY2 18:00',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-02 18:00'
            },
            {
              id: {
                closingVersionId: '1314',
                businessId: '46359',
                processorRole: 'REVIEWER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '复核人',
              processorIds: ['1883187'],
              processorNames: null,
              planStartDay: 'DAY2',
              planStartTime: '18:00',
              planFinishDay: 'DAY2',
              planFinishTime: '19:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '2,7,1',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '1883187',
              planStartFormat: 'DAY2 18:00',
              planFinishFormat: 'DAY2 19:00',
              planStartCalendar: '2025-01-02 18:00',
              planFinishCalendar: '2025-01-02 19:00'
            }
          ]
        }
      ]
    },
    {
      id: null,
      processType: null,
      flowType: null,
      closingVersionId: 0,
      name: '认款平台操作',
      processorIds: null,
      processorNames: null,
      planStartDay: 'DAY1',
      planStartTime: '10:00:00',
      planFinishDay: 'DAY15',
      planFinishTime: '00:00:00',
      conflictDesc: '',
      canEdit: false,
      canAddChildNode: false,
      canAdjustPlanStartTime: false,
      canAdjustPlanFinishTime: false,
      confirmed: false,
      timeConflict: false,
      keyNode: false,
      key: '3',
      check: {
        checked: false,
        disable: true
      },
      planStartFormat: 'DAY1 10:00:00',
      planFinishFormat: 'DAY15 00:00:00',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-17 00:00:00',
      hierarchyState: 'expand',
      children: [
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '灵枢认款推送完成',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY3',
          planStartTime: '13:00',
          planFinishDay: 'DAY3',
          planFinishTime: '14:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '3,0',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY3 13:00',
          planFinishFormat: 'DAY3 14:00',
          planStartCalendar: '2025-01-03 13:00',
          planFinishCalendar: '2025-01-03 14:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46349',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['2309865'],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '13:00',
              planFinishDay: 'DAY3',
              planFinishTime: '14:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '3,0,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '2309865',
              planStartFormat: 'DAY3 13:00',
              planFinishFormat: 'DAY3 14:00',
              planStartCalendar: '2025-01-03 13:00',
              planFinishCalendar: '2025-01-03 14:00'
            }
          ]
        },
        {
          id: null,
          processType: null,
          flowType: null,
          closingVersionId: 0,
          name: '运行认款平台测试&认证自动认款',
          processorIds: null,
          processorNames: null,
          planStartDay: 'DAY3',
          planStartTime: '14:00',
          planFinishDay: 'DAY3',
          planFinishTime: '15:00',
          conflictDesc: null,
          canEdit: false,
          canAddChildNode: false,
          canAdjustPlanStartTime: false,
          canAdjustPlanFinishTime: false,
          confirmed: false,
          timeConflict: false,
          keyNode: false,
          key: '3,1',
          check: {
            checked: false,
            disable: true
          },
          planStartFormat: 'DAY3 14:00',
          planFinishFormat: 'DAY3 15:00',
          planStartCalendar: '2025-01-03 14:00',
          planFinishCalendar: '2025-01-03 15:00',
          hierarchyState: 'expand',
          children: [
            {
              id: {
                closingVersionId: '1314',
                businessId: '46350',
                processorRole: 'REVIEWER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '复核人',
              processorIds: ['1723163'],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '15:00',
              planFinishDay: 'DAY3',
              planFinishTime: '14:10',
              conflictDesc: '计划完成时间应晚于  DAY3 15:00',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: true,
              keyNode: false,
              key: '3,1,0',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '1723163',
              planStartFormat: 'DAY3 15:00',
              planFinishFormat: 'DAY3 14:10',
              planStartCalendar: '2025-01-03 15:00',
              planFinishCalendar: '2025-01-03 14:10'
            },
            {
              id: {
                closingVersionId: '1314',
                businessId: '46350',
                processorRole: 'OWNER',
                idType: 'CUSTOM_NODE'
              },
              processType: null,
              flowType: null,
              closingVersionId: 0,
              name: '负责人',
              processorIds: ['9228206'],
              processorNames: null,
              planStartDay: 'DAY3',
              planStartTime: '14:00',
              planFinishDay: 'DAY3',
              planFinishTime: '15:00',
              conflictDesc: '',
              canEdit: false,
              canAddChildNode: false,
              canAdjustPlanStartTime: false,
              canAdjustPlanFinishTime: false,
              childItems: null,
              confirmed: false,
              timeConflict: false,
              keyNode: false,
              key: '3,1,1',
              check: {
                checked: false,
                disable: true
              },
              processorIdsFormat: '9228206',
              planStartFormat: 'DAY3 14:00',
              planFinishFormat: 'DAY3 15:00',
              planStartCalendar: '2025-01-03 14:00',
              planFinishCalendar: '2025-01-03 15:00'
            }
          ]
        }
      ]
    }
  ];

  const columns = [
    {
      headerType: 'checkbox', //指定表头单元格显示为复选框
      cellType: 'checkbox', //指定body单元格显示为复选框
      field: 'check',
      checked: true,
      width: 50
    },
    {
      field: 'name',
      title: '任务',
      width: 220,
      tree: true,
      icon: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row);
        const icon: string[] = [];
        if (record.keyNode) {
          icon.push('flag');
        }
        if (record.timeConflict) {
          icon.push('report');
        }
        if (record.canEdit) {
          icon.push('edit');
        }
        if (record.canAddChildNode) {
          icon.push('add');
        }

        return icon;
      },
      style: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row);
        return {
          // - 已确认-绿底；未确认-白底
          bgColor: record?.timeConflict ? '#f0943a' : record.confirmed ? '#63bb5c' : undefined
        };
      }
    },
    {
      field: 'processorIdsFormat',
      title: '处理人',
      width: 200
    },
    // {
    //   field: 'planStartCalendar',
    //   title: '计划开始',
    //   width: 'auto',
    //   width: 150,
    // },
    // {
    //   field: 'planFinishCalendar',
    //   title: '计划完成',
    //   width: 'auto',
    //   width: 150,
    // },
    {
      field: 'planStartFormat',
      title: '计划开始',
      width: 'auto'
    },
    {
      field: 'planFinishFormat',
      title: '计划完成',
      width: 'auto'
    }
  ];
  const option: GanttConstructorOptions = {
    overscrollBehavior: 'none',
    records: records,
    taskListTable: {
      enableTreeNodeMerge: true,
      columns,
      tableWidth: 'auto',
      theme: VTable.themes.ARCO.extends({
        // 表格外边框设置
        frameStyle: {
          borderLineWidth: 0,
          shadowBlur: 0
        },
        headerStyle: {
          hover: {
            cellBgColor: '#eef1f5'
          }
        },
        bodyStyle: {
          bgColor: '#fff',
          hover: {
            cellBgColor: 'rgba(0,0,0,0.03)'
          }
        },
        tooltipStyle: { color: '#fff', bgColor: '#202328' }
      }),
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      menu: {
        contextMenuItems: ['编辑']
      },
      frozenColCount: 1
    },
    frame: {
      outerFrameStyle: {
        borderLineWidth: 1,
        borderColor: '#e1e4e8',
        cornerRadius: 0
      },
      verticalSplitLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1
      },
      horizontalSplitLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1
      },
      verticalSplitLineMoveable: true,
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 1
      }
    },
    grid: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    headerRowHeight: 40,
    rowHeight: 40,
    taskBar: {
      startDateField: 'planStartCalendar',
      endDateField: 'planFinishCalendar',
      progressField: 'progress',
      resizable: true,
      moveable: true,
      scheduleCreatable: false,
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        textAlign: 'right',
        textOverflow: 'ellipsis',
        textBaseline: 'bottom'
      },
      barStyle: {
        width: 30,
        /** 任务条的圆角 */
        cornerRadius: 10,
        /** 任务条的边框 */
        borderWidth: 0,
        /** 边框颜色 */
        borderColor: 'black'
      },
      hoverBarStyle: {
        /** 任务条的颜色 */
        barOverlayColor: 'rgba(0,0,0,0.15)'
      },
      selectedBarStyle: {
        /** 任务条的颜色 */
        borderColor: '#000000',
        borderLineWidth: 0
      },
      customLayout
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 40,
      scales: [
        {
          unit: 'day',
          step: 1,
          startOfWeek: 'sunday',
          // format(date: TYPES.DateFormatArgumentType): string {
          //   const day = moment(new Date(date.startDate)).format('YYYY-MM-DD');
          //   const periodDay =
          //     data?.calendar?.find(_calendar => day + ' 00:00:00' === _calendar.periodTime)?.periodDay || '';
          //   return `${day} ${periodDay ? `【 ${periodDay} 】` : ''}`;
          // },
          style: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        {
          unit: 'hour',
          step: 1,
          style: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        }
      ]
    },
    // markLine: [
    //   {
    //     date: data?.markDate,
    //     scrollToMarkLine: true,
    //     position: 'left',
    //     style: {
    //       lineColor: '#e1e4e8',
    //       lineWidth: 0
    //     }
    //   }
    // ],
    scrollStyle: {
      scrollRailColor: 'RGBA(246,246,246,0.5)',
      visible: 'scrolling',
      width: 6,
      scrollSliderCornerRadius: 2,
      scrollSliderColor: '#c0c0c0'
    }
  };
  // columns:[
  //   {
  //     title:'2024-07',
  //     columns:[
  //       {
  //         title:'01'
  //       },
  //       {
  //         title:'02'
  //       },
  //       ...
  //     ]
  //   },
  //   ...
  // ]
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
  });
  ganttInstance.on('change_date_range', e => {
    console.log('change_date_range', e);
  });
  ganttInstance.on('mouseenter_task_bar', e => {
    console.log('mouseenter_taskbar', e);
  });
  ganttInstance.on('mouseleave_task_bar', e => {
    console.log('mouseleave_taskbar', e);
  });
  ganttInstance.on('click_task_bar', e => {
    console.log('click_task_bar', e);
  });
  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  ganttInstance.taskListTableInstance?.on('change_header_position_start', e => {
    console.log('change_header_position_start ', e);
  });
  ganttInstance.taskListTableInstance?.on('changing_header_position', e => {
    console.log('changing_header_position ', e);
  });
  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}
