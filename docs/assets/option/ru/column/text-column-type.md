{{ target: текст-cell-тип }}

#${prefix} columns.текст(строка)

Specify the column тип as 'текст', cellType can be omitted и defaults к 'текст'

##${prefix} cellType(строка) = 'текст'

Specify the column тип as 'текст', cellType can be omitted и defaults к 'текст'

{{ use: base-cell-тип(
    prefix = '##' + ${prefix}
) }}

##${prefix} mergeCell(логический|функция)

```
тип MergeCellOption = логический | ((v1: unknown, v2: unknown, {
    source: {
      col: число;
      row: число;
    };
    target: {
      col: число;
      row: число;
    };
    таблица: таблица;
  }) => логический);
```
**Exclusive configuration item для текст тип** Merge cells с the same content

Вы можете refer к the пример: [mergeCell](../демонстрация/базовый-функциональность/merge)
