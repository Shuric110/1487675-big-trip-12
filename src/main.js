import {createEventEditorTemplate} from "./view/event-editor.js";
import {createEventTemplate} from "./view/event.js";
import {createFilterTemplate} from "./view/filter.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDayListTemplate} from "./view/trip-day-list.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripInfoTemplate} from "./view/trip-info.js";

import {render} from "./util.js";

import {generateEvents} from "./mock/event.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);


const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

render(tripMainElement, `afterbegin`, createTripInfoTemplate());
render(tripControlsElement, `beforeend`, createFilterTemplate());
render(tripControlsElement, `beforeend`, createMenuTemplate());

render(tripEventsElement, `beforeend`, createSortTemplate());
render(tripEventsElement, `beforeend`, createTripDayListTemplate());

const tripDayListElement = tripEventsElement.querySelector(`.trip-days`);
render(tripDayListElement, `beforeend`, createTripDayTemplate());

const eventListElement = tripDayListElement.querySelector(`.trip-events__list`);

render(eventListElement, `beforeend`, createEventEditorTemplate(events[0]));
for (let i = 1; i < events.length; i++) {
  render(eventListElement, `beforeend`, createEventTemplate(events[i]));
}
