const CONTAINER_ID = 'vTable';
import { Calendar } from '../../src';
import type { ICustomEvent } from '../../src/custom/custom-handler';

const unicColorPool = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'brown', 'gray'];
export function createTable() {
  const container = document.getElementById(CONTAINER_ID);
  const calendar = new Calendar(container, {
    tableOptions: {
      theme: {
        headerStyle: {
          color: args => {
            if (args.col === 0) {
              return 'red';
            }
            return '#000';
          }
        }
      }
    }
  });

  const bottomAddButton = document.createElement('button');
  bottomAddButton.innerText = 'Add Event';
  bottomAddButton.style.position = 'absolute';
  bottomAddButton.style.top = '10px';
  bottomAddButton.style.right = '110px';
  bottomAddButton.style.zIndex = '100';
  container?.appendChild(bottomAddButton);

  let listEventIndex = 0;
  let barEventIndex = 0;
  bottomAddButton.addEventListener('click', () => {
    const selectedDates = calendar.selectedDate;
    if (selectedDates.length === 0) {
      return;
    }

    if (selectedDates.length > 1) {
      const startDate = selectedDates[0].date;
      const endDate = selectedDates[selectedDates.length - 1].date;
      calendar.addCustomEvent({
        id: `bar-event-${barEventIndex}`,
        startDate,
        endDate,
        text: `Bar Event ${barEventIndex}`,
        type: 'bar',
        bgColor: unicColorPool[barEventIndex % unicColorPool.length],
        color: '#fff'
      });
      barEventIndex++;
    } else {
      const date = selectedDates[0].date;
      calendar.addCustomEvent({
        id: `list-event-${listEventIndex}`,
        date,
        text: `List Event ${listEventIndex}`,
        type: 'list',
        color: unicColorPool[listEventIndex % unicColorPool.length]
      });
      listEventIndex++;
    }
  });

  const bottomDeleteButton = document.createElement('button');
  bottomDeleteButton.innerText = 'Delete Event';
  bottomDeleteButton.style.position = 'absolute';
  bottomDeleteButton.style.top = '10px';
  bottomDeleteButton.style.right = '10px';
  bottomDeleteButton.style.zIndex = '100';
  container?.appendChild(bottomDeleteButton);
  bottomDeleteButton.addEventListener('click', () => {
    const selectedDates = calendar.selectedDate;
    if (selectedDates.length === 0) {
      return;
    }

    const idSet: Set<string> = new Set();
    selectedDates.map(data => {
      calendar.getCellCustomEventByLocation(data.col, data.row).map(event => {
        event.id && idSet.add(event.id);
      });
    });

    calendar.removeCustomEvents(Array.from(idSet));
  });

  window.calendar = calendar;
}
