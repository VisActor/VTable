import * as VTable from '../../src';
const PivotTable = VTable.PivotTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  const option = {
    records: [
      {
        fldPv4llJC_SUM: '{"text":"1","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"1"}',
        original: {
          fldPv4llJC_SUM: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'fldPv4llJC_SUM'
          },
          fldpt0upgC: {
            value: '1',
            text: '1',
            groupKey: '1',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '1',
            text: '1',
            groupKey: '1',
            fldKey: 'fldY2kZIri'
          }
        },
        fldpt0upgC: '{"text":"1","fldKey":"fldpt0upgC","groupKey":"1"}',
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"1","fldKey":"fldY2kZIri","groupKey":"1"}'
      },
      {
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}',
        original: {
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          },
          fldpt0upgC: {
            value: '2',
            text: '2',
            groupKey: '2',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '2',
            text: '2',
            groupKey: '2',
            fldKey: 'fldY2kZIri'
          }
        },
        fldpt0upgC: '{"text":"2","fldKey":"fldpt0upgC","groupKey":"2"}',
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"2","fldKey":"fldY2kZIri","groupKey":"2"}'
      },
      {
        fldpt0upgC: '{"text":"3","fldKey":"fldpt0upgC","groupKey":"3"}',
        original: {
          fldpt0upgC: {
            value: '3',
            text: '3',
            groupKey: '3',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}'
      },
      {
        fldpt0upgC: '{"text":"4","fldKey":"fldpt0upgC","groupKey":"4"}',
        original: {
          fldpt0upgC: {
            value: '4',
            text: '4',
            groupKey: '4',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 1,
            text: '1',
            formatString: '',
            groupKey: '1',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"1","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"1"}'
      },
      {
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        original: {
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          },
          fldpt0upgC: {
            value: '5',
            text: '5',
            groupKey: '5',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          }
        },
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}',
        fldpt0upgC: '{"text":"5","fldKey":"fldpt0upgC","groupKey":"5"}',
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}'
      },
      {
        fldpt0upgC: '{"text":"6","fldKey":"fldpt0upgC","groupKey":"6"}',
        original: {
          fldpt0upgC: {
            value: '6',
            text: '6',
            groupKey: '6',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}'
      },
      {
        fldpt0upgC: '{"text":"7","fldKey":"fldpt0upgC","groupKey":"7"}',
        original: {
          fldpt0upgC: {
            value: '7',
            text: '7',
            groupKey: '7',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}'
      },
      {
        fldpt0upgC: '{"text":"8","fldKey":"fldpt0upgC","groupKey":"8"}',
        original: {
          fldpt0upgC: {
            value: '8',
            text: '8',
            groupKey: '8',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}'
      },
      {
        fldpt0upgC: '{"text":"","fldKey":"fldpt0upgC","groupKey":""}',
        original: {
          fldpt0upgC: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldpt0upgC'
          },
          fldBSOxbIR: {
            value: '',
            text: '',
            groupKey: null,
            fldKey: 'fldBSOxbIR'
          },
          fldY2kZIri: {
            value: '',
            text: '',
            groupKey: '',
            fldKey: 'fldY2kZIri'
          },
          fldPv4llJC_SUM: {
            value: 0,
            text: '0',
            formatString: '',
            groupKey: '0',
            fldKey: 'fldPv4llJC_SUM'
          }
        },
        fldBSOxbIR: '{"text":"","fldKey":"fldBSOxbIR","groupKey":null}',
        fldY2kZIri: '{"text":"","fldKey":"fldY2kZIri","groupKey":""}',
        fldPv4llJC_SUM: '{"text":"0","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"0"}'
      },
      {
        fldPv4llJC_SUM: '{"text":"2","formatString":"","fldKey":"fldPv4llJC_SUM","groupKey":"2"}',
        original: {
          fldPv4llJC_SUM: {
            value: 2,
            text: '2',
            formatString: '',
            groupKey: '2',
            fldKey: 'fldPv4llJC_SUM'
          }
        }
      }
    ],
    rows: [
      {
        dimensionKey: 'fldpt0upgC',
        title: '文本',
        groupType: 'RAW',
        fieldId: 'fldpt0upgC',
        width: 'auto',
        minWidth: 90
      },
      {
        dimensionKey: 'fldBSOxbIR',
        title: '单选',
        groupType: 'RAW',
        fieldId: 'fldBSOxbIR',
        width: 'auto',
        minWidth: 90
      },
      {
        dimensionKey: 'fldY2kZIri',
        title: 'xx',
        groupType: 'RAW',
        fieldId: 'fldY2kZIri',
        width: 'auto',
        minWidth: 90
      }
    ],
    columns: [],
    indicators: [
      {
        indicatorKey: 'fldPv4llJC_SUM',
        title: '计数：日期',
        fieldId: 'fldPv4llJC',
        statType: 'COUNT',
        width: 'auto',
        minWidth: 90
      }
    ],
    dataConfig: {
      aggregationRules: [
        {
          indicatorKey: 'fldPv4llJC_SUM',
          field: 'fldPv4llJC_SUM',
          aggregationType: 'NONE'
        }
      ],
      sortRules: [
        {
          sortField: 'fldPv4llJC',
          sortType: 'asc'
        }
      ],
      totals: {
        row: {
          showGrandTotals: true,
          showGrandTotalsOnTop: true,
          grandTotalLabel: 'GrandRowTotalKey'
        },
        column: {
          showGrandTotals: true,
          showGrandTotalsOnLeft: false,
          grandTotalLabel: 'GrandColumnTotalKey'
        }
      }
    },

    frozenColCount: 3,
    defaultRowHeight: 32,
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textStick: false
      }
    },
    widthMode: 'autoWidth',
    rowHierarchyIndent: 20,
    rowHierarchyTextStartAlignment: true,
    hideIndicatorName: false,
    select: {
      blankAreaClickDeselect: false
    },
    limitMaxAutoWidth: 370,
    autoFillWidth: false,
    tooltip: {
      isShowOverflowTextTooltip: true,
      renderMode: 'html',
      confine: true
    },
    columnWidthConfigForRowHeader: [
      {
        dimensions: [
          {
            dimensionKey: 'fldpt0upgC',
            value: 'GrandRowTotalKey',
            role: 'grand-total'
          },
          {
            dimensionKey: 'fldBSOxbIR',
            value: 'GrandRowTotalKey',
            role: 'grand-total'
          }
        ],
        width: 90
      }
    ]
  };

  const instance = new PivotTable(document.getElementById(CONTAINER_ID)!, option);
  window.tableInstance = instance;

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
