import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';

const CONTAINER_ID = 'vTable';
const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' + (i + 1) : 'front-end engineer' + (i + 1),
    city: 'beijing'
  }));
};

export function createTable() {
  let tableInstance;

  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/olympic-winners.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          field: 'athlete',
          title: 'athlete',
          width: 120
        },
        {
          field: 'age',
          title: 'age'
        },
        {
          field: 'country',
          title: 'country',
          width: 240,
          headerIcon: 'filter'
        },
        { field: 'year', title: 'year', headerIcon: 'filter' },
        { field: 'sport', title: 'sport', headerIcon: 'filter' },
        {
          field: 'gold',
          title: 'gold'
        },
        {
          field: 'silver',
          title: 'silver'
        },
        {
          field: 'bronze',
          title: 'bronze'
        },
        {
          field: 'total',
          title: 'total'
        }
      ];
      const option = {
        columns,
        records: data,
        autoWrapText: true,
        heightMode: 'autoHeight',
        widthMode: 'autoWidth',
        bottomFrozenRowCount: 1,
        groupBy: 'country',
        rowSeriesNumber: {
          title: '序号',
          width: 'auto',
          headerStyle: {
            color: 'black',
            bgColor: 'pink'
          },
          style: {
            color: 'blue'
          }
        },
        theme: VTable.themes.ARCO.extends({
          bottomFrozenStyle: {
            fontFamily: 'PingFang SC',
            fontWeight: 500
          }
        })
      };
      const t0 = window.performance.now();
      tableInstance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;
      bindDebugTool(tableInstance.scenegraph.stage, { customGrapicKeys: ['col', 'row'] });
      const filterListValues = {
        country: ['all', 'China', 'United States', 'Australia'],
        year: ['all', '2004', '2008', '2012', '2016', '2020'],
        sport: ['all', 'Swimming', 'Cycling', 'Biathlon', 'Short-Track Speed Skating', 'Nordic Combined']
      };
      let filterListSelectedValues = '';
      let lastFilterField;
      tableInstance.on('icon_click', args => {
        const { col, row, name } = args;
        if (name === 'filter') {
          const field = tableInstance.getHeaderField(col, row);
          if (select && lastFilterField === field) {
            removeFilterElement();
            lastFilterField = null;
          } else if (!select || lastFilterField !== field) {
            const rect = tableInstance.getCellRelativeRect(col, row);
            createFilterElement(filterListValues[field], filterListSelectedValues, field, rect);
            lastFilterField = field;
          }
        }
      });

      const filterContainer = tableInstance.getElement();
      let select;
      function createFilterElement(values, curValue, field, positonRect) {
        // create select tag
        select = document.createElement('select');
        select.setAttribute('type', 'text');
        select.style.position = 'absolute';
        select.style.padding = '4px';
        select.style.width = '100%';
        select.style.boxSizing = 'border-box';

        // create option tags
        let opsStr = '';
        values.forEach(item => {
          opsStr +=
            item === curValue
              ? `<option value="${item}" selected>${item}</option>`
              : `<option value="${item}" >${item}</option>`;
        });
        select.innerHTML = opsStr;

        filterContainer.appendChild(select);

        select.style.top = positonRect.top + positonRect.height + 'px';
        select.style.left = positonRect.left + 'px';
        select.style.width = positonRect.width + 'px';
        select.style.height = positonRect.height + 'px';
        select.addEventListener('change', () => {
          filterListSelectedValues = select.value;
          tableInstance.updateFilterRules([
            {
              filterKey: field,
              filteredValues: select.value
            }
          ]);
          removeFilterElement();
          //更新列头icon
          columns.forEach(col => {
            if (col.field === field) {
              col.headerIcon = 'filtered';
            }
          });
          tableInstance.updateColumns(columns);
        });
      }
      function removeFilterElement() {
        filterContainer.removeChild(select);
        select.removeEventListener('change', () => {
          // this.successCallback();
        });
        select = null;
      }
    });
}
