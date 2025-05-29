// vtable-gantt/src/themes/DARK.ts
// 仅迁移甘特相关主题字段
const DARK = {
  name: 'DARK',
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#373b45',
      borderColor: '#444A54',
      color: '#D3D5DA'
    },
    style: {
      bgColor: '#2d3137',
      color: '#D3D5DA',
      fontSize: 12
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    backgroundColor: '#282a2e'
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#4284FF',
      completedBarColor: '#2F4774',
      width: 20,
      cornerRadius: 8,
      borderColor: '#4284FF',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#4284FF',
      borderLineWidth: 1,
      fillColor: '#2F4774',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'PingFang SC',
      fontSize: 12,
      color: '#D3D5DA',
      textAlign: 'left'
    }
  },
  timelineHeader: {
    backgroundColor: '#373b45',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#444A54'
    }
  }
};

export default DARK;
