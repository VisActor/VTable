import * as VTable from '@visactor/vtable';
import { bindDebugTool } from '@visactor/vtable/es/scenegraph/debug-tool';
import { TableCarouselAnimationPlugin } from '../../src';
const CONTAINER_ID = 'vTable';

export function createTable() {
  const tca = new TableCarouselAnimationPlugin({
    rowCount: 1,
    // colCount: 2,
    autoPlay: true,
    autoPlayDelay: 1000
  });
  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: '0#LINE_NUMBER_DIM_ID_STR',
        title: '序号',
        width: '15%',
        style: {
          fontFamily: 'D-DIN',
          fontWeight: 'normal',
          fontSize: 12,
          color: '#000'
        }
      },
      {
        field: 'PZwFghHcsvwt',
        title: 'From Province',
        showSort: false,
        style: {
          textAlign: 'center',
          borderColor: ['rgba(63,63,86,0)', null, null, null],
          borderLineWidth: [1, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(186, 215, 255, 0.7)',
            inlineRowBgColor: 'rgba(186, 215, 255, 0.3)',
            inlineColumnBgColor: 'rgba(186, 215, 255, 0.3)'
          },
          fontFamily: 'D-DIN',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontVariant: 'normal',
          color: '#000',
          lineHeight: 18,
          underline: false
        },
        headerStyle: {
          textAlign: 'center',
          borderColor: [null, null, null, null],
          borderLineWidth: [null, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(0, 100, 250, 0.16)',
            inlineRowBgColor: 'rgba(255, 255, 255, 0)',
            inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
          },
          frameStyle: {
            borderColor: [null, null, null, null],
            borderLineWidth: 2
          },
          fontFamily: 'SourceHanSansCN-Normal',
          fontSize: 12,
          fontVariant: 'normal',
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#FFFFFF',
          bgColor: '#0e305c',
          lineHeight: 18,
          underline: false
        },
        hide: false,
        width: '28.333333333333332%'
      },
      {
        field: 'CKQPX3dQXKYk',
        title: 'To Province',
        showSort: false,
        style: {
          textAlign: 'center',
          borderColor: ['rgba(63,63,86,0)', null, null, null],
          borderLineWidth: [1, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(186, 215, 255, 0.7)',
            inlineRowBgColor: 'rgba(186, 215, 255, 0.3)',
            inlineColumnBgColor: 'rgba(186, 215, 255, 0.3)'
          },
          fontFamily: 'D-DIN',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontVariant: 'normal',
          color: '#000',
          lineHeight: 18,
          underline: false
        },
        headerStyle: {
          textAlign: 'center',
          borderColor: [null, null, null, null],
          borderLineWidth: [null, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(0, 100, 250, 0.16)',
            inlineRowBgColor: 'rgba(255, 255, 255, 0)',
            inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
          },
          frameStyle: {
            borderColor: [null, null, null, null],
            borderLineWidth: 2
          },
          fontFamily: 'SourceHanSansCN-Normal',
          fontSize: 12,
          fontVariant: 'normal',
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#FFFFFF',
          bgColor: '#0e305c',
          lineHeight: 18,
          underline: false
        },
        hide: false,
        width: '28.333333333333332%'
      },
      {
        firstRow: 20,
        field: 'RMLcpglcOTHo',
        title: 'Profit',
        showSort: false,
        style: {
          textAlign: 'center',
          borderColor: ['rgba(63,63,86,0)', null, null, null],
          borderLineWidth: [1, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(186, 215, 255, 0.7)',
            inlineRowBgColor: 'rgba(186, 215, 255, 0.3)',
            inlineColumnBgColor: 'rgba(186, 215, 255, 0.3)'
          },
          fontFamily: 'D-DIN',
          fontSize: 12,
          fontStyle: 'normal',
          fontWeight: 'normal',
          fontVariant: 'normal',
          color: '#000',
          lineHeight: 18,
          underline: false
        },
        headerStyle: {
          textAlign: 'center',
          borderColor: [null, null, null, null],
          borderLineWidth: [null, 0, 0, 0],
          borderLineDash: [null, null, null, null],
          padding: [0, 0, 0, 0],
          hover: {
            cellBgColor: 'rgba(0, 100, 250, 0.16)',
            inlineRowBgColor: 'rgba(255, 255, 255, 0)',
            inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
          },
          frameStyle: {
            borderColor: [null, null, null, null],
            borderLineWidth: 2
          },
          fontFamily: 'SourceHanSansCN-Normal',
          fontSize: 12,
          fontVariant: 'normal',
          fontStyle: 'normal',
          fontWeight: 'bold',
          color: '#FFFFFF',
          bgColor: '#0e305c',
          lineHeight: 18,
          underline: false
        },
        hide: false,
        width: '28.333333333333332%'
      }
    ],
    records: [
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '江西',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 44,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 6,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山东',
        CKQPX3dQXKYk: '福建',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 7,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河南',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 65,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 8,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖北',
        CKQPX3dQXKYk: '江西',
        RMLcpglcOTHo: 40,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 9,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '湖南',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 35,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 10,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '河北',
        CKQPX3dQXKYk: '河南',
        RMLcpglcOTHo: 20,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 1,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '山西',
        CKQPX3dQXKYk: '湖北',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 2,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '内蒙古',
        CKQPX3dQXKYk: '湖南',
        RMLcpglcOTHo: 50,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 3,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '辽宁',
        CKQPX3dQXKYk: '广东',
        RMLcpglcOTHo: 15,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 4,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      },
      {
        PZwFghHcsvwt: '吉林',
        CKQPX3dQXKYk: '广西',
        RMLcpglcOTHo: 57,
        '0#SCROLL_LOOP_TAG': true,
        '0#LINE_NUMBER_DIM_ID_STR': 5,
        '0#LINE_NUMBER_ICON':
          '<svg width="1em" height="1em" viewBox="0 0 1024 1024" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M512 954.181818a442.181818 442.181818 0 1 0 0-884.363636 442.181818 442.181818 0 0 0 0 884.363636z"/></svg>'
      }
    ],
    theme: {
      underlayBackgroundColor: 'rgba(0,0,0,1)',
      scrollStyle: {
        visible: 'none',
        width: 7,
        hoverOn: true
      },
      selectionStyle: {
        cellBorderColor: '#3073F2',
        cellBorderLineWidth: 0,
        cellBgColor: 'rgba(0, 0, 0, 1)',
        inlineRowBgColor: 'rgba(0, 0, 0, 1)',
        inlineColumnBgColor: 'rgba(0, 0, 0, 1)'
      },
      frameStyle: {
        borderLineWidth: 0
      },
      headerStyle: {
        borderColor: [null, null, null, null],
        borderLineWidth: [null, 0, 0, 0],
        borderLineDash: [null, null, null, null],
        padding: [0, 0, 0, 0],
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        frameStyle: {
          borderColor: [null, null, null, null],
          borderLineWidth: 0
        },
        fontFamily: 'SourceHanSansCN-Normal',
        fontSize: 12,
        fontVariant: 'normal',
        fontStyle: 'normal',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        bgColor: '#0e305c',
        lineHeight: 18,
        underline: false,
        select: {
          inlineRowBgColor: 'rgba(0,0,0,0)',
          inlineColumnBgColor: 'rgba(0,0,0,0)'
        }
      },
      rowHeaderStyle: {
        borderColor: [null, null, null, null],
        borderLineWidth: [null, 0, 0, 0],
        borderLineDash: [null, null, null, null],
        padding: [0, 0, 0, 0],
        hover: {
          cellBgColor: 'rgba(0, 100, 250, 0.16)',
          inlineRowBgColor: 'rgba(255, 255, 255, 0)',
          inlineColumnBgColor: 'rgba(255, 255, 255, 0)'
        },
        frameStyle: {
          borderColor: [null, null, null, null],
          borderLineWidth: 2
        },
        fontFamily: 'SourceHanSansCN-Normal',
        fontSize: 12,
        fontVariant: 'normal',
        fontStyle: 'normal',
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#FFFFFF',
        bgColor: '#0e305c',
        lineHeight: 18,
        underline: false
      },
      bodyStyle: {
        borderColor: ['rgba(63,63,86,0)', null, null, null],
        borderLineWidth: [1, 0, 0, 0],
        borderLineDash: [null, null, null, null],
        padding: [0, 0, 0, 0],
        fontFamily: 'D-DIN',
        fontSize: 12,
        fontStyle: 'normal',
        fontWeight: 'normal',
        textAlign: 'center',
        fontVariant: 'normal',
        color: 'rgba(0,0,0,1)',
        lineHeight: 18,
        underline: false
      },
      frozenColumnLine: {
        shadow: {
          width: 0,
          startColor: 'rgba(255,255,255,0)',
          endColor: 'rgba(255,255,255,0)'
        }
      }
    },
    transpose: false,
    widthMode: 'adaptive',
    columnResizeMode: 'all',
    heightMode: 'standard',
    heightAdaptiveMode: 'all',
    autoFillHeight: true,
    autoWrapText: true,
    maxCharactersNumber: 256,
    defaultHeaderColWidth: 'auto',
    keyboardOptions: {
      selectAllOnCtrlA: true,
      copySelected: false
    },
    menu: {
      renderMode: 'html'
    },
    disableScroll: true,
    customConfig: {
      _disableColumnAndRowSizeRound: true,
      imageMargin: 4,
      multilinesForXTable: true,
      shrinkSparklineFirst: true,
      limitContentHeight: false
    },
    frozenColCount: 0,
    showHeader: true,
    hover: {
      disableHover: true
    },
    select: {
      highlightMode: 'row',
      headerSelectMode: 'cell',
      blankAreaClickDeselect: true,
      disableSelect: true
    },
    emptyTip: {
      text: '暂无数据',
      textStyle: {
        color: 'rgba(255,255,255,1)'
      },
      icon: {
        image: '',
        width: 0,
        height: 0
      }
    },
    autoHeightInAdaptiveMode: false,
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    defaultRowHeight: 37.166666666666664,
    hash: 'e7a3d044c34435301a644e67af05fa1c',
    width: 400,
    height: 223,
    plugins: [tca]
  };
  const tableInstance = new VTable.ListTable(option);
  window.tableInstance = tableInstance;

  bindDebugTool(tableInstance.scenegraph.stage, {
    customGrapicKeys: ['col', 'row']
  });
}
