/* eslint-disable */
import fs from 'fs';
import canvas from 'canvas';
import * as VTable from '../src/index';
import { Resvg } from '@resvg/resvg-js';

const generatePersons = count => {
  return Array.from(new Array(count)).map((_, i) => ({
    id: i + 1,
    email1: `${i + 1}@xxx.com`,
    name: `小明${i + 1}`,
    lastName: '王',
    date1: '2022年9月1日',
    tel: '000-0000-0000',
    sex: i % 2 === 0 ? 'boy' : 'girl',
    work: i % 2 === 0 ? 'back-end engineer' : 'front-end engineer',
    city: 'beijing'
  }));
};

export function createListTable() {
  const records = generatePersons(20);
  const columns: VTable.ColumnsDefine = [
    {
      field: 'id',
      title: 'ID ff',
      width: '1%',
      minWidth: 200,
      sort: true
    },
    {
      field: 'email1',
      title: 'email',
      width: 200,
      sort: true
    },
    {
      title: 'full name',
      columns: [
        {
          field: 'name',
          title: 'First Name',
          width: 200
        },
        {
          field: 'name',
          title: 'Last Name',
          width: 200
        }
      ]
    },
    {
      field: 'date1',
      title: 'birthday',
      width: 200
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
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    // pixelRatio: 2,

    // for nodejs
    mode: 'node',
    modeParams: {
      createCanvas: canvas.createCanvas,
      createImageData: canvas.createImageData,
      loadImage: canvas.loadImage,
      Resvg: Resvg
    },
    canvasWidth: 1000,
    canvasHeight: 700
  };
  const tableInstance = new VTable.ListTable(option);

  const buffer = tableInstance.getImageBuffer();
  fs.writeFileSync(`${__dirname}/list-table.png`, buffer);
}
