---
category: examples
group: custom-layout
title: cell custom reactive layout
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/cell-custom-reactive-layout.gif
link: custom_define/vue-custom-component
---

# cell custom reactive layout

In this example, we use custom responsive layout to dynamically adjust the width of cells, allowing cells to adjust their width based on their content, achieving better display effects. The example also demonstrates how to respond to mouse-over events on cells, displaying checkboxes or edit buttons in cells.

Note: The example adjusts the parameter DEFAULT_ROW_HEIGHT, which can adjust the height of rows, thereby adjusting the amount of content displayed in cells.

Thanks to the example contributor: [自信的阿政](../../)

## Code Demo

```javascript livedemo template=vtable
// import * as VTable from '@visactor/vtable';
// import * as VUtils from '@visactor/vutils';
const VGroup = VTable.VGroup;
const VText = VTable.VText;
const VImage = VTable.VImage;
const VCheckBox = VTable.VCheckBox;
const cloneDeep = VUtils.cloneDeep

const editSvg =
  '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48"><path fill="#404A59" d="M37.163 4.293a3 3 0 0 0-4.243 0L15.258 21.955a3 3 0 0 0-.856 1.756l-.989 8.06a3 3 0 0 0 3.343 3.343l8.06-.989a3 3 0 0 0 1.756-.856l17.662-17.662a3 3 0 0 0 0-4.243l-7.07-7.071ZM18.33 24.54 35.042 7.83l5.657 5.656-16.712 16.712-6.448.79.791-6.447ZM8 10a2 2 0 0 1 2-2h10a2 2 0 1 0 0-4H10a6 6 0 0 0-6 6v28a6 6 0 0 0 6 6h28a6 6 0 0 0 6-6V28a2 2 0 1 0-4 0v10a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2V10Z" clip-rule="evenodd" fill-rule="evenodd" data-follow-fill="#404A59"/></svg>'
const DEFAULT_ROW_HEIGHT = 80
const CELL_PADDING = 16
const TAG_PADDING = 8
const TAG_HEIGHT = 24
const TAG_GAP = 8
const NUMBER_WIDTH = 40

const colors = [
  {
    fontColor: '#1959d8',
    backgroundColor: '#d9e6ff'
  },
  {
    fontColor: '#a919d8',
    backgroundColor: '#f3e4fc'
  },
  {
    fontColor: '#d82f3d',
    backgroundColor: '#fce5e6'
  },
  {
    fontColor: '#d86219',
    backgroundColor: '#fce9e4'
  },
  {
    fontColor: '#d8830d',
    backgroundColor: '#fceede'
  },
  {
    fontColor: '#1a9b00',
    backgroundColor: '#e4f1e4'
  },
  {
    fontColor: '#057e89',
    backgroundColor: '#e4edee'
  }
]

const records = [
  {
    index: 1,
    gender: '男',
    name: '张三',
    age: 20,
    city: '北京',
    id: '1',
    tags: [
      { label: '标签1', value: '标签1' },
      { label: '标签2标签2标签2', value: '标签2' },
      { label: '标签3标签3标签3', value: '标签3' },
      { label: '标签4', value: '标签4' },
      { label: '标签4', value: '标签4' },
      { label: '标签4', value: '标签4' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 2,
    gender: '女',
    name: '李四',
    age: 21,
    city: '上海',
    id: '2',
    tags: [
      { label: '标签5', value: '标签5' },
      { label: '标签6', value: '标签6' },
      { label: '标签7', value: '标签7' },
      { label: '标签8', value: '标签8' },
      { label: '标签8', value: '标签8' },
      { label: '标签8', value: '标签8' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 3,
    gender: '男',
    name: '王五',
    age: 22,
    city: '广州',
    id: '3',
    tags: [
      { label: '标签9', value: '标签9' },
      { label: '标签10', value: '标签10' },
      { label: '标签11', value: '标签11' },
      { label: '标签12', value: '标签12' },
      { label: '标签12', value: '标签12' },
      { label: '标签12', value: '标签12' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 4,
    gender: '女',
    name: '赵六',
    age: 23,
    city: '深圳',
    id: '4',
    tags: [
      { label: '标签13', value: '标签13' },
      { label: '标签14', value: '标签14' },
      { label: '标签15', value: '标签15' },
      { label: '标签16', value: '标签16' },
      { label: '标签16', value: '标签16' },
      { label: '标签16', value: '标签16' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 5,
    gender: '男',
    name: '孙七',
    age: 24,
    city: '成都',
    id: '5',
    tags: [
      { label: '标签17', value: '标签17' },
      { label: '标签18', value: '标签18' },
      { label: '标签19', value: '标签19' },
      { label: '标签20', value: '标签20' },
      { label: '标签20', value: '标签20' },
      { label: '标签20', value: '标签20' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 6,
    gender: '女',
    name: '周八',
    age: 25,
    city: '重庆',
    id: '6',
    tags: [
      { label: '标签21', value: '标签21' },
      { label: '标签22', value: '标签22' },
      { label: '标签23', value: '标签23' },
      { label: '标签24', value: '标签24' },
      { label: '标签24', value: '标签24' },
      { label: '标签24', value: '标签24' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  },
  {
    index: 7,
    gender: '男',
    name: '吴九',
    age: 26,
    city: '西安',
    id: '7',
    tags: [
      { label: '标签25', value: '标签25' },
      { label: '标签26', value: '标签26' },
      { label: '标签27', value: '标签27' },
      { label: '标签28', value: '标签28' },
      { label: '标签28', value: '标签28' },
      { label: '标签28', value: '标签28' }
    ],
    userTags: [
      {
        label: '张三',
        value: '张三',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '李四',
        value: '李四',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '王五',
        value: '王五',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      },
      {
        label: '赵六',
        value: '赵六',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/rabbit.jpg'
      }
    ],
    iconTags: [
      {
        label: '工作项',
        value: '工作项',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '任务',
        value: '任务',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '缺陷',
        value: '缺陷',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      },
      {
        label: '需求',
        value: '需求',
        avatar: 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/custom-render/bear.jpg'
      }
    ]
  }
]

const checkboxStateMap = {}

const toggleCheckboxVisible = (target, checkboxVisible, textVisible) => {
  if (target.forEachChildren && typeof target.forEachChildren === 'function') {
    target.forEachChildren((item) => {
      const attribute = item.attribute || {}
      if (attribute.name === 'checkbox') {
        item.setAttributes({
          visibleAll: checkboxVisible
        })
      }
      if (attribute.name === 'text') {
        item.setAttributes({
          visibleAll: textVisible
        })
      }
    })
  }
}

const toogleVisibleEditIcon = (target, visible) => {
  if (target.forEachChildren && typeof target.forEachChildren === 'function') {
    target.forEachChildren((item) => {
      const attribute = item.attribute || {}
      if (attribute.name === 'icon-edit') {
        item.setAttributes({
          visible: visible
        })
      }
    })
  }
}

const onMouseEnterGroup = (e) => {
  toogleVisibleEditIcon(e.currentTarget, true)
}

const onMouseLeaveGroup = (e) => {
  toogleVisibleEditIcon(e.currentTarget, false)
}


const onMouseEnterCheckboxCell = (e) => {
  toggleCheckboxVisible(e.currentTarget, true, false)
}

const onMouseLeaveCheckboxCell = (e, id) => {
  const isChecked = checkboxStateMap[id]
  if (isChecked) {
    toggleCheckboxVisible(e.currentTarget, true, false)
  } else {
    toggleCheckboxVisible(e.currentTarget, false, true)
  }
}

const handleCheckboxStateChange = (e) => {
  checkboxStateMap[e.originData.id] = e.checked
}

const onEditClick = (col, row) => {
  alert(`col: ${col}, row: ${row}`)
}

const formatTagItem = (item, options, tableInstance) => {
  const {
    blankWidth = 16,
    fontWeight = 400,
    fontSize = 14,
    fontFamily = 'PingFang SC',
    basePadding = CELL_PADDING * 2,
    cellWidth
  } = options
  const tagMinWidth = 48
  const tagMaxWidth = Math.max(cellWidth - basePadding, tagMinWidth)

  // 去除隐藏编码
  const label = (item.label || '').replace(/[\u200B\u2060]/g, '')
  const { width } = tableInstance.measureText(label, {
    fontSize,
    fontWeight,
    fontFamily
  })

  let textLength = Math.ceil(width) + blankWidth

  const tagWidth = Math.min(Math.max(textLength, tagMinWidth), tagMaxWidth)
  if (!item.tagProps) {
    item.tagProps = {
      fontColor: '#1959d8',
      backgroundColor: '#d9e6ff'
    }
  }
  item.tagProps.width = tagWidth
  return {
    textLength,
    tagWidth,
    tagMaxWidth,
    tagMinWidth,
    item
  }
}

const calcCellTags = (tags = [], options, tableInstance) => {
  const { rowCount = 1 } = options
  if (!tags.length) return { filterTags: [], filterTagsRowMap: {} }
  const data = cloneDeep(tags)

  const filterTags = []
  const filterTagsRowMap = {}

  const numberTagWidth = TAG_GAP + NUMBER_WIDTH
  const len = data.length
  let totalWidth = 0
  let currentRow = 1

  const addTags = (item) => {
    filterTags.push(item)
    if (!filterTagsRowMap[currentRow]) {
      filterTagsRowMap[currentRow] = []
    }
    filterTagsRowMap[currentRow].push(item)
  }

  if (len === 1) {
    const { item } = formatTagItem(data[0], options, tableInstance)
    addTags(item)
  } else if (len > 1) {
    for (let i = 0; i < len; i += 1) {
      const { item, tagMaxWidth, tagMinWidth, textLength, tagWidth } = formatTagItem(data[i], options, tableInstance)

      const handlePushItem = (item) => {
        const calcWidth = totalWidth + tagMinWidth + (i === len - 1 ? 0 : numberTagWidth)
        if (tagMaxWidth >= calcWidth) {
          const realTextWidth = Math.min(tagWidth, tagMaxWidth - totalWidth - (i === len - 1 ? 0 : numberTagWidth))
          item.tagProps.width = realTextWidth

          totalWidth = totalWidth + realTextWidth + TAG_GAP
          addTags(item)
          return false
        } else if (tagMaxWidth < calcWidth) {
          if (tagMaxWidth < totalWidth + tagMinWidth + numberTagWidth) {
            addTags({
              label: '+' + (len - filterTags.length),
              value: -1,
              tagProps: {
                fontColor: '#404A59',
                backgroundColor: '#F5F5F5',
                width: NUMBER_WIDTH
              }
            })
            return true
          }
          if (i === len - 1) {
            item.tagProps.width = Math.min(tagWidth, tagMaxWidth - totalWidth)
            addTags(item)
          } else {
            item.tagProps.width = Math.min(tagWidth, tagMaxWidth - totalWidth - numberTagWidth)
            addTags(item)
            addTags({
              label: '+' + (len - filterTags.length),
              value: -1,
              tagProps: {
                fontColor: '#404A59',
                backgroundColor: '#F5F5F5',
                width: NUMBER_WIDTH
              }
            })
          }
          return true
        }
      }

      if (currentRow >= rowCount) {
        if (handlePushItem(item)) break
      } else {
        const calcWidth = totalWidth + textLength
        if (tagMaxWidth >= calcWidth || totalWidth === 0) {
          const realTextWidth = Math.min(tagWidth, tagMaxWidth - totalWidth)
          item.tagProps.width = realTextWidth
          item.tagProps.boundsPadding = [0, 6, 6, 0]
          totalWidth = totalWidth + realTextWidth + TAG_GAP
          addTags(item)
        } else {
          currentRow += 1
          totalWidth = 0
          if (currentRow < rowCount) {
            totalWidth = totalWidth + tagWidth + TAG_GAP
            item.tagProps.boundsPadding = [0, 6, 6, 0]
            addTags(item)
          } else {
            if (handlePushItem(item)) break
          }
        }
      }
    }
  }

  return { filterTags, filterTagsRowMap }
}

const calcRowCount = (
  cellHeight,
  options
) => {
  const { lineHeight = 24, paddingTop = 4, paddingBottom = 4, lineGap = 8 } = options || {}

  // 计算实际可用的内容区域高度
  const availableHeight = cellHeight - paddingTop - paddingBottom

  // 计算可以容纳的行数
  // 第一行不需要行间距，所以可用高度减去一行高度后，再除以（行高+行间距）
  const rows = Math.floor((availableHeight - lineHeight) / (lineHeight + lineGap)) + 1

  // 确保至少显示一行
  return Math.max(1, rows)
}

const getTagsRowMap = (tags, options, tableInstance) => {
  const rowCount = calcRowCount(options.height)
  const res = calcCellTags(
    tags,
    { cellWidth: options.width, rowCount, blankWidth: options.blankWidth },
    tableInstance
  )
  return res.filterTagsRowMap
}

const option = {
  container: document.getElementById('container'),
  columns: [
    {
      field: 'index',
      title: '序号(hover 勾选)',
      width: 100,
      customLayout: (args) => {
        const { table, row, col, rect } = args
        const { height, width } = rect || table.getCellRect(col, row)
        const record = table.getRecordByRowCol(col, row)
        const container = (
          <VGroup
            attribute={{
              width,
              height
            }}
            onMouseEnter={onMouseEnterCheckboxCell}
            onMouseLeave={(e) => {
              onMouseLeaveCheckboxCell(e, record.id)
            }}
          >
            <VGroup
              attribute={{
                name: 'checkbox',
                visibleAll: !!checkboxStateMap[record.id],
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <VCheckBox attribute={{ text: { text: '' } }} />
            </VGroup>
            <VGroup
              attribute={{
                name: 'text',
                visibleAll: !checkboxStateMap[record.id],
                width,
                height,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <VText attribute={{ text: record.index, fill: '#000' }} />
            </VGroup>
          </VGroup>
        )
        return {
          rootContainer: container,
          renderDefault: false
        }
      }
    },
    {
      field: 'name',
      title: '姓名(hover 编辑)',
      width: 200,
      customLayout: (args) => {
        const { table, row, col, rect } = args
        const { width, height } = rect || table.getCellRect(col, row)
        const record = table.getRecordByRowCol(col, row)

        const container = (
          <VGroup
            attribute={{
              width: width - 32,
              dx: 16,
              height,
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={onMouseEnterGroup}
            onMouseLeave={onMouseLeaveGroup}
          >
            <VGroup
              attribute={{
                width: width - 52,
                height,
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
              }}
            >
              <VText
                attribute={{
                  text: record.name,
                  fill: '#404A59',
                  maxLineWidth: width - 52,
                  textAlign: 'left',
                  textBaseline: 'middle'
                }}
              />
            </VGroup>
            <VImage
              attribute={{
                name: 'icon-edit',
                visible: false,
                image: editSvg,
                width: 16,
                height: 16,
                boundsPadding: [0, 4, 0, 0],
                cursor: 'pointer'
              }}
              onClick={() => {
                onEditClick(col, row)
              }}
            />
          </VGroup>
        )
        return {
          rootContainer: container,
          renderDefault: false
        }
      }
    },
    {
      field: 'tags',
      title: '普通标签（响应式布局）',
      width: 300,
      minWidth: 100,
      customLayout: (args) => {
        const { table, row, col, rect } = args
        const { width, height } = rect || table.getCellRect(col, row)
        const record = table.getRecordByRowCol(col, row)
        const tagsMap = getTagsRowMap(record.tags, { width, height, blankWidth: 16 }, table) || {}

        const container = (
          <VGroup
            attribute={{
              width: width - 32,
              height,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              dx: 16
            }}
          >
            {Object.keys(tagsMap).map((key) => {
              const tag = tagsMap[key]
              return (
                <VGroup
                  key={key}
                  attribute={{
                    width: width - 32,
                    height: TAG_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    boundsPadding: [4, 0, 4, 0]
                  }}
                >
                  {tag.map((item, subIndex) => {
                    return (
                      <VGroup
                        key={item.id}
                        attribute={{
                          width: item.tagProps.width,
                          height: TAG_HEIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cornerRadius: 4,
                          fill: colors[row % colors.length].backgroundColor,
                          boundsPadding: subIndex > 0 ? [0, 0, 0, 8] : 0
                        }}
                      >
                        <VText
                          attribute={{
                            text: item.label,
                            fontSize: 14,
                            fill: colors[row % colors.length].fontColor,
                            maxLineWidth: item.tagProps.width - TAG_PADDING * 2
                          }}
                        />
                      </VGroup>
                    )
                  })}
                </VGroup>
              )
            })}
          </VGroup>
        )
        return {
          rootContainer: container,
          renderDefault: false
        }
      }
    },
    {
      field: 'userTags',
      title: '人员标签（响应式布局）',
      width: 300,
      minWidth: 100,
      customLayout: (args) => {
        const { table, row, col, rect } = args
        const { width, height } = rect || table.getCellRect(col, row)
        const record = table.getRecordByRowCol(col, row)
        const tagsMap = getTagsRowMap(record.userTags, { width, height, blankWidth: 34 }, table) || {}

        const container = (
          <VGroup
            attribute={{
              width: width - 32,
              height,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              dx: 16
            }}
          >
            {Object.keys(tagsMap).map((key) => {
              const tag = tagsMap[key]
              return (
                <VGroup
                  key={key}
                  attribute={{
                    width: width - 32,
                    height: TAG_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    boundsPadding: [4, 0, 4, 0]
                  }}
                >
                  {tag.map((item, subIndex) => {
                    return (
                      <VGroup
                        key={item.id}
                        attribute={{
                          width: item.tagProps.width,
                          height: TAG_HEIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cornerRadius: TAG_HEIGHT - 1,
                          fill: '#0a1b330f',
                          stroke: '#0a1b331f',
                          lineWidth: 1,
                          boundsPadding: subIndex > 0 ? [0, 0, 0, 8] : 0
                        }}
                      >
                        {item.value !== -1 && (
                          <VImage
                            attribute={{
                              image: item.avatar,
                              width: 16,
                              height: 16,
                              boundsPadding: [0, 4, 0, 0],
                              cornerRadius: 16
                            }}
                          />
                        )}
                        <VText
                          attribute={{
                            text: item.label,
                            fontSize: 14,
                            fill: '#535b6a',
                            maxLineWidth: item.value !== -1 ? item.tagProps.width - 34 : item.tagProps.width
                          }}
                        />
                      </VGroup>
                    )
                  })}
                </VGroup>
              )
            })}
          </VGroup>
        )
        return {
          rootContainer: container,
          renderDefault: false
        }
      }
    },
    {
      field: 'iconTags',
      title: '带图标的标签（响应式布局）',
      width: 300,
      customLayout: args => {
        const { table, row, col, rect } = args;
        const { height, width } = rect || table.getCellRect(col, row);
        const record = table.getRecordByRowCol(col, row);
        const tagsMap = getTagsRowMap(record.iconTags, { width, height, blankWidth: 34 }, table) || {}
        const container = (
          <VGroup
            attribute={{
              width: width - 32,
              height,
              display: 'flex',
              alignItems: 'center',
              alignContent: 'center',
              dx: 16
            }}
          >
            {Object.keys(tagsMap).map((key) => {
              const tag = tagsMap[key]
              return (
                <VGroup
                  key={key}
                  attribute={{
                    width: width - 32,
                    height: TAG_HEIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    overflow: 'hidden',
                    boundsPadding: [4, 0, 4, 0]
                  }}
                >
                  {tag.map((item, subIndex) => {
                    return (
                      <VGroup
                        key={item.id}
                        attribute={{
                          width: item.tagProps.width,
                          height: TAG_HEIGHT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          cornerRadius: 4,
                          fill: '#0a1b330f',
                          boundsPadding: subIndex > 0 ? [0, 0, 0, 8] : 0
                        }}
                      >
                        {item.value !== -1 && (
                          <VImage
                            attribute={{
                              image: item.avatar,
                              width: 16,
                              height: 16,
                              boundsPadding: [0, 4, 0, 0],
                              cornerRadius: 4
                            }}
                          />
                        )}
                        <VText
                          attribute={{
                            text: item.label,
                            fontSize: 14,
                            fill: '#535b6a',
                            maxLineWidth: item.value !== -1 ? item.tagProps.width - 34 : item.tagProps.width
                          }}
                        />
                      </VGroup>
                    )
                  })}
                </VGroup>
              )
            })}
          </VGroup>
        )

        return {
          rootContainer: container,
          renderDefault: false
        }
      }
    }
  ],
  records: records,
  defaultRowHeight: DEFAULT_ROW_HEIGHT
}

const addEventListeners = (instance) => {
  instance.on('checkbox_state_change', handleCheckboxStateChange)
}


const instance = new VTable.ListTable(document.getElementById(CONTAINER_ID), option);

addEventListeners(instance)
window.tableInstance = instance;
```
