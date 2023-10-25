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

export function createSmallTable() {
  const records = generatePersons(3);
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
    }
  ];
  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    pixelRatio: 2,

    // for nodejs
    mode: 'node',
    modeParams: {
      createCanvas: canvas.createCanvas,
      createImageData: canvas.createImageData,
      loadImage: canvas.loadImage,
      Resvg: Resvg
    },
    canvasWidth: 500,
    canvasHeight: 300
  };
  const tableInstance = new VTable.ListTable(option);

  const buffer = tableInstance.getImageBuffer();
  fs.writeFileSync(`${__dirname}/small-table.png`, buffer);
}
