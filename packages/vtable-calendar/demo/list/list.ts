const CONTAINER_ID = 'vTable';
import { VTableCalendar } from '../../src';

export function createTable() {
  const calendar = new VTableCalendar(document.getElementById(CONTAINER_ID));

  calendar.addCustomEvent({
    id: 'Event B',
    startDate: new Date(2024, 9, 21),
    endDate: new Date(2024, 9, 23),
    text: 'Event B',
    type: 'bar',
    bgColor: '#f99',
    color: '#fff'
  });

  calendar.addCustomEvent({
    id: 'Event C',
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
    id: 'Event A',
    type: 'list',
    color: '#f99'
  });

  calendar.addCustomEvent({
    date: new Date(2024, 9, 24),
    text: 'Event D',
    id: 'Event D',
    type: 'list',
    color: '#f99'
  });

  window.calendar = calendar;

  calendar.on('calendar_date_click', e => {
    console.log('calendar_date_click', e);
  });

  calendar.on('selected_date', e => {
    console.log('selected_date', e);
  });

  calendar.on('selected_date_clear', e => {
    console.log('selected_date_clear', e);
  });

  calendar.on('drag_select_date_end', e => {
    console.log('drag_select_date_end', e);
  });

  calendar.on('calendar_custom_event_click', e => {
    console.log('calendar_custom_event_click', e);
  });
}
