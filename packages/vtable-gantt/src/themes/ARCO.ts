const ARCO = {
  name: 'ARCO',
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#EEF1F5',
      borderColor: '#e1e4e8',
      color: '#1B1F23'
    },
    style: {
      bgColor: '#FFF',
      color: '#1B1F23',
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
      barColor: '#ee8800',
      completedBarColor: '#91e8e0',
      width: 20,
      cornerRadius: 8,
      borderColor: 'black',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#3073f2',
      borderLineWidth: 1,
      fillColor: '#c8daf6',
      width: 15,
      cornerRadius: 0
    },
    labelTextStyle: {
      fontFamily: 'Arial',
      fontSize: 14,
      color: '#1B1F23',
      textAlign: 'left'
    }
  },
  timelineHeader: {
    backgroundColor: '#EEF1F5',
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

export default ARCO;
