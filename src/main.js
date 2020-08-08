import {createEventEditorTemplate} from "./view/event-editor.js";
import {createEventTemplate} from "./view/event.js";
import {createFilterTemplate} from "./view/filter.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDayListTemplate} from "./view/trip-day-list.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripInfoTemplate} from "./view/trip-info.js";

import {render, formatDateAsDateMD} from "./util.js";

import {generateEvents} from "./mock/event.js";
import {createJourneySummary} from "./mock/summary.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const journeySummary = createJourneySummary(events);


const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, `afterbegin`, createTripInfoTemplate(journeySummary));
render(tripControlsElement, `beforeend`, createFilterTemplate());
render(tripControlsElement, `beforeend`, createMenuTemplate());

render(tripEventsElement, `beforeend`, createSortTemplate());
render(tripEventsElement, `beforeend`, createTripDayListTemplate());

const tripDayListElement = tripEventsElement.querySelector(`.trip-days`);

let currentDate = ``;
let currentDateNumber = 0;
let eventListElement;

let firstEvent = true;

for (let evt of events) {
  const eventDate = formatDateAsDateMD(evt.beginDateTime);
  if (eventDate !== currentDate) {
    currentDate = eventDate;
    currentDateNumber++;
    render(tripDayListElement, `beforeend`, createTripDayTemplate(currentDate, currentDateNumber));
    const eventListElements = tripDayListElement.querySelectorAll(`.trip-events__list`);
    eventListElement = eventListElements[eventListElements.length - 1];
  }

  if (firstEvent) {
    render(eventListElement, `beforeend`, createEventEditorTemplate(evt));
    firstEvent = false;
  } else {
    render(eventListElement, `beforeend`, createEventTemplate(evt));
  }
}
