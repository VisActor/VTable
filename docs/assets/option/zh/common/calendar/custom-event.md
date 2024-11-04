{{ target: common-calendar-custom-event }}

${prefix} type('list' | 'bar')

日程类型，list为单日内的日程，bar为跨多天的日程。

${prefix} id(string)

日程的id，用于区分不同的日程

${prefix} startDate(Date)

日程的开始日期（用于跨多天的日程）】

${prefix} startDate(Date)

日程的开始日期（用于跨多天的日程）

${prefix} endDate(Date)

日程的开始日期（用于跨多天的日程）

${prefix} date(Date)

日程的日期（用于单日内的日程）

${prefix} text(string)

日程的内容

${prefix} color(string)

日程文字显示颜色

${prefix} bgColor(string)

bar日程bar显示颜色

${prefix} customInfo(any)

日程自定义信息