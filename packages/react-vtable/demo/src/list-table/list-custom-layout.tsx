import { useEffect, useState } from 'react';
import * as VTable from '../../../../vtable/src/index';
import { ListTable, ListColumn } from '../../../src';

const VGroup = VTable.VGroup;
const VText = VTable.VText;
const VImage = VTable.VImage;
const VTag = VTable.VTag;

type FieldData = { value: string; label: string };

function App() {
  const records = new Array(10).fill(['John', 18, 'male', '🏀']);

  return (
    <ListTable records={records} height={500} defaultRowHeight={80}>
      <ListColumn field={'0'} title={'name'} />
      <ListColumn field={'1'} title={'age'} />
      <ListColumn field={'2'} title={'gender'} />
      <ListColumn
        field={'3'}
        title={'hobby'}
        customLayout={args => {
          const fieldData = [
            {
              value: 'a',
              label: 'a'
            },
            {
              value: 'b',
              label: 'b'
            }
          ];
          const { table, row, col, rect } = args;
          const { height, width } = rect || table.getCellRect(col, row);
          // const jsx = jsx;

          const singlechoiceField = (fieldData: FieldData[] = [], width: number) => {
            return (
              <VGroup
                attribute={{
                  width,
                  height,
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  alignContent: 'center'
                }}
              >
                {fieldData.map(item => {
                  return (
                    row !== 2 && (
                      // <VTag
                      //   key={item.value}
                      //   attribute={{
                      //     text: 'item.label',
                      //     textStyle: {
                      //       fontSize: 14,
                      //       ellipsis: true
                      //     },
                      //     panel: {
                      //       visible: true,
                      //       cornerRadius: 4
                      //     },
                      //     // boundsPadding: [0,4,0, 4],
                      //     boundsPadding: [0, 8, 8, 0]
                      //   }}
                      // ></VTag>
                      <VText
                        key={item.value}
                        attribute={{
                          text: 'item.label',
                          fill: '#000'
                        }}
                        stateProxy={stateName => {
                          if (stateName === 'hover') {
                            return {
                              fill: 'red'
                            };
                          }
                        }}
                        onMouseEnter={event => {
                          event.currentTarget.addState('hover', true, false);
                          event.currentTarget.stage.renderNextFrame();
                        }}
                        onMouseLeave={event => {
                          event.currentTarget.removeState('hover', false);
                          event.currentTarget.stage.renderNextFrame();
                        }}
                      ></VText>
                    )
                  );
                })}
              </VGroup>
            );
          };

          const container = singlechoiceField(fieldData, width);

          // decode(container)
          return {
            rootContainer: container,
            renderDefault: false
          };
        }}
      />
    </ListTable>
  );
}

export default App;
