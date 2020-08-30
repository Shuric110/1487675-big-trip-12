import BoardModel from "./model/board.js";
import EventsModel from "./model/events.js";
import DestinationModel from "./model/destination.js";

import MenuView from "./view/menu.js";
import TripInfoView from "./view/trip-info.js";

import FilterPresenter from "./presenter/filter.js";
import TripPresenter from "./presenter/trip.js";

import {RenderPosition, render} from "./util/render.js";

import {EVENT_OFFERS, generateEvents} from "./mock/event.js";
import {DESTINATIONS, generateDestinationsInfo} from "./mock/destination.js";
import {createJourneySummary} from "./mock/summary.js";

const EVENT_COUNT = 25;

const events = generateEvents(EVENT_COUNT);
const destinationsInfo = generateDestinationsInfo();
const journeySummary = createJourneySummary(events);

const boardModel = new BoardModel();
const eventsModel = new EventsModel();
const destinationModel = new DestinationModel();

eventsModel.setEvents(events);
destinationModel.setDestinationsInfo(destinationsInfo);
destinationModel.setDestinationsList(DESTINATIONS);
destinationModel.setSpecialOffersList(EVENT_OFFERS);

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMainContainerElement = document.querySelector(`main .page-body__container`);

const filterPresenter = new FilterPresenter(tripControlsElement, boardModel);
const tripPresenter = new TripPresenter(tripMainContainerElement, eventsModel, destinationModel, boardModel);

render(tripMainElement, new TripInfoView(journeySummary), RenderPosition.AFTERBEGIN);
render(tripControlsElement, new MenuView(), RenderPosition.BEFOREEND);

filterPresenter.init();
tripPresenter.init(events);
