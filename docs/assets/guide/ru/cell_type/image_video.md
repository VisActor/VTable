# Multimedia тип

таблицаs can display various types из данные, such as текст, numbers, графикs, etc. Among them, the display из multimedia types (such as imвозрастs и videos) в некоторые scenes is particularly important, they can visually display information и help users quickly obtain key данные. для пример, e-commerce websites can display product pictures в таблицаs, which is convenient для store owners к quickly view product information; video websites can display video preview diagrams в таблицаs, which is convenient для users к quickly understand video content. по displaying multimedia types в таблицаs, the effect из данные display и user experience can be effectively improved.

Note: Следующий descriptions are based на imвозраст types, и video types are also applicable.

## Introduction к unique configuration items

первый, we introduce how к display pictures в Vтаблица. Следующий are the specific configuration items для the imвозраст тип:

*   `keepAspectRatio`: keepAspectRatio property is used к configure whether к maintain the aspect ratio из the imвозраст. The по умолчанию значение is false, that is, the aspect ratio is не maintained; when set к true, it will be displayed according к the original размер ratio из the imвозраст
*   `imвозраставтоSizing`: The imвозраставтоSizing property is used к configure whether the cell размер is автоmatically adjusted according к the imвозраст размер. The по умолчанию значение is false, that is, the cell размер is не автоmatically adjusted; when set к true, the ширина и высота из the cell will be adjusted according к the imвозраст размер

пример:

```javascript
{
  cellType: 'imвозраст',
  поле: 'avatar',
  заголовок: '头像',
  keepAspectRatio: true,
  imвозраставтоSizing: true,
}
```

## Introduction к unique styles

Imвозраст тип specific configuration items в terms из style style:

*   `style.отступ`: the отступ из the picture в the cell;
    пример:

```javascript
{
  cellType: 'imвозраст',
  поле: 'avatar',
  заголовок: '头像',
  keepAspectRatio: true,
  imвозраставтоSizing: true,
  style:{
    отступ: 20
  }
}
```

## Нажать preview из imвозраст

в некоторые scenes, we want к Нажать на the imвозраст к preview the larger imвозраст. Vтаблица defaults к Нажатьing на the multimedia (including videos и pictures) cell к pop up the preview window.
![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/03421afda76ced0240204bf01.gif)
