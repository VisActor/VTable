const CONTAINER_ID = 'vTable';
import { VTableCalendar } from '../../src';

export function createTable() {
  const calendar = new VTableCalendar(document.getElementById(CONTAINER_ID));

  calendar.addCustomEvent({
    startDate: new Date(2024, 9, 21),
    endDate: new Date(2024, 9, 23),
    text: 'Event B',
    type: 'bar',
    bgColor: '#f99',
    color: '#fff'
  });

  calendar.addCustomEvent({
    startDate: new Date(2024, 9, 22),
    endDate: new Date(2024, 10, 4),
    // eslint-disable-next-line max-len
    text: 'EventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEventEvent',
    type: 'bar',
    bgColor: '#9f9',
    color: '#fff'
  });

  calendar.addCustomEvent({
    date: new Date(2024, 9, 23),
    text: 'Event A',
    type: 'list',
    color: '#f99'
  });

  calendar.addCustomEvent({
    date: new Date(2024, 9, 24),
    text: 'Event D',
    type: 'list',
    color: '#f99'
  });

  window.calendar = calendar;
}
