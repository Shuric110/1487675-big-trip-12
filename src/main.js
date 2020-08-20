import FilterView from "./view/filter.js";
import MenuView from "./view/menu.js";
import TripInfoView from "./view/trip-info.js";

import TripPresenter from "./presenter/trip.js";

import {RenderPosition, render} from "./util/render.js";

import {generateEvents} from "./mock/event.js";
import {createJourneySummary} from "./mock/summary.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const journeySummary = createJourneySummary(events);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMainContainerElement = document.querySelector(`main .page-body__container`);

const tripPresenter = new TripPresenter(tripMainContainerElement);


render(tripMainElement, new TripInfoView(journeySummary), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new MenuView(), RenderPosition.BEFOREEND);
render(tripControlsElement, new FilterView(), RenderPosition.BEFOREEND);

tripPresenter.init(events);
