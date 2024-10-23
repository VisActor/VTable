import * as VTable from '../../src';
import { bindDebugTool } from '../../src/scenegraph/debug-tool';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

export function createTable() {
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/test-demo-data/pre-sort.json')
    .then(res => res.json())
    .then(data => {
      const columns = [
        {
          field: 'id',
          title: 'ID',
          width: 80,
          sort: true
        },
        {
          field: 'email1',
          title: 'email(pre-sorted)',
          width: 250,
          sort: true
        },
        {
          field: 'hobbies',
          title: 'hobbies(unsorted)',
          width: 200,
          sort: true
        },
        {
          field: 'birthday',
          title: 'birthday',
          width: 120
        },
        {
          field: 'sex',
          title: 'sex',
          width: 100
        },
        {
          field: 'tel',
          title: 'telephone',
          width: 150
        },
        {
          field: 'work',
          title: 'job',
          width: 200
        },
        {
          field: 'city',
          title: 'city',
          width: 150
        }
      ];
      const option = {
        records: data.data,
        columns
      };
      const tableInstance = new ListTable(document.getElementById(CONTAINER_ID), option);
      window.tableInstance = tableInstance;

      data.sort.forEach(item => {
        tableInstance.setSortedIndexMap(item.key, item.value);
      });

      bindDebugTool(tableInstance.scenegraph.stage as any, {
        customGrapicKeys: ['role', '_updateTag']
      });
    })
    .catch(err => {
      // do nothing
    });
}
