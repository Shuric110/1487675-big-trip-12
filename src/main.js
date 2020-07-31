import {createEventEditorTemplate} from "./view/event-editor.js";
import {createEventTemplate} from "./view/event.js";
import {createFilterTemplate} from "./view/filter.js";
import {createMenuTemplate} from "./view/menu.js";
import {createSortTemplate} from "./view/sort.js";
import {createTripDayListTemplate} from "./view/trip-day-list.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripInfoTemplate} from "./view/trip-info.js";

const TRIP_COUNT = 3;


const renderTemplate = function (container, position, template) {
  container.insertAdjacentHTML(position, template);
};


const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripEventsElement = document.querySelector(`.trip-events`);

renderTemplate(tripMainElement, `afterbegin`, createTripInfoTemplate());
renderTemplate(tripControlsElement, `beforeend`, createFilterTemplate());
renderTemplate(tripControlsElement, `beforeend`, createMenuTemplate());

renderTemplate(tripEventsElement, `beforeend`, createSortTemplate());
renderTemplate(tripEventsElement, `beforeend`, createTripDayListTemplate());

const tripDayListElement = tripEventsElement.querySelector(`.trip-days`);
renderTemplate(tripDayListElement, `beforeend`, createTripDayTemplate());

const eventListElement = tripDayListElement.querySelector(`.trip-events__list`);
renderTemplate(eventListElement, `beforeend`, createEventEditorTemplate());

for (let i = 0; i < TRIP_COUNT; i++) {
  renderTemplate(eventListElement, `beforeend`, createEventTemplate());
}
