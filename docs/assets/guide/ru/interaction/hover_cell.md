# навести interaction

навести interaction is a very useful feature when using Vтаблица для данные analytics. с навести interaction, we can highlight cells, entire rows, или entire columns из данные when the mouse hovers, helping users better фокус на specific information. This tutorial will describe how к use и пользовательскийize навести interaction в Vтаблица.

## Patterns из навести interaction

Vтаблица supports four навести interaction modes: 'cross', 'column', 'row' и'cell '. по по умолчанию, the навести interaction mode is'cross'. Вы можете pass`hoverMode`Options к configure.

для пример, set the навести interaction mode к line cross:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  навести: {
    highlightMode: 'cross'
  }
});
```

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/a2c7623458257d1562627090a.png)

As shown в the imвозраст above, the row и column из the cell are highlighted when the mouse hovers.

## навести interaction style

Vтаблица allows к пользовательскийize the style из навести interaction, through`тема.bodyStyle.навести`Configure.

для пример, Вы можете set the фон цвет из a hovering cell:

```javascript
const таблица = новый Vтаблица.списоктаблица({
  тема:
    Vтаблица.темаs.ARCO.extends({
      bodyStyle: {
        навести:{
          cellBgColor:'#FFC0CB',
          inlineRowBgColor: '#FFD700', // 金色
          inlineColumnBgColor: '#ADFF2F' // 绿黄色
        }
      }
    })
});
```

![imвозраст](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/0a2e223bdcd7410c08f6a6a0c.png)

As shown в the figure above, the фон цвет из the cell when the mouse hovers is pink, the фон цвет из the entire row where the mouse hovers is gold, и the фон цвет из the entire column where the mouse hovers is green-yellow.

## отключить навести interaction

Vтаблица allows disabling навести interaction, which is useful для некоторые scenarios where visual interference needs к be reduced.

к отключить навести interaction, Вы можете`навести.disableHover`Options are set к`true`Смотрите также:

```javascript
const таблица = Vтаблица.списоктаблица({
  навести: {
    disableHover: true
  }
});
```

Additionally, if you only want к отключить навести interaction для header columns, Вы можете set it as follows:

```javascript
const таблица = Vтаблица.списоктаблица({
  навести: {
    disableHeaderHover: true
  }
});
```

в addition, there are special needs scenarios that only prohibit навести interaction для a certain column, Вы можете use`columns.disableHeaderHover`и`columns.disableHeaderHover`опция:

    const таблица = новый Vтаблица.списоктаблица({
      columns: [
        {
        title·: 'ID',
        поле:'ID',
          disableHover: true // 禁用某一列表头的hover交互
        }
      ]
    });

When навести interaction is отключен, there will be no highlighting when hovering.

So far, we have introduced the навести interaction в Vтаблица, including interactive mode, пользовательский style и disabling навести interaction. по mastering these functions, Вы можете more flexibly пользовательскийize the навести interaction из the таблица according к actual needs.
