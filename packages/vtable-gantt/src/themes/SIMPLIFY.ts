/*
 * 甘特图 SIMPLIFY 主题，仿照 vtable 的 SIMPLIFY 主题结构
 */

const SIMPLIFY = {
  name: 'SIMPLIFY',
  underlayBackgroundColor: '#FFF',
  defaultStyle: {
    bgColor: '#FFF'
  },
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#FFF',
      borderColor: '#f2f2f2',
      color: 'rgba(0, 0, 0, 0.87)'
    },
    style: {
      bgColor: '#FFF',
      color: 'rgba(0, 0, 0, 0.87)',
      fontSize: 14
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    },
    backgroundColor: '#FFF'
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#6FA8DC',
      completedBarColor: '#D0E0E3',
      width: 20,
      cornerRadius: 8,
      borderColor: '#6FA8DC',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#6FA8DC',
      borderLineWidth: 1,
      fillColor: '#D0E0E3',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: 'rgba(0, 0, 0, 0.87)',
      textAlign: 'left'
    }
  },
  timelineHeader: {
    backgroundColor: '#FFF',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f2f2f2'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#ccc7c7'
    }
  }
};

export default SIMPLIFY;
