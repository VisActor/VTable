# Как реализовать многоуровневые заголовки в базовой таблице (ListTable)?

## Описание вопроса

Как создать такую иерархическую структуру для отображения в ячейках заголовка таблицы, например: Отдел (Финансы, Технологии), Имя (Имя, Фамилия)?

![image](/vtable/faq/1-0.png)

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
      title: 'First Name',
      width: 120
    },
    {
      field: 'lastName',
      title: 'Last Name',
      width: 100
    }
  ]
},
```

## Results

- [Online demo](https://codesandbox.io/s/vtable-columns-nested-structure-4zwk43)

![result](/vtable/faq/1-1.png)

## Quote

- [List Table Demo](https://visactor.io/vtable/demo/table-type/list-table)
- [List Table Tutoria](https://visactor.io/vtable/guide/table_type/List_table/list_table_define_and_generate)
- [Related api](https://visactor.io/vtable/option/ListTable-columns-text#columns)
- [github](https://github.com/VisActor/VTable)
