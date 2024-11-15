import { max, min } from 'date-fns';
import type { Calendar } from '../month-calendar';
import { merge } from '@visactor/vutils';

const CUSTOM_CONTAINER_NAME = 'custom-container';

export interface ICustomEventOptions {
  contentHeight?: number;
  barHeight?: number;
  fontSize?: number;
  contentPadding?: number;
  barCornerRadius?: number;
  circleRadius?: number;
}

type ICellCustomEvent = {
  keys: number[];
  values: {
    [key: number]: IEventData;
  };
};

export interface ICustomEvent {
  type: 'list' | 'bar';
  id?: string;

  // list: date; bar: startDate+endDate
  startDate?: Date;
  endDate?: Date;
  date?: Date;

  text: string;
  color?: string; // text color
  bgColor?: string; // bar background color
  // style config in global option
  // fontSize?: number;
  // fontFamily?: string;
  // fontWeight?: string;

  customInfo?: any; // user custom data
}

export interface IEventData extends ICustomEvent {
  col: number;
  row: number;
  index: number; // event content index in all cells about this event
}

export class CustomEventHandler {
  calendar: Calendar;
  cellEvents: Map<string, ICellCustomEvent> = new Map();
  events: ICustomEvent[] = [];
  customEventOptions: Required<ICustomEventOptions>;
  constructor(calendar: Calendar, customEventOptions?: ICustomEventOptions) {
    this.calendar = calendar;
    this.customEventOptions = merge(
      {
        contentHeight: 24,
        barHeight: 18,
        fontSize: 14,
        contentPadding: 5,
        barCornerRadius: 5,
        circleRadius: 5
      },
      customEventOptions
    );
  }

  getCellCustomEvent(col: number, row: number) {
    return this.cellEvents.get(`${col}-${row}`);
  }

  setCellCustomEvent(col: number, row: number, events: ICellCustomEvent) {
    this.cellEvents.set(`${col}-${row}`, events);
  }

  addEvent(event: ICustomEvent) {
    const { date, startDate, endDate } = event;
    if (!date && (!startDate || !endDate)) {
      return;
    }
    if (event.type === 'list') {
      const location = this.calendar.getCellLocation(date);
      if (!location) {
        return;
      }
      const { col, row } = location;
      const eventData: IEventData = { ...event, col, row, index: 0 };
      const cellCustomEvent = this.getCellCustomEvent(col, row);
      if (!cellCustomEvent) {
        const events = {
          keys: [0],
          values: {
            0: eventData
          }
        };
        this.setCellCustomEvent(col, row, events);
        this.calendar.table.scenegraph.updateCellContent(col, row);
        this.events.push(event);
        return;
      }

      const keys = cellCustomEvent.keys;
      if (keys.length === 0) {
        cellCustomEvent.keys.push(0);
        cellCustomEvent.values[0] = eventData;
        this.calendar.table.scenegraph.updateCellContent(col, row);
        this.events.push(event);
        return;
      }

      // find single location from index 0
      let isInsert = false;
      for (let i = 0; i < keys[keys.length - 1]; i++) {
        if (!cellCustomEvent.values[i]) {
          eventData.index = i;
          // insert index into keys
          keys.push(i);
          keys.sort((a, b) => a - b);
          cellCustomEvent.values[i] = eventData;
          isInsert = true;
          break;
        }
      }

      if (!isInsert) {
        const index = keys[keys.length - 1] + 1;
        eventData.index = index;
        cellCustomEvent.keys.push(index);
        cellCustomEvent.values[index] = eventData;
      }

      this.calendar.table.scenegraph.updateCellContent(col, row);
    } else {
      // bar
      const startLocation = this.calendar.getCellLocation(max([startDate, this.calendar.startDate]));
      const endLocation = this.calendar.getCellLocation(min([endDate, this.calendar.endDate]));
      if (!startLocation || !endLocation) {
        return;
      }

      // get index of this evemt
      let col = startLocation.col;
      let row = startLocation.row;
      let maxIndex = -1;
      while (row < endLocation.row || (col <= endLocation.col && row === endLocation.row)) {
        const cellCustomEvent = this.getCellCustomEvent(col, row) as ICellCustomEvent;
        if (cellCustomEvent) {
          // get max index in this cellCustomEvent
          const keys = cellCustomEvent.keys;
          const maxKey = keys[keys.length - 1];
          if (maxKey > maxIndex) {
            maxIndex = maxKey;
          }
        }

        col++;
        if (col > this.calendar.maxCol) {
          col = this.calendar.minCol;
          row++;
        }
      }

      // insert into cellCustomEvent
      col = startLocation.col;
      row = startLocation.row;
      while (row < endLocation.row || (col <= endLocation.col && row === endLocation.row)) {
        const cellCustomEvent = this.getCellCustomEvent(col, row) as ICellCustomEvent;
        const eventData: IEventData = { ...event, col, row, index: maxIndex + 1 };
        if (!cellCustomEvent) {
          const events = {
            keys: [maxIndex + 1],
            values: {
              [maxIndex + 1]: eventData
            }
          };
          this.setCellCustomEvent(col, row, events);
        } else {
          const keys = cellCustomEvent.keys;
          keys.push(maxIndex + 1);
          keys.sort((a, b) => a - b);
          cellCustomEvent.values[maxIndex + 1] = eventData;
        }

        this.calendar.table.scenegraph.updateCellContent(col, row);

        col++;
        if (col > this.calendar.maxCol) {
          col = this.calendar.minCol;
          row++;
        }
      }
    }

    this.events.push(event);
  }

