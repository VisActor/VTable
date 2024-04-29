/* eslint-disable */
import * as VTable from '../../src';
import VChart from '@visactor/vchart';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';
VTable.register.chartModule('vchart', VChart);
export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      data = [
        {
          name: 'chevrolet chevelle malibu',
          milesPerGallon: 18,
          cylinders: 8,
          horsepower: 130,
          origin_country: 'USA'
        },
        {
          name: 'buick skylark 320',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 165,
          origin_country: 'USA'
        },
        {
          name: 'plymouth satellite',
          milesPerGallon: 18,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'amc rebel sst',
          milesPerGallon: 16,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'ford torino',
          milesPerGallon: 17,
          cylinders: 8,
          horsepower: 140,
          origin_country: 'USA'
        },
        {
          name: 'ford galaxie 500',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 198,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet impala',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 220,
          origin_country: 'USA'
        },
        {
          name: 'plymouth fury iii',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 215,
          origin_country: 'USA'
        },
        {
          name: 'pontiac catalina',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 225,
          origin_country: 'USA'
        },
        {
          name: 'amc ambassador dpl',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 190,
          origin_country: 'USA'
        },
        {
          name: 'citroen ds-21 pallas',
          milesPerGallon: 0,
          cylinders: 4,
          horsepower: 115,
          origin_country: 'France'
        },
        {
          name: 'chevrolet chevelle concours (sw)',
          milesPerGallon: 0,
          cylinders: 8,
          horsepower: 165,
          origin_country: 'USA'
        },
        {
          name: 'ford torino (sw)',
          milesPerGallon: 0,
          cylinders: 8,
          horsepower: 153,
          origin_country: 'USA'
        },
        {
          name: 'plymouth satellite (sw)',
          milesPerGallon: 0,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'amc rebel sst (sw)',
          milesPerGallon: 0,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'dodge challenger se',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 170,
          origin_country: 'USA'
        },
        {
          name: "plymouth 'cuda 340",
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 160,
          origin_country: 'USA'
        },
        {
          name: 'ford mustang boss 302',
          milesPerGallon: 0,
          cylinders: 8,
          horsepower: 140,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet monte carlo',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'buick estate wagon (sw)',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 225,
          origin_country: 'USA'
        },
        {
          name: 'toyota corona mark ii',
          milesPerGallon: 24,
          cylinders: 4,
          horsepower: 95,
          origin_country: 'Japan'
        },
        {
          name: 'plymouth duster',
          milesPerGallon: 22,
          cylinders: 6,
          horsepower: 95,
          origin_country: 'USA'
        },
        {
          name: 'amc hornet',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 97,
          origin_country: 'USA'
        },
        {
          name: 'ford maverick',
          milesPerGallon: 21,
          cylinders: 6,
          horsepower: 85,
          origin_country: 'USA'
        },
        {
          name: 'datsun pl510',
          milesPerGallon: 27,
          cylinders: 4,
          horsepower: 88,
          origin_country: 'Japan'
        },
        {
          name: 'volkswagen 1131 deluxe sedan',
          milesPerGallon: 26,
          cylinders: 4,
          horsepower: 46,
          origin_country: 'Germany'
        },
        {
          name: 'peugeot 504',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 87,
          origin_country: 'France'
        },
        {
          name: 'audi 100 ls',
          milesPerGallon: 24,
          cylinders: 4,
          horsepower: 90,
          origin_country: 'Germany'
        },
        {
          name: 'saab 99e',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 95,
          origin_country: 'Sweden'
        },
        {
          name: 'bmw 2002',
          milesPerGallon: 26,
          cylinders: 4,
          horsepower: 113,
          origin_country: 'Germany'
        },
        {
          name: 'amc gremlin',
          milesPerGallon: 21,
          cylinders: 6,
          horsepower: 90,
          origin_country: 'USA'
        },
        {
          name: 'ford f250',
          milesPerGallon: 10,
          cylinders: 8,
          horsepower: 215,
          origin_country: 'USA'
        },
        {
          name: 'chevy c20',
          milesPerGallon: 10,
          cylinders: 8,
          horsepower: 200,
          origin_country: 'USA'
        },
        {
          name: 'dodge d200',
          milesPerGallon: 11,
          cylinders: 8,
          horsepower: 210,
          origin_country: 'USA'
        },
        {
          name: 'hi 1200d',
          milesPerGallon: 9,
          cylinders: 8,
          horsepower: 193,
          origin_country: 'USA'
        },
        {
          name: 'datsun pl510',
          milesPerGallon: 27,
          cylinders: 4,
          horsepower: 88,
          origin_country: 'Japan'
        },
        {
          name: 'chevrolet vega 2300',
          milesPerGallon: 28,
          cylinders: 4,
          horsepower: 90,
          origin_country: 'USA'
        },
        {
          name: 'toyota corona',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 95,
          origin_country: 'Japan'
        },
        {
          name: 'ford pinto',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 0,
          origin_country: 'USA'
        },
        {
          name: 'volkswagen super beetle 117',
          milesPerGallon: 0,
          cylinders: 4,
          horsepower: 48,
          origin_country: 'Germany'
        },
        {
          name: 'amc gremlin',
          milesPerGallon: 19,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'plymouth satellite custom',
          milesPerGallon: 16,
          cylinders: 6,
          horsepower: 105,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet chevelle malibu',
          milesPerGallon: 17,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'ford torino 500',
          milesPerGallon: 19,
          cylinders: 6,
          horsepower: 88,
          origin_country: 'USA'
        },
        {
          name: 'amc matador',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet impala',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 165,
          origin_country: 'USA'
        },
        {
          name: 'pontiac catalina brougham',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'ford galaxie 500',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 153,
          origin_country: 'USA'
        },
        {
          name: 'plymouth fury iii',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'dodge monaco (sw)',
          milesPerGallon: 12,
          cylinders: 8,
          horsepower: 180,
          origin_country: 'USA'
        },
        {
          name: 'ford country squire (sw)',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 170,
          origin_country: 'USA'
        },
        {
          name: 'pontiac safari (sw)',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'amc hornet sportabout (sw)',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 110,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet vega (sw)',
          milesPerGallon: 22,
          cylinders: 4,
          horsepower: 72,
          origin_country: 'USA'
        },
        {
          name: 'pontiac firebird',
          milesPerGallon: 19,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'ford mustang',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 88,
          origin_country: 'USA'
        },
        {
          name: 'mercury capri 2000',
          milesPerGallon: 23,
          cylinders: 4,
          horsepower: 86,
          origin_country: 'USA'
        },
        {
          name: 'opel 1900',
          milesPerGallon: 28,
          cylinders: 4,
          horsepower: 90,
          origin_country: 'Germany'
        },
        {
          name: 'peugeot 304',
          milesPerGallon: 30,
          cylinders: 4,
          horsepower: 70,
          origin_country: 'France'
        },
        {
          name: 'fiat 124b',
          milesPerGallon: 30,
          cylinders: 4,
          horsepower: 76,
          origin_country: 'Italy'
        },
        {
          name: 'toyota corolla 1200',
          milesPerGallon: 31,
          cylinders: 4,
          horsepower: 65,
          origin_country: 'Japan'
        },
        {
          name: 'datsun 1200',
          milesPerGallon: 35,
          cylinders: 4,
          horsepower: 69,
          origin_country: 'Japan'
        },
        {
          name: 'volkswagen model 111',
          milesPerGallon: 27,
          cylinders: 4,
          horsepower: 60,
          origin_country: 'Germany'
        },
        {
          name: 'plymouth cricket',
          milesPerGallon: 26,
          cylinders: 4,
          horsepower: 70,
          origin_country: 'USA'
        },
        {
          name: 'toyota corona hardtop',
          milesPerGallon: 24,
          cylinders: 4,
          horsepower: 95,
          origin_country: 'Japan'
        },
        {
          name: 'dodge colt hardtop',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 80,
          origin_country: 'USA'
        },
        {
          name: 'volkswagen type 3',
          milesPerGallon: 23,
          cylinders: 4,
          horsepower: 54,
          origin_country: 'Germany'
        },
        {
          name: 'chevrolet vega',
          milesPerGallon: 20,
          cylinders: 4,
          horsepower: 90,
          origin_country: 'USA'
        },
        {
          name: 'ford pinto runabout',
          milesPerGallon: 21,
          cylinders: 4,
          horsepower: 86,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet impala',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 165,
          origin_country: 'USA'
        },
        {
          name: 'pontiac catalina',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'plymouth fury iii',
          milesPerGallon: 15,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'ford galaxie 500',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 153,
          origin_country: 'USA'
        },
        {
          name: 'amc ambassador sst',
          milesPerGallon: 17,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'mercury marquis',
          milesPerGallon: 11,
          cylinders: 8,
          horsepower: 208,
          origin_country: 'USA'
        },
        {
          name: 'buick lesabre custom',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 155,
          origin_country: 'USA'
        },
        {
          name: 'oldsmobile delta 88 royale',
          milesPerGallon: 12,
          cylinders: 8,
          horsepower: 160,
          origin_country: 'USA'
        },
        {
          name: 'ford ltd',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 158,
          origin_country: 'USA'
        },
        {
          name: 'plymouth fury gran sedan',
          milesPerGallon: 14,
          cylinders: 8,
          horsepower: 150,
          origin_country: 'USA'
        },
        {
          name: 'chrysler new yorker brougham',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 215,
          origin_country: 'USA'
        },
        {
          name: 'buick electra 225 custom',
          milesPerGallon: 12,
          cylinders: 8,
          horsepower: 225,
          origin_country: 'USA'
        },
        {
          name: 'amc ambassador brougham',
          milesPerGallon: 13,
          cylinders: 8,
          horsepower: 175,
          origin_country: 'USA'
        },
        {
          name: 'plymouth valiant',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 105,
          origin_country: 'USA'
        },
        {
          name: 'chevrolet nova custom',
          milesPerGallon: 16,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'amc hornet',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 100,
          origin_country: 'USA'
        },
        {
          name: 'ford maverick',
          milesPerGallon: 18,
          cylinders: 6,
          horsepower: 88,
          origin_country: 'USA'
        },
        {
          name: 'plymouth duster',
          milesPerGallon: 23,
          cylinders: 6,
          horsepower: 95,
          origin_country: 'USA'
        },
        {
          name: 'volkswagen super beetle',
          milesPerGallon: 26,
          cylinders: 4,
          horsepower: 46,
          origin_country: 'Germany'
        },
        // 这是最后一批数据
        {
          name: 'toyota corona',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 95,
          origin_country: 'Japan'
        },
        {
          name: 'ford pinto',
          milesPerGallon: 25,
          cylinders: 4,
          horsepower: 0,
          origin_country: 'USA'
        }
      ];
      // data=data.splice(0,260);
      const columns = [
        {
          dimensionKey: 'cylinders',
          title: 'cylinders'
        }
      ];
      const rows = [
        {
          dimensionKey: 'origin_country',
          title: 'origin_country'
        }
      ];
      const indicators = [
        {
          indicatorKey: 'milesPerGallon',
          title: 'milesPerGallon',
          cellType: 'chart',
          chartModule: 'vchart',
          chartSpec: {
            type: 'scatter',
            xField: 'milesPerGallon',
            yField: 'horsepower',

            data: {
              id: 'baseData'
            },
            tooltip: {
              dimension: {
                visible: true
              },
              mark: {
                title: true,
                content: [
                  {
                    key: d => d.name,
                    value: d => d.y
                  }
                ]
              }
            },
            crosshair: {
              yField: {
                visible: true,
                line: {
                  visible: true,
                  type: 'line'
                },
                label: {
                  visible: true // label 默认关闭
                }
              },
              xField: {
                visible: true,
                line: {
                  visible: true,
                  type: 'line'
                },
                label: {
                  visible: true // label 默认关闭
                }
              }
            },
            axes: [
              {
                title: {
                  visible: true,
                  text: 'Horse Power'
                },
                orient: 'left',
                range: { min: 0 },
                type: 'linear',
                innerOffset: {
                  left: 4,
                  right: 4,
                  top: 4,
                  bottom: 4
                }
              },
              {
                title: {
                  visible: true,
                  text: 'Miles Per Gallon'
                },
                orient: 'bottom',
                label: { visible: true },
                type: 'linear',
                innerOffset: {
                  left: 4,
                  right: 4,
                  top: 4,
                  bottom: 4
                }
              }
            ]
          },
          style: {
            padding: 1
          }
        }
      ];
      const option = {
        // hideIndicatorName: true,
        // indicatorsAsCol:false,
        rows,
        columns,
        indicators,
        records: data,
        defaultRowHeight: 200,
        defaultHeaderRowHeight: 50,
        defaultColWidth: 280,
        defaultHeaderColWidth: 100,
        indicatorTitle: '指标',
        autoWrapText: true,
        // widthMode: 'adaptive',
        // heightMode: 'adaptive',
        corner: {
          titleOnDimension: 'row',
          headerStyle: {
            autoWrapText: true
          }
        },

        pagination: {
          currentPage: 0,
          perPageCount: 8
        }
      };
      const tableInstance = new VTable.PivotChart(document.getElementById(CONTAINER_ID), option);
      tableInstance.onVChartEvent('click', args => {
        console.log('onVChartEvent click', args);
      });
      tableInstance.onVChartEvent('mouseover', args => {
        console.log('onVChartEvent mouseover', args);
      });
      window.tableInstance = tableInstance;

      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });

      window.update = () => {
        theme.cornerLeftBottomCellStyle.borderColor = 'red';
        tableInstance.updateTheme(theme);
      };
    });
}
