const CONTAINER_ID = 'vTable';
import { VTableCalendar } from '../../src';

export function createTable() {
  const calendar = new VTableCalendar(document.getElementById(CONTAINER_ID));
}
