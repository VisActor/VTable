import type { CustomRenderFunctionArg } from '@visactor/vtable/es/ts-types';
import { Group, Text, Rect, Circle } from '@visactor/vtable/es/vrender';
import type { Calendar } from '../month-calendar';
import { differenceInDays, startOfDay } from 'date-fns';

export function calendarCustomLayout(args: CustomRenderFunctionArg) {
  const { table, row, col, rect } = args;
  const calendar = (table as any).options._calendar as Calendar;
  // const record = table.getRecordByCell(col, row);
  const { height, width } = rect ?? table.getCellRect(col, row);

  const cellDate = calendar.getCellDate(col, row);
  const customEvents = calendar.customHandler.getCellCustomEvent(col, row);

  const { contentHeight, barHeight, fontSize, contentPadding, barCornerRadius, circleRadius } =
    calendar.customHandler.customEventOptions;

  if (!customEvents) {
    return undefined;
  }

  const textHeight = (table.theme.bodyStyle.fontSize as number) + 10; // padding

  const container = new Group({
    x: 0,
    y: textHeight,
    height: height - textHeight, // text height
    width
    // display: 'flex',
    // flexDirection: 'column',
    // flexWrap: 'nowrap'
  });

  const { keys, values } = customEvents;
  const lastKey = keys[keys.length - 1];

  let y = 0;
  for (let i = 0; i <= lastKey; i++) {
    const event = values[i];
    if (!event) {
      // add empty rect for ocupy space
      const emptyGroup = new Group({
        x: 0,
        y,
        width: width,
        height: contentHeight,
        fill: false,
        stroke: false,
        clip: true
      }) as any;
      container.add(emptyGroup);
    } else if (event.type === 'list') {
      const listGroup = new Group({
        x: 0,
        y,
        width: width,
        height: contentHeight,
        fill: false,
        stroke: false,
        clip: true,
        cursor: 'pointer'
      }) as any;
      container.add(listGroup);
      listGroup._role = 'calendar-custom-event';
      listGroup._customEvent = event;

      const circle = new Circle({
        radius: circleRadius,
        fill: event.color,
        x: contentPadding + circleRadius,
        y: contentHeight / 2,
        pickable: false
      });
      listGroup.add(circle);

      const text = new Text({
        x: contentPadding + circleRadius * 2 + contentPadding,
        y: contentHeight / 2,
        text: event.text,
        fontSize,
        fill: event.color,
        textAlign: 'left',
        textBaseline: 'middle',
        pickable: false
      });
      listGroup.add(text);
    } else {
      const { startDate, endDate } = event;
      // bar
      const barGroup = new Group({
        x: 0,
        y,
        width: width,
        height: contentHeight,
        fill: false,
        stroke: false,
        clip: true,
        cursor: 'pointer'
      }) as any;
      container.add(barGroup);
      barGroup._role = 'calendar-custom-event';
      barGroup._customEvent = event;

      const rect = new Rect({
        x: 0,
        y: (contentHeight - barHeight) / 2,
        width: width,
        height: barHeight,
        fill: event.bgColor,
        cornerRadius: getRectCornerRadius(startDate, endDate, cellDate, barCornerRadius),
        pickable: false
      });
      barGroup.add(rect);

      const days = differenceInDays(startOfDay(startDate), startOfDay(cellDate));
      const text = new Text({
        x: contentPadding,
        y: contentHeight / 2,
        dx: days * width,
        text: event.text,
        fontSize,
        fill: event.color,
        textAlign: 'left',
        textBaseline: 'middle',
        pickable: false
      });
      barGroup.add(text);
    }

    y += contentHeight;
  }

  return {
    rootContainer: container,
    renderDefault: true
  };
}

function getRectCornerRadius(startDate: Date, endDate: Date, cellDate: Date, cornerRadius: number) {
  if (startDate.getDate() === endDate.getDate()) {
    return cornerRadius;
  } else if (startDate.getDate() === cellDate.getDate()) {
    return [cornerRadius, 0, 0, cornerRadius];
  } else if (endDate.getDate() === cellDate.getDate()) {
    return [0, cornerRadius, cornerRadius, 0];
  }
  return 0;
}
