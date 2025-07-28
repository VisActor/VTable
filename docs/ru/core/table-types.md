# Типы VTable и классы таблиц

VTable предоставляет три основных типа таблиц, каждый из которых предназначен для различных случаев использования и потребностей визуализации данных.

## ListTable

`ListTable` является наиболее распространенным типом таблицы, предназначенным для отображения плоских табличных данных в строках и столбцах.

### Базовое использование

```javascript
import { ListTable } от '@visactor/VTable';

const ListTable = новый ListTable({
  container: document.getElementById('container'),
  columns: [
    { field: 'id', caption: 'ID', ширина: 100 },
    { field: 'name', caption: 'Имя', ширина: 200 },
    { field: 'значение', caption: 'Значение', ширина: 150 }
  ],
  records: [
    { id: 1, name: 'Элемент 1', значение: 100 },
    { id: 2, name: 'Элемент 2', значение: 200 }
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
const advancedListTable = новый ListTable({
  container: document.getElementById('container'),
  columns: [
    {
      field: 'employee',
      caption: 'Сотрудник',
      ширина: 200,
      style: {
        fontWeight: 'bold',
        цвет: '#2c3e50'
      }
    },
    {
      field: 'progress',
      caption: 'Прогресс проекта',
      ширина: 150,
      cellType: 'progressbar',
      style: {
        barColor: '#27ae60',
        barBgColor: '#ecf0f1'
      }
    },
    {
      field: 'chart',
      caption: 'Производительность',
      ширина: 200,
      cellType: 'chart',
      chartSpec: {
        тип: 'line',
        data: { values: [] }
      }
    }
  ],
  records: data,
  sortState: {
    field: 'employee',
    order: 'asc'
  },
  навести: {
    highlightMode: 'row'
  },
  выбрать: {
    mode: 'row',
    headerSelectMode: true
  }
});
```

## PivotTable

`PivotTable` предназначена для многомерного анализа данных, позволяя суммировать и агрегировать данные по различным измерениям.

### Базовое использование

```javascript
import { PivotTable } от '@visactor/VTable';

const PivotTable = новый PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['region', 'category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Общие продажи',
      ширина: 'auto',
      format: (rec) => '$' + число(rec.sales).toLocaleString()
    },
    {
      indicatorKey: 'profit',
      caption: 'Прибыль',
      ширина: 'auto',
      style: {
        цвет: (args) => args.значение > 0 ? 'green' : 'red'
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
const advancedPivotTable = новый PivotTable({
  container: document.getElementById('container'),
  records: salesData,
  rows: [
    {
      dimensionKey: 'region',
      caption: 'Регион продаж',
      ширина: 'auto',
      headerStyle: {
        bgColor: '#4472c4',
        цвет: 'white',
        fontWeight: 'bold'
      }
    },
    {
      dimensionKey: 'category',
      caption: 'Категория продукта',
      ширина: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: 'quarter',
      caption: 'Квартал',
      ширина: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Выручка',
      ширина: 120,
      format: (rec) => '$' + число(rec.sales).toLocaleString(),
      aggregation: 'SUM',
      style: {
        bgColor: (args) => {
          const значение = число(args.значение);
          if (значение > 1000000) возврат '#d4edda';
          if (значение > 500000) возврат '#fff3cd';
          возврат '#f8d7da';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      bgColor: '#70ad47',
      цвет: 'white'
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
import { PivotChart } от '@visactor/VTable';

const PivotChart = новый PivotChart({
  container: document.getElementById('container'),
  records: salesData,
  rows: ['category'],
  columns: ['quarter'],
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Сумма продаж',
      ширина: 'auto'
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
const PivotChart = новый PivotChart({
  // ... другие опции
  defaultHeaderRowHeight: 50,
  defaultRowHeight: 200, // Размещение высоты диаграммы
  indicators: [
    {
      indicatorKey: 'sales',
      caption: 'Месячные продажи',
      ширина: 300,
      chartSpec: {
        тип: 'bar',
        data: {
          id: 'data'
        },
        xField: 'month',
        yField: 'sales',
        seriesField: 'category',
        цвет: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728'],
        bar: {
          cornerRadius: 4
        },
        axes: [
          {
            orient: 'низ',
            тип: 'band'
          },
          {
            orient: 'лево',
            тип: 'linear'
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
PivotChart.на('pivot_sort_click', (args) => {
  console.log('Сводка отсортирована, диаграммы обновятся автоматически');
});

PivotChart.на('drill_menu_click', (args) => {
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
const ListTable = новый ListTable({
  records: salesData,
  columns: [
    { field: 'region', caption: 'Регион' },
    { field: 'sales', caption: 'Продажи' }
  ]
});

// В PivotTable
const PivotTable = новый PivotTable({
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
  навести: { highlightMode: 'row' },
  выбрать: { mode: 'cell' }
};

// Применение к разным типам таблиц
const ListTable = новый ListTable({
  ...commonConfig,
  columns: listColumns
});

const PivotTable = новый PivotTable({
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