  addEvents(events: ICustomEvent[]) {
    events.forEach(event => {
      this.addEvent(event);
    });
  }

  removeEvents(ids: string[]) {
    ids.forEach(id => {
      this._removeEvent(id);
    });

    // readd custom event
    const newEvents = this.events.filter(event => {
      if (event.id && ids.includes(event.id)) {
        return false;
      }
      return true;
    });

    this.events.length = 0;
    this.cellEvents.clear();

    newEvents.forEach(event => {
      this.addEvent(event);
    });
  }

  _removeEvent(id: string) {
    if (!id) {
      return;
    }
    const event = this.events.find(event => {
      if (event.id === id) {
        return true;
      }
      return false;
    });

    if (!event) {
      return;
    }

    // clear custom graphic in this event
    const { date, startDate, endDate } = event;
    if (event.type === 'list') {
      const { col, row } = this.calendar.getCellLocation(date);
      const cellGroup = this.calendar.table.scenegraph.getCell(col, row);
      const customGroup = cellGroup.getChildByName(CUSTOM_CONTAINER_NAME);
      customGroup && cellGroup.removeChild(customGroup);
    } else {
      // bar
      const startLocation = this.calendar.getCellLocation(max([startDate, this.calendar.startDate]));
      const endLocation = this.calendar.getCellLocation(min([endDate, this.calendar.endDate]));

      let col = startLocation.col;
      let row = startLocation.row;
      while (row < endLocation.row || (col <= endLocation.col && row === endLocation.row)) {
        const cellGroup = this.calendar.table.scenegraph.getCell(col, row);
        const customGroup = cellGroup.getChildByName(CUSTOM_CONTAINER_NAME);
        customGroup && cellGroup.removeChild(customGroup);

        col++;
        if (col > this.calendar.maxCol) {
          col = this.calendar.minCol;
          row++;
        }
      }
    }
  }

  updateEvents(events: ICustomEvent[]) {
    events.forEach(event => {
      this._removeEvent(event.id);
      // replace event in this.events
      const oldEvent = this.events.find(e => {
        if (e.id === event.id) {
          return true;
        }
        return false;
      });
      // const newEvent = merge(oldEvent, event);
      // this.events.splice(this.events.indexOf(oldEvent), 1, newEvent);
      merge(oldEvent, event);
    });

    // readd custom event
    const oldEvents = this.events;
    this.events = [];
    this.cellEvents.clear();

    oldEvents.forEach(event => {
      this.addEvent(event);
    });
  }
}
