<template>
  <vue-pivot-table :options="tableOptions" @onTreeHierarchyStateChange="onTreeHierarchyStateChange" ref="pivotTableRef" />
</template>

<script setup>
import { ref, onMounted } from 'vue';

const tableOptions = ref({});

const pivotTableRef = ref(null);

const fetchAndSetData = async () => {
  const res = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-en.json');
  const data = await res.json();

  const option = {
    records: data,
    rowTree: [
      {
        dimensionKey: '220524114340021',
        value: 'office supplies',
        children: true
      },
      {
        dimensionKey: '220524114340021',
        value: 'Furniture',
        children: [
          {
            dimensionKey: '220524114340022',
            value: 'Company'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Consumer'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Small business'
          }
        ]
      },
      {
        dimensionKey: '220524114340021',
        value: 'Catering',
        children: [
          {
            dimensionKey: '220524114340022',
            value: 'Company'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Consumer'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Small business'
          }
        ]
      },
      {
        dimensionKey: '220524114340021',
        value: 'technology',
        children: [
          {
            dimensionKey: '220524114340022',
            value: 'Company'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Consumer'
          },
          {
            dimensionKey: '220524114340022',
            value: 'Small business'
          }
        ]
      }
    ],
    columnTree: [
      {
        dimensionKey: '220524114340020',
        value: 'northeast',
        children: [
          {
            dimensionKey: '220524114340031',
            value: 'heilongjiang',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'jilin',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'liaoning',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          }
        ]
      },
      {
        dimensionKey: '220524114340020',
        value: 'North China',
        children: [
          {
            dimensionKey: '220524114340031',
            value: 'Inner Mongolia',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'Beijing',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'tianjin',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          }
        ]
      },
      {
        dimensionKey: '220524114340020',
        value: 'Middle-of-south',
        children: [
          {
            dimensionKey: '220524114340031',
            value: 'Guangdong',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'Guangxi',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          },
          {
            dimensionKey: '220524114340031',
            value: 'Hunan',
            children: [
              {
                indicatorKey: '220524114340013',
                value: 'Sales'
              },
              {
                indicatorKey: '220524114340014',
                value: 'Profit'
              }
            ]
          }
        ]
      }
    ],
    rows: [
      {
        dimensionKey: '220524114340021',
        title: 'Category / Subdivision / Mailing method',
        headerFormat(value) {
          return `${value}`;
        },
        width: 200,
        headerStyle: {
          cursor: 'help',
          textAlign: 'center',
          borderColor: 'blue',
          color: 'purple',
          textStick: true,
          bgColor: '#6cd26f'
        }
      },
      {
        dimensionKey: '220524114340022',
        title: 'Sub-Category',
        headerStyle: {
          textAlign: 'left',
          color: 'blue',
          bgColor: '#45b89f'
        }
      },
      {
        dimensionKey: '220524114340023',
        title: 'Mailing method',
        headerStyle: {
          textAlign: 'left',
          color: 'white',
          bgColor: '#6699ff'
        }
      },
      {
        dimensionKey: '2205241143400232',
        title: 'Mailing method-1'
      }
    ],
    columns: [
      {
        dimensionKey: '220524114340020',
        title: 'Region',
        headerStyle: {
          textAlign: 'right',
          borderColor: 'blue',
          color: 'yellow',
          textStick: true,
          bgColor(arg) {
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
            ) {
              return '#bd422a';
            }
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
            ) {
              return '#ff9900';
            }
            return 'gray';
          }
        }
      },
      {
        dimensionKey: '220524114340031',
        title: 'Province'
      }
    ],
    indicators: [
      {
        indicatorKey: '220524114340013',
        title: 'Sales',
        width: 'auto',
        format(value, col, row, table) {
          if (!value) {
            return '--';
          }
          return Math.floor(parseFloat(value));
        },
        headerStyle: {
          color: 'red',
          bgColor(arg) {
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
            ) {
              return '#bd422a';
            }
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
            ) {
              return '#ff9900';
            }
            return 'gray';
          }
        }
      },
      {
        indicatorKey: '220524114340014',
        title: 'Profit',
        format(value) {
          if (!value) {
            return '--';
          }
          return Math.floor(parseFloat(value));
        },
        width: 'auto',
        headerStyle: {
          bgColor(arg) {
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'northeast'
            ) {
              return '#bd422a';
            }
            if (
              arg.cellHeaderPaths.colHeaderPaths &&
              'value' in arg.cellHeaderPaths.colHeaderPaths[0] &&
              arg.cellHeaderPaths.colHeaderPaths[0].value === 'North China'
            ) {
              return '#ff9900';
            }
            return 'gray';
          }
        }
      }
    ],
    corner: {
      titleOnDimension: 'row',
      headerStyle: {
        textAlign: 'center',
        borderColor: 'red',
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
        lineHeight: 20,
        fontFamily: 'Arial'
      }
    },
    heightMode: 'autoHeight',
    autoWrapText: true,
    widthMode: 'standard',
    rowHierarchyType: 'tree',
    rowHierarchyIndent: 20,
    // theme: VTable.themes.ARCO,
    dragHeaderMode: 'all'
  };

  tableOptions.value = option;
};

const onTreeHierarchyStateChange = (args) => {
  // debugger;
  const tableInstance = pivotTableRef.value.vTableInstance;

  // if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && args.originData.children === true) {// bug 
  if (args.originData.children === true) {
    setTimeout(async () => {
      let children;
      let newData;
      if (args.originData.dimensionKey === '220524114340021' && args.originData.value === 'office supplies') {
        const res = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-add-1-en.json');
        newData = await res.json();
        children = [
          {
            dimensionKey: '220524114340022',
            value: 'Company',
            children: [
              {
                dimensionKey: '220524114340023',
                value: 'Level 1',
                children: [
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 1'
                  },
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 2'
                  },
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 3'
                  }
                ]
              },
              {
                dimensionKey: '220524114340023',
                value: 'Level 2',
                children: [
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 1'
                  },
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 2'
                  },
                  {
                    dimensionKey: '2205241143400232',
                    value: 'Level 3'
                  }
                ]
              },
              {
                dimensionKey: '220524114340023',
                value: 'Level 3'
              }
            ]
          },
          {
            dimensionKey: '220524114340022',
            value: 'Consumer',
            children: true
          },
          {
            dimensionKey: '220524114340022',
            value: 'Small business'
          }
        ];

        tableInstance.setTreeNodeChildren(children, newData, args.col, args.row);
      } else if (args.originData.dimensionKey === '220524114340022' && args.originData.value === 'Consumer') {
        const res = await fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/pivot-tree-lazy-load-add-2-en.json');
        newData = await res.json();
        children = [
          {
            dimensionKey: '220524114340023',
            value: 'Level 1'
          },
          {
            dimensionKey: '220524114340023',
            value: 'Level 1'
          },
          {
            dimensionKey: '220524114340023',
            value: 'Level 3'
          }
        ];
        tableInstance.setTreeNodeChildren(children, newData, args.col, args.row);
      }
    }, 10);
  }
};

onMounted(fetchAndSetData);
</script>
