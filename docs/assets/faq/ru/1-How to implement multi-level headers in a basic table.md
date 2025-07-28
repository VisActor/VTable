# Как реализовать многоуровневые заголовки в базовой таблице (ListTable)?

## Описание вопроса

Как создать такую иерархическую структуру для отображения в ячейках заголовка таблицы, например: Отдел (Финансы, Технологии), Имя (Имя, Фамилия)?

![image](/VTable/faq/1-0.png)

## Решение

В VTable можно использовать опцию конфигурации "columns" для настройки подэлементов в "columns".

## Пример кода

```javascript
{
  field: 'full name',
  title: 'Полное имя',
  columns: [
    {
      field: 'name',
      title: 'первый Name',
      ширина: 120
    },
    {
      field: 'lastName',
      title: 'последний Name',
      ширина: 100
    }
  ]
},
```

## Results

- [Online demo](https://codesandbox.io/s/VTable-columns-nested-structure-4zwk43)

![result](/VTable/faq/1-1.png)

## Quote

- [List Table Demo](https://visactor.io/VTable/demo/table-тип/list-table)
- [List Table Tutoria](https://visactor.io/VTable/guide/table_type/List_table/list_table_define_and_generate)
- [Related api](https://visactor.io/VTable/option/ListTable-columns-текст#columns)
- [github](https://github.com/VisActor/VTable)
