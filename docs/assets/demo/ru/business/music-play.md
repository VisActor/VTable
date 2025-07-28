---
категория: примеры
группа: Business
заголовок: Song Play Ranking
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/music-play.png
опция: списоктаблица#тема
---

# Song Play Ranking

This пример, с a фон imвозраст, uses the transparent фон цвет из the таблица к показать an individual's song playсписок графикs на a music playback platform.

## Ключевые Конфигурации

- `тема` Configure the styles из каждый area из the таблица

## код демонстрация

```javascript liveдемонстрация template=vтаблица
функция getBackgroundColor(args) {
  const { row, таблица } = args;
  const index = row - таблица.frozenRowCount;
  if (!(index & 1)) {
    возврат 'rgba(255,255,255,0.2)';
  }
  возврат 'rgba(255,255,255,0.5)';
}
const container = document.getElementById(CONTAINER_ID);
container.style.заполнение = '30px';
container.style.backgroundImвозраст = `url('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/фон-imвозраст-music.jpeg')`;
container.style.backgroundRepeat = 'no-repeat';
container.style.backgroundSize = 'cover';
container.style.backgroundPosition = 'центр центр';
const options = {
  columns: [
    {
      поле: 'music_имя',
      заголовок: '歌曲名',
      ширина: 'авто',
      иконка: {
        тип: 'imвозраст',
        src: 'music_imвозраст',
        имя: 'music_imвозраст',
        shape: 'circle',
        ширина: 50,
        высота: 50,
        positionType: Vтаблица.TYPES.иконкаPosition.contentLeft,
        marginRight: 20,
        marginLeft: 0,
        cursor: 'pointer'
      }
    },
    {
      поле: 'singer',
      заголовок: '歌手',
      ширина: 'авто',
      иконка: {
        тип: 'imвозраст',
        src: 'singer_imвозраст',
        имя: 'singer_imвозраст',
        shape: 'circle',
        ширина: 50,
        высота: 50,
        positionType: Vтаблица.TYPES.иконкаPosition.contentLeft,
        marginRight: 20,
        marginLeft: 0,
        cursor: 'pointer'
      }
    },

    {
      поле: 'public_year',
      заголовок: '发行时间',
      ширина: 'авто'
    },
    {
      поле: 'play_count',
      заголовок: '播放次数',
      ширина: 'авто'
    }
  ],
  records: [
    {
      music_имя: '小美满',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/xiaomeiman.jpeg',
      singer: '周深',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/zhoushen.jpeg',
      public_year: '2024',
      play_count: 400
    },
    {
      music_имя: 'I Am You',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/iamyou.jpeg',
      singer: 'Kim Taylor',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/KimTaylor.png',
      public_year: '2008',
      play_count: 380
    },
    {
      music_имя: 'Reality',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/reality.jpeg',
      singer: 'Lost Frequencies',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/LostFrequencies.png',
      public_year: '2015',
      play_count: 370
    },
    {
      music_имя: '无名的人',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/wumingderen.webp',
      singer: '毛不易',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/maobuyi.webp',
      public_year: '2021',
      play_count: 380
    },
    {
      music_имя: 'My love',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/mylove.jpeg',
      singer: 'Westlife',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/Westlife.jpeg',
      public_year: '2000',
      play_count: 330
    },
    {
      music_имя: '彩虹的微笑',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/caihongdeweixiao.jpeg',
      singer: '王心凌',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/wangxinling.jpeg',
      public_year: '2006',
      play_count: 300
    },
    {
      music_имя: '手心的太阳',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/shouxindetaiyang.jpeg',
      singer: '张韶涵',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/zhangshaohan.jpeg',
      public_year: '2004',
      play_count: 230
    },
    {
      music_имя: '明明就',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/mingmingjiu.jpeg',
      singer: '周杰伦',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/zhoujielun.jpeg',
      public_year: '2012',
      play_count: 130
    },
    {
      music_имя: '声声慢',
      music_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/shengshengman.jpeg',
      singer: '崔开潮',
      singer_imвозраст: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/media/cuikaichao.jpeg',
      public_year: '2017',
      play_count: 30
    }
  ],
  высотаMode: 'автовысота',
  тема: {
    underlayBackgroundColor: 'rgba(255,255,255,0)',
    headerStyle: {
      bgColor: '#f58d17',
      цвет: '#FFF',
      borderLineширина: 0,
      fontSize: 26
    },
    bodyStyle: {
      bgColor: getBackgroundColor,
      цвет: '#FFF',
      borderLineширина: 0,
      fontSize: 22
    },
    frameStyle: {
      borderColor: 'rgba(255,255,255,0.2)',
      borderLineширина: 20,
      cornerRadius: 8
    }
  }
};
const таблицаInstance = новый Vтаблица.списоктаблица(container, options);
window['таблицаInstance'] = таблицаInstance;
```
