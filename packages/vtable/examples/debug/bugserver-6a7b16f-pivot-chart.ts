import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
const GET_CELL_ADDRESS_ERROR_MESSAGE =
  "Cannot destructure property 'col' of 'getCellAddressByRecord(...)' as it is undefined.";

class BugserverChart {
  spec: any;
  stage = {
    viewWidth: 600,
    viewHeight: 371,
    window: {
      dpr: 1,
      getContext() {
        return {};
      },
      getViewBoxTransform() {
        return {
          a: 1,
          b: 0,
          c: 0,
          d: 1,
          e: 0,
          f: 0,
          clone() {
            return {
              a: 1,
              b: 0,
              c: 0,
              d: 1,
              e: 0,
              f: 0,
              multiply() {
                return this;
              }
            };
          }
        };
      },
      setViewBoxTransform() {
        // noop
      }
    },
    enableDirtyBounds() {
      // noop
    },
    renderTo() {
      // noop
    }
  };

  constructor(spec: any) {
    this.spec = spec;
  }

  renderSync() {
    this.spec?.label?.dataFilter?.([{ data: this.spec.data.values[0] }]);
  }

  getStage() {
    return this.stage;
  }

  getChart() {
    return {
      setLayoutTag() {
        // noop
      }
    };
  }

  getSpec() {
    return this.spec;
  }

  updateViewBox() {
    // noop
  }

  updateDataSync() {
    // noop
  }

  updateFullDataSync() {
    // noop
  }

  updateSpecSync(spec: any) {
    this.spec = spec;
  }

  updateModelSpec() {
    // noop
  }

  updateModelSpecSync() {
    // noop
  }

  updateState() {
    // noop
  }

  on() {
    // noop
  }

  disableTooltip() {
    // noop
  }

  release() {
    // noop
  }
}

VTable.register.chartModule('bugserver-chart', BugserverChart);

export function createTable() {
  const width = 600;
  const height = width / 1.618;
  const instanceRef: { current?: VTable.PivotChart } = {};

  const records = [
    {
      '10001': '求和(qps)的总额百分比',
      '10002': '0.001031658322960409623206456697',
      '10003': '260622161148168',
      '20001': '求和(qps)的总额百分比',
      '260622161148168': '0.001031658322960409623206456697',
      '260624121706060': '05_[0.5]',
      '260811200516176': '直播'
    }
  ];

  const option: VTable.PivotChartConstructorOptions = {
    records,
    disableInteraction: true,
    rows: [],
    columns: [{ dimensionKey: '260811200516176', title: '体裁' }],
    indicatorsAsCol: false,
    rowTree: [{ indicatorKey: '10002', value: '' }],
    columnTree: [{ dimensionKey: '260811200516176', value: '直播' }],
    indicators: [
      {
        indicatorKey: '10002',
        cellType: 'chart',
        chartModule: 'bugserver-chart',
        chartSpec: {
          type: 'bar',
          xField: '260811200516176',
          yField: '10002',
          data: {
            values: records
          },
          label: {
            dataFilter(labels: { data: Record<string, unknown> }[]) {
              const cellAddress = instanceRef.current?.getCellAddressByRecord(labels[0].data);
              if (!cellAddress) {
                throw new TypeError(GET_CELL_ADDRESS_ERROR_MESSAGE);
              }
              return instanceRef.current?.getCellValue(cellAddress.col, cellAddress.row) ?? labels;
            }
          }
        }
      }
    ]
  };

  const dom = document.getElementById(CONTAINER_ID)!;
  dom.style.width = `${width}px`;
  dom.style.height = `${height}px`;

  const instance = new VTable.PivotChart(dom, option);
  instanceRef.current = instance;
  window.tableInstance = instance;
  instance.updateOption(option);

  bindDebugTool(instance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
}
