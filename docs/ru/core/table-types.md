# Типы VTable и классы таблиц

VTable предоставляет три основных типа таблиц, каждый из которых предназначен для различных случаев использования и потребностей визуализации данных.

## ListTable

`ListTable` является наиболее распространенным типом таблицы, предназначенным для отображения плоских табличных данных в строках и столбцах.

### Базовое использование

```javascript
import { ListTable } from '@visactor/vtable';

const listTable = new ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'id', caption: 'ID', width: 100 },
    { field: 'name', caption: 'Имя', width: 200 },
    { field: 'value', caption: 'Значение', width: 150 }
  ],
  records: [
    { id: 1, name: 'Элемент 1', value: 100 },
    { id: 2, name: 'Элемент 2', value: 200 }
  ]
});
```

### Ключевые функции

**Привязка данных**
- Поддерживает плоские структуры данных
- Прямое сопоставление полей со столбцами
- Автоматическое определение типа данных

**Типы столбцов**
- Текстовые столбцы с форматированием
- Числовые столбцы с выравниванием
- Столбцы дат с пользовательскими форматами
- Столбцы ссылок для навигации
- Столбцы изображений для визуального контента
- Столбцы индикаторов прогресса для метрик
- Столбцы диаграмм для встроенных визуализаций

**Интерактивные функции**
- Выбор строк и ячеек
- Сортировка столбцов (одиночная и многостолбцовая)
- Фильтрация строк
- Встроенное редактирование
- Изменяемый размер столбцов
- Закрепленные столбцы

### Продвинутая конфигурация ListTable

```javascript
const advancedListTable = new ListTable({
  container: document.getElementById('container'),
  columns: [
    {
      field: 'employee',
      caption: 'Сотрудник',
      width: 200,
      style: {
        fontWeight: 'bold',
        color: '#2c3e50'
      }
    },
    {
      field: 'progress',
      caption: 'Прогресс проекта',
      width: 150,
      cellType: 'progressbar',
      style: {
        barColor: '#27ae60',
        barBgColor: '#ecf0f1'
      }
    },
    {
      field: 'chart',
      caption: 'Производительность',
      width: 200,
      cellType: 'chart',
      chartSpec: {
        type: 'line',
        data: { values: [] }
      }
    }
  ],
  records: data,
  sortState: {
    field: 'employee',
    order: 'asc'
  },
  hover: {
    highlightMode: 'row'
  },
  select: {
    mode: 'row',
    headerSelectMode: true
  }
});
```

## PivotTable

`PivotTable` предназначена для многомерного анализа данных, позволяя суммировать и агрегировать данные по различным измерениям.

### Базовое использование

```javascript
import { PivotTable } from '@visactor/vtable';

const pivotTable = new PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['region', 'category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Общие продажи',
      width: 'auto',
      format: (rec) => '$' + Number(rec.sales).toLocaleString()
    },
    {
      indicatorKey: 'profit',
      caption: 'Прибыль',
      width: 'auto',
      style: {
        color: (args) => args.value > 0 ? 'green' : 'red'
      }
    }
  ]
});
```

### Основные понятия

**Измерения**
- **Строки**: Поля, которые создают заголовки строк (категории для группировки данных по вертикали)
- **Столбцы**: Поля, которые создают заголовки столбцов (категории для группировки данных по горизонтали)
- **Индикаторы**: Числовые поля, которые агрегируются и отображаются в ячейках

**Функции агрегации**
- `SUM`: Сумма всех значений
- `AVG`: Среднее значение всех значений
- `COUNT`: Количество записей
- `MAX`: Максимальное значение
- `MIN`: Минимальное значение
- Пользовательские функции агрегации

### Продвинутые функции PivotTable

```javascript
const advancedPivotTable = new PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: [
    {
      dimensionKey: 'region',
      caption: 'Регион продаж',
      width: 'auto',
      headerStyle: {
        bgColor: '#4472c4',
        color: 'white',
        fontWeight: 'bold'
      }
    },
    {
      dimensionKey: 'category',
      caption: 'Категория продукта',
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'quarter',
      caption: 'Квартал',
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Выручка',
      width: 120,
      format: (rec) => '$' + Number(rec.sales).toLocaleString(),
      aggregation: 'SUM',
      style: {
        bgColor: (args) => {
          const value = Number(args.value);
          if (value > 1000000) return '#d4edda';
          if (value > 500000) return '#fff3cd';
          return '#f8d7da';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      bgColor: '#70ad47',
      color: 'white'
    }
  },
  dataConfig: {
    aggregationRules: [
      {
        indicatorKey: 'sales',
        field: 'sales',
        aggregationType: 'SUM'
      }
    ]
  }
});
```

