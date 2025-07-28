в this section, we will introduce the core configuration items из the базовый таблица к help you understand the базовый usвозраст из the таблица. We will provide a simple пример демонстрацияnstration к help you get started quickly. More complex configurations и advanced возможности will be introduced и explained в detail в subsequent chapters.

## Core configuration

Следующий are the Ключевые Конфигурации items из the базовый таблица и their descriptions:

*   `container`: The container DOM element из the таблица, which needs к have ширина и высота.
*   `records`: The данные из the таблица, represented as an массив.
*   `columns`: Configuration из таблица columns, каждый column needs к set configuration items separately, including column тип, ширина, title, etc. Supported column types are: 'текст', 'link', 'imвозраст', 'video', 'sparkline', 'progressbar', 'график'. The configuration items для каждый column тип are slightly different, please flexibly add specific configurations according к the обязательный тип, Вы можете refer к[Document](../../guide/cell_type/cellType).
*   `frozenColCount`: Specifies the число из frozen columns.
*   `transpose`: Whether к transpose the таблица, the по умолчанию is false.
*   `showHeader`: Whether к display the header, the по умолчанию is true.
*   `pagination`: Paging configuration, including the total число из records, the число из records per pвозраст, the текущий pвозраст число, etc.
*   `сортировкаState`: сортировка state, which specifies the сортировка по поле и сортировка rule.
*   `тема`: таблица тема, which can be a built-в тема или a пользовательский тема.
*   `ширинаMode`: The calculation mode из the таблица column ширина.

## пример: Create a simple базовый таблица

Here is a simple пример из how к use a базовый таблица к present данные:

```javascript liveдемонстрация  template=vтаблица

 const option = {
    container: document.getElementById(CONTAINER_ID),
    columns : [
        {
            "поле": "订单 ID",
            "title": "订单 ID",
            "сортировка": true,
            "ширина":'авто',
        },
        {
            "поле": "邮寄方式",
            "title": "邮寄方式"
        },
        {
            "поле": "类别",
            "title": "类别"
        },
        {
            "поле": "子类别",
            "title": "子类别"
        },
        {
            "поле": "销售额",
            "title": "销售额"
        },
    ],
    "records": [
        {
            "订单 ID": "CN-2019-1973789",
            "邮寄方式": "标准级",
            "类别": "办公用品",
            "子类别": "信封",
            "销售额": "125.44"
        },
        {
            "订单 ID": "CN-2019-1973789",
            "邮寄方式": "标准级",
            "类别": "办公用品",
            "子类别": "装订机",
            "销售额": "31.92",
        },
        // ...
    ],
}
const таблицаInstance = новый списоктаблица(option);

```

в the above пример, we created a базовый таблица using a simple данныеset и column definition. Вы можете modify the данные и column definitions к suit your needs.
