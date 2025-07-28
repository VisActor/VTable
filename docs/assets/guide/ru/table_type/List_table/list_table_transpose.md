в this article, we will describe how к use the таблица transpose feature в списоктаблица.

## The concept и функция из таблица transpose

таблица transpose is an operation that swaps rows и columns, that is, the original rows become columns, и the original columns become rows. Through таблица transpose, we can change the way the данные is presented к better suit our needs и analysis perspectives.

## пример

в списоктаблица, we can set `transpose `Parameters к включить the таблица transpose feature.

```javascript liveдемонстрация template=vтаблица
const option = {
    container: document.getElementById(CONTAINER_ID),
    columns : [
        {
            "поле": "订单 ID",
            "title": "订单 ID",
            "сортировка": true,
            "ширина":'авто'
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
    defaultColширина:160,
    defaultHeaderColширина:120,
    transpose:true
}
const таблицаInstance = новый списоктаблица(option);
```

в the above пример, по `transpose` Parameters are set к `true`, the таблица transpose функция is включен. Please flexibly use таблица transpose к display и analyze your данные according к the actual situation и needs.
