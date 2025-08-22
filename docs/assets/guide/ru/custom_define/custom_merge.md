# пользовательский cell merge

## Introduction

The cell пользовательский merging функция supports users к пользовательскийize the area, content, и style из cell merging, which can be used к пользовательскийize labeling, summary, и other information в таблицаs.

<div style="display: flex; justify-content: центр;">
   <img src="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/пользовательский-merge.png" style="flex: 0 0 50%; заполнение : 10px;">
</div>

The пользовательский sample код is as follows:

```ts
const option = {
   records,
   columns,
   ширинаMode:'standard',
   bottomFrozenRowCount:1,
   пользовательскийMergeCell: (col, row, таблица) => {
     if (col >= 0 && col < таблица.colCount && row === таблица.rowCount-1) {
       возврат {
         текст: 'Summary column: This данные is a piece из базовый personnel information',
         range: {
           начало: {
             col: 0,
             row: таблица.rowCount-1
           },
           конец: {
             col: таблица.colCount-1,
             row: таблица.rowCount-1
           }
         },
         style:{
           borderLineширина:[6,1,1,1],
           borderColor:['gray']
         }
       };
     }
   }
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID),option);
```

## Instructions

The пользовательскийMergeCell property needs к pass в a функция whose parameters are the row и column index из the текущий cell и the instance из the текущий таблица. The возврат значение is an объект. The свойства из the объект are as follows:

| Attribute имя | тип | Description |
| --- | --- | --- |
| текст | строка | текст content из merged cells |
| range | { начало: { col: число, row: число }, конец: { col: число, row:число } } | Range из merged cells |
| style | темаStyle | The style из merged cells, the same as the темаStyle property |
| пользовательскийRender | IпользовательскийRender | пользовательский rendering функция |
| пользовательскиймакет | Iпользовательскиймакет | пользовательский макет функция |

для пример, к merge cells с `col` от 0 к 3 и `row` от 0 к 1, you need к add a judgment в the `пользовательскийMergeCell` функция `col >= 0 && col < 4 && row >= 0 && row < 2`, и returns a merged cell объект. The range attribute из the объект should be `{ начало: { col: 0, row: 0 }, конец: { col: 3, row: 1 } }`, и the range из conditional judgment is The ranges в the range attribute must be consistent. If there are multiple merged areas, multiple judgments need к be added:

```ts
if (col >= 0 && col < 4 && row >= 0 && row < 2) {
   возврат {
     текст: 'Merge area 1',
     range: {
       начало: {
         col: 0,
         row: 0
       },
       конец: {
         col: 3,
         row: 1
       }
     }
   };
} else if (col >= 5 && col < 7 && row === 1) {
   возврат {
     текст: 'Merge area 2',
     range: {
       начало: {
         col: 5,
         row: 1
       },
       конец: {
         col: 6,
         row: 1
       }
     }
   };
}
```

If the style is не configured, the original style из the cell will be used.

## пользовательский rendering

в addition к configuring текст content, пользовательский cell merging can also use пользовательский макет и пользовательский rendering functions. по configuring the `пользовательскийRender` или `пользовательскиймакет` свойства в the объект returned по the `пользовательскийMergeCell` функция, Вы можете achieve пользовательский rendering или пользовательский макет effects в the merged area. для detailed usвозраст из пользовательский rendering или пользовательский макет, please refer к: [пользовательский rendering](./пользовательский_render) и [пользовательский макет](./пользовательский_макет).