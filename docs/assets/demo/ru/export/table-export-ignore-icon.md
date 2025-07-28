---
категория: примеры
группа: export
заголовок: 表格导出（忽略图标）
обложка: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/Vтаблица/preview/export-tree.png
порядок: 4-6
ссылка: '../../guide/export/excel'
# опция: списоктаблица
---

# 表格导出（忽略图标）

по по умолчанию, when the cell has an иконка, the иконка и текст will be treated as an imвозраст when exporting. If you do не need к export the иконка, Вы можете set `ignoreиконка` к true, и only the текст will be output.

## код демонстрация

```javascript liveдемонстрация template=vтаблица
// You need к introduce the plug-в packвозраст when using it `@visactor/vтаблица-export`
// import {
//   downloadCsv,
//   exportVтаблицаToCsv,
//   downloadExcel,
//   exportVтаблицаToExcel,
// } от "@visactor/vтаблица-export";
// When umd is introduced, the export tool will be mounted к Vтаблица.export

const данные = [
  {
    类别: '办公用品',
    销售额: 129.696,
    数量: 2,
    利润: -60.704,
    children: [
      {
        类别: '信封', // 对应原子类别
        销售额: 125.44,
        数量: 2,
        利润: 42.56,
        children: [
          {
            类别: '黄色信封',
            销售额: 125.44,
            数量: 2,
            利润: 42.56
          },
          {
            类别: '白色信封',
            销售额: 1375.92,
            数量: 3,
            利润: 550.2
          }
        ]
      },
      {
        类别: '器具', // 对应原子类别
        销售额: 1375.92,
        数量: 3,
        利润: 550.2,
        children: [
          {
            类别: '订书机',
            销售额: 125.44,
            数量: 2,
            利润: 42.56
          },
          {
            类别: '计算器',
            销售额: 1375.92,
            数量: 3,
            利润: 550.2
          }
        ]
      }
    ]
  },
  {
    类别: '技术',
    销售额: 229.696,
    数量: 20,
    利润: 90.704,
    children: [
      {
        类别: '设备', // 对应原子类别
        销售额: 225.44,
        数量: 5,
        利润: 462.56
      },
      {
        类别: '配件', // 对应原子类别
        销售额: 375.92,
        数量: 8,
        利润: 550.2
      },
      {
        类别: '复印机', // 对应原子类别
        销售额: 425.44,
        数量: 7,
        利润: 342.56
      },
      {
        类别: '电话', // 对应原子类别
        销售额: 175.92,
        数量: 6,
        利润: 750.2
      }
    ]
  },
  {
    类别: '家具',
    销售额: 129.696,
    数量: 2,
    利润: -60.704,
    children: [
      {
        类别: '桌子', // 对应原子类别
        销售额: 125.44,
        数量: 2,
        利润: 42.56,
        children: [
          {
            类别: '黄色桌子',
            销售额: 125.44,
            数量: 2,
            利润: 42.56
          },
          {
            类别: '白色桌子',
            销售额: 1375.92,
            数量: 3,
            利润: 550.2
          }
        ]
      },
      {
        类别: '椅子', // 对应原子类别
        销售额: 1375.92,
        数量: 3,
        利润: 550.2,
        children: [
          {
            类别: '老板椅',
            销售额: 125.44,
            数量: 2,
            利润: 42.56
          },
          {
            类别: '沙发椅',
            销售额: 1375.92,
            数量: 3,
            利润: 550.2
          }
        ]
      }
    ]
  },
  {
    类别: '生活家电（懒加载）',
    销售额: 229.696,
    数量: 20,
    利润: 90.704
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  columns: [
    {
      поле: '类别',
      tree: true,
      заголовок: '类别',
      ширина: 'авто',
      сортировка: true
    },
    {
      поле: '销售额',
      заголовок: '销售额',
      ширина: 'авто',
      сортировка: true
      // tree: true,
    },
    {
      поле: '利润',
      заголовок: '利润',
      ширина: 'авто',
      сортировка: true
    }
  ],
  showPin: true, //显示Vтаблица内置冻结列图标
  ширинаMode: 'standard',
  allowFrozenColCount: 2,
  records: данные,

  hierarchyIndent: 20,
  hierarchyExpandLevel: 2,
  hierarchyTextStartAlignment: true,
  сортировкаState: {
    поле: '销售额',
    порядок: 'asc'
  },
  тема: Vтаблица.темаs.BRIGHT,
  defaultRowвысота: 32
};
const таблицаInstance = новый Vтаблица.списоктаблица(document.getElementById(CONTAINER_ID), option);
window.таблицаInstance = таблицаInstance;

bindExport();

функция bindExport() {
  let exportContainer = document.getElementById('export-buttom');
  if (exportContainer) {
    exportContainer.parentElement.removeChild(exportContainer);
  }

  exportContainer = document.createElement('div');
  exportContainer.id = 'export-buttom';
  exportContainer.style.позиция = 'absolute';
  exportContainer.style.низ = '0';
  exportContainer.style.право = '0';

  window['таблицаInstance'].getContainer().appendChild(exportContainer);

  const exportCsvКнопка = document.createElement('Кнопка');
  exportCsvКнопка.innerHTML = 'CSV-export';
  const exportExcelКнопка = document.createElement('Кнопка');
  exportExcelКнопка.innerHTML = 'Excel-export';
  exportContainer.appendChild(exportCsvКнопка);
  exportContainer.appendChild(exportExcelКнопка);

  exportCsvКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadCsv(exportVтаблицаToCsv(window.таблицаInstance), 'export');
    }
  });

  exportExcelКнопка.addсобытиесписокener('Нажать', async () => {
    if (window.таблицаInstance) {
      await downloadExcel(
        await exportVтаблицаToExcel(window.таблицаInstance, {
          ignoreиконка: true
        }),
        'export'
      );
    }
  });
}
```