**Интерактивные функции**
- Функциональность детализации/свертывания
- Динамическое изменение порядка измерений
- Фильтрация и сортировка по измерениям
- Развертывание/свертывание иерархий
- Экспорт в различные форматы

## PivotChart

`PivotChart` сочетает аналитическую мощь сводных таблиц с богатой визуализацией диаграмм.

### Базовое использование

```javascript
import { PivotChart } from '@visactor/vtable';

const pivotChart = new PivotChart({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Сумма продаж',
      width: 'auto'
    }
  ],
  indicatorsAsCol: false,
  corner: {
    titleOnDimension: 'row'
  }
});
```

### Интеграция диаграмм

**Встроенные типы диаграмм**
- Столбчатые диаграммы
- Линейные диаграммы
- Диаграммы с областями
- Круговые диаграммы
- Точечные диаграммы
- Пользовательские типы диаграмм

**Конфигурация диаграмм**
```javascript
const pivotChart = new PivotChart({
  // ... другие опции
  defaultHeaderRowHeight: 50,
  defaultRowHeight: 200, // Размещение высоты диаграммы
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Месячные продажи',
      width: 300,
      chartSpec: {
        type: 'bar',
        data: {
          id: 'data'
        },
        xField: 'month',
        yField: 'sales',
        seriesField: 'category',
        color: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
        bar: {
          cornerRadius: 4
        },
        axes: [
          {
            orient: 'bottom',
            type: 'band'
          },
          {
            orient: 'left',
            type: 'linear'
          }
        ]
      }
    }
  ]
});
```

### Продвинутые функции диаграмм

**Интерактивные диаграммы**
- Всплывающие подсказки при наведении
- События клика
- Масштабирование и панорамирование
- Выбор области
- Эффекты анимации

**Динамическая привязка данных**
```javascript
// Данные диаграммы обновляются автоматически с данными сводной таблицы
pivotChart.on('pivot_sort_click', (args) => {
  console.log('Сводка отсортирована, диаграммы обновятся автоматически');
});

pivotChart.on('drill_menu_click', (args) => {
  console.log('Выполнена детализация, данные диаграммы обновлены');
});
```

## Выбор правильного типа таблицы

### Используйте ListTable когда:
- Отображаете плоские табличные данные
- Нужна простая сортировка и фильтрация
- Работаете с записями, которые не требуют агрегации
- Создаете панели управления с детальными представлениями
- Создаете формы ввода данных

### Используйте PivotTable когда:
- Анализируете многомерные данные
- Нужно агрегировать и суммировать информацию
- Создаете отчеты бизнес-аналитики
- Сравниваете данные по различным категориям
- Создаете аналитические панели управления

### Используйте PivotChart когда:
- Сочетаете табличный анализ с визуальным представлением
- Нужны как детальные данные, так и визуализация трендов
- Создаете исполнительные панели управления
- Представляете данные нетехническим заинтересованным сторонам
- Создаете интерактивные инструменты исследования данных

## Миграция между типами таблиц

### Преобразование ListTable в PivotTable

```javascript
// Из ListTable
const listTable = new ListTable({
  records: salesData,
  columns: [
    { field: 'region', caption: 'Регион' },
    { field: 'sales', caption: 'Продажи' }
  ]
});

// В PivotTable
const pivotTable = new PivotTable({
  records: salesData,
  rows: ['region'],
  indicators: [
    { indicatorKey: 'sales', caption: 'Общие продажи' }
  ]
});
```

### Общая конфигурация между типами

```javascript
// Общая конфигурация
const commonConfig = {
  container: document.getElementById('container'),
  records: data,
  theme: 'ARCO',
  hover: { highlightMode: 'row' },
  select: { mode: 'cell' }
};

// Применение к разным типам таблиц
const listTable = new ListTable({
  ...commonConfig,
  columns: listColumns
});

const pivotTable = new PivotTable({
  ...commonConfig,
  rows: ['dimension1'],
  indicators: pivotIndicators
});
```

## Соображения производительности

### Производительность ListTable
- Виртуальная прокрутка для больших наборов данных
- Ленивая загрузка для удаленных данных
- Виртуализация столбцов для широких таблиц

### Производительность PivotTable
- Оптимизация агрегации данных
- Кэширование иерархических данных
- Постепенная загрузка для больших измерений

### Производительность PivotChart
- Оптимизация рендеринга диаграмм
- Выборка данных для больших наборов данных
- Эффективные обновления диаграмм при взаимодействии

Каждый тип таблицы оптимизирован для своего конкретного случая использования, обеспечивая оптимальную производительность в различных сценариях.