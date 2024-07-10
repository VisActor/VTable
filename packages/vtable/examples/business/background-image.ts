/* eslint-disable */
import { ListTableConstructorOptions } from '../../cjs/ts-types';
import * as VTable from '../../src';
import { theme } from '../../src/register';
const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';
function getBackgroundColor(args): string {
  const { row, table } = args;
  const index = row - table.frozenRowCount;
  if (!(index & 1)) {
    return 'rgba(255,255,255,0.2)';
  }
  return 'rgba(255,255,255,0.5)';
}
export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  container!.style.padding = '50px';
  container!.style.backgroundImage = `url('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/background-image-music.jpeg')`;
  container!.style.backgroundRepeat = 'no-repeat';
  container!.style.backgroundSize = 'cover';
  container!.style.backgroundPosition = 'center center';
  const options: ListTableConstructorOptions = {
    columns: [
      {
        field: 'music_name',
        title: '歌曲名',
        width: 'auto',
        icon: {
          type: 'image',
          src: 'music_image',
          name: 'music_image',
          shape: 'circle',
          //定义文本内容行内图标，第一个字符展示
          width: 50, // Optional
          height: 50,
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginRight: 20,
          marginLeft: 0,
          cursor: 'pointer'
        }
      },
      {
        field: 'singer',
        title: '歌手',

        width: 'auto',
        icon: {
          type: 'image',
          src: 'singer_image',
          name: 'singer_image',
          shape: 'circle',
          //定义文本内容行内图标，第一个字符展示
          width: 50, // Optional
          height: 50,
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginRight: 20,
          marginLeft: 0,
          cursor: 'pointer'
        }
      },

      {
        field: 'public_year',
        title: '发行时间',
        width: 'auto'
      },
      {
        field: 'play_count',
        title: '播放次数',
        width: 'auto'
      }
    ],
    records: [
      {
        music_name: '小美满',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/xiaomeiman.jpeg',
        singer: '周深',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/zhoushen.jpeg',
        public_year: '2024',
        play_count: 400
      },
      {
        music_name: 'I Am You',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/iamyou.jpeg',
        singer: 'Kim Taylor',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/KimTaylor.png',
        public_year: '2008',
        play_count: 380
      },
      {
        music_name: 'Reality',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/reality.jpeg',
        singer: 'Lost Frequencies',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/LostFrequencies.png',
        public_year: '2015',
        play_count: 370
      },
      {
        music_name: '无名的人',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/wumingderen.webp',
        singer: '毛不易',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/maobuyi.webp',
        public_year: '2021',
        play_count: 360
      },
      {
        music_name: 'My love',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/mylove.jpeg',
        singer: 'Westlife',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/Westlife.jpeg',
        public_year: '2000',
        play_count: 330
      },
      {
        music_name: '彩虹的微笑',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/caihongdeweixiao.jpeg',
        singer: '王心凌',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/wangxinling.jpeg',
        public_year: '2006',
        play_count: 300
      },
      {
        music_name: '手心的太阳',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/shouxindetaiyang.jpeg',
        singer: '张韶涵',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/zhangshaohan.jpeg',
        public_year: '2004',
        play_count: 230
      },
      {
        music_name: '明明就',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/mingmingjiu.jpeg',
        singer: '周杰伦',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/zhoujielun.jpeg',
        public_year: '2012',
        play_count: 130
      },
      {
        music_name: '声声慢',
        music_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/shengshengman.jpeg',
        singer: '崔开潮',
        singer_image: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/cuikaichao.jpeg',
        public_year: '2017',
        play_count: 30
      }
    ],
    heightMode: 'autoHeight',
    theme: {
      underlayBackgroundColor: 'rgba(255,255,255,0)',
      headerStyle: {
        bgColor: '#f58d17',
        color: '#FFF',
        borderLineWidth: 0,
        fontSize: 26
      },
      bodyStyle: {
        bgColor: getBackgroundColor,
        color: '#FFF',
        borderLineWidth: 0,
        fontSize: 22
      },
      frameStyle: {
        borderColor: 'rgba(255,255,255,0.2)',
        borderLineWidth: 20,
        cornerRadius: 8
      }
    }
  };
  const instance = new ListTable(container!, options);

  // 只为了方便控制太调试用，不要拷贝
  window.tableInstance = instance;
}
