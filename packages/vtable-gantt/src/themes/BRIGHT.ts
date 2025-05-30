const BRIGHT = {
  name: 'BRIGHT',
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#5389FF',
      borderColor: '#A1C1FF',
      color: '#FFF'
    },
    style: {
      bgColor: '#F4F8FF',
      color: '#000',
      fontSize: 14
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    backgroundColor: '#FFF'
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#5389FF',
      completedBarColor: '#E0EAFE',
      width: 20,
      cornerRadius: 8,
      borderColor: '#5286FA',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#A1C1FF',
      borderLineWidth: 1,
      fillColor: '#5389FF',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#000',
      textAlign: 'left'
    }
  },
  timelineHeader: {
    backgroundColor: '#5389FF',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e1e4e8'
    }
  }
};

export default BRIGHT;
