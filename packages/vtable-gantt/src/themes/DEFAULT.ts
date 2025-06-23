const DEFAULT = {
  name: 'DEFAULT',
  rowSeriesNumber: {
    title: '行号',
    dragOrder: true,
    headerStyle: {
      bgColor: '#ECF1F5',
      color: '#000',
      fontWeight: 'bold',
      fontSize: 16
    },
    style: {
      bgColor: '#FAF9FB',
      color: '#000',
      fontSize: 14
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    backgroundColor: '#FDFDFD'
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title} {progress}%',
    barStyle: {
      barColor: '#82b2f5',
      completedBarColor: '#CCE0FF',
      width: 20,
      cornerRadius: 8,
      borderColor: '#0000ff',
      borderWidth: 1
    },
    milestoneStyle: {
      borderColor: '#0000ff',
      borderLineWidth: 1,
      fillColor: '#CCE0FF',
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
    backgroundColor: '#ECF1F5',
    colWidth: 60,
    verticalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#E1E4E8'
    }
  }
};

export default DEFAULT;
