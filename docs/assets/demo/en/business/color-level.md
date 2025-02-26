---
category: examples
group: Business
title: Sales heat map
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/color-level.png
order: 9-1
option: PivotTable-indicators-text#style.bgColor
---

# Sales heat map

This example shows how to implement a sales heat map by changing the background color according to the color level configuration function.

## Key Configurations

- `indicators[x].style.bgColor` Configure the background color of a Metirc content

## Code demo

```javascript livedemo template=vtable
function getColor(min, max, n) {
  if (max === min) {
    if (n > 0) {
      return 'rgb(255,0,0)';
    }
    return 'rgb(255,255,255)';
  }
  if (n === '') return 'rgb(255,255,255)';
  const c = (n - min) / (max - min) + 0.1;
  const red = (1 - c) * 200 + 55;
  const green = (1 - c) * 200 + 55;
  return `rgb(${red},${green},255)`;
}
const option = {
  resize: {
    columnResizeType: 'all'
  },
  records: [
    {
      sales: '936196.0161590576',
      region: 'North East',
      category: 'Technology'
    },
    {
      sales: '824673.0542612076',
      region: 'North East',
      category: 'Office Supplies'
    },
    {
      sales: '920698.4041175842',
      region: 'North East',
      category: 'Furniture'
    },
    {
      sales: '1466575.628829956',
      region: 'Central South',
      category: 'Technology'
    },
    {
      sales: '1270911.2654294968',
      region: 'Central South',
      category: 'Office Supplies'
    },
    {
      sales: '1399928.2008514404',
      region: 'Central South',
      category: 'Furniture'
    },
    {
      sales: '1599653.7198867798',
      region: 'East China',
      category: 'Technology'
    },
    {
      sales: '1408628.5947360992',
      region: 'East China',
      category: 'Office Supplies'
    },
    {
      sales: '1676224.1276245117',
      region: 'East China',
      category: 'Furniture'
    },
    {
      sales: '781743.5634155273',
      region: 'North China',
      category: 'Technology'
    },
    {
      sales: '745813.5155878067',
      region: 'North China',
      category: 'Office Supplies'
    },
    {
      sales: '919743.9351348877',
      region: 'North China',
      category: 'Furniture'
    },
    {
      sales: '230956.3768310547',
      region: 'North West',
      category: 'Technology'
    },
    {
      sales: '267870.7928543091',
      region: 'North West',
      category: 'Office Supplies'
    },
    {
      sales: '316212.42824935913',
      region: 'North West',
      category: 'Furniture'
    },
    {
      sales: '453898.2000274658',
      region: 'South West',
      category: 'Technology'
    },
    {
      sales: '347692.57691955566',
      region: 'South West',
      category: 'Office Supplies'
    },
    {
      sales: '501533.7320175171',
      region: 'South West',
      category: 'Furniture'
    }
  ],
  rows: [
    {
      dimensionKey: 'region',
      title: 'Area',
      width: 'auto',
      showSort: false,
      headerType: 'link',
      linkDetect: true,
      linkJump: false
    }
  ],
  columns: [
    {
      dimensionKey: 'category',
      title: 'Category',
      headerStyle: {
        textAlign: 'right'
      },
      showSort: false,
      headerType: 'link',
      linkDetect: true,
      linkJump: false
    }
  ],
  indicators: [
    {
      indicatorKey: 'sales',
      width: 200,
      showSort: false,
      format(value) {
        return Math.round(value);
      },
      style: {
        color: 'white',
        bgColor: args => {
          return getColor(100000, 2000000, args.dataValue);
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'none',
    headerStyle: {
      textStick: true
    }
  },
  hideIndicatorName: true,
  theme: {
    defaultStyle: {
      borderLineWidth: 0
    }
  }
};

const tableInstance = new VTable.PivotTable(document.getElementById(CONTAINER_ID), option);
window['tableInstance'] = tableInstance;
```
