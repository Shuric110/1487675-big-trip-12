import TripInfoView from "../view/trip-info.js";

import {UpdateAction} from "../const.js";
import {RenderPosition, replaceOrRender, remove} from "../util/render.js";
import {formatDatesRange} from "../util/date.js";

export default class TripInfo {
  constructor(tripInfoContainer, eventsModel) {
    this._tripInfoContainer = tripInfoContainer;
    this._eventsModel = eventsModel;

    this._tripInfoComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
  }

  init() {
    this._eventsModel.addObserver(this._onModelEvent);
    this._renderTripInfo();
  }

  _onModelEvent(updateAction) {
    if ([UpdateAction.EVENT_ADD, UpdateAction.EVENT_DELETE, UpdateAction.EVENT_UPDATE, UpdateAction.EVENTS_INIT].indexOf(updateAction) >= 0) {
      this._renderTripInfo();
    }
  }

  _renderTripInfo() {
    const summary = this._createJourneySummary(this._eventsModel.getEvents());

    const oldTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(summary);

    replaceOrRender(this._tripInfoContainer, this._tripInfoComponent, oldTripInfoComponent, RenderPosition.AFTERBEGIN);
    remove(oldTripInfoComponent);
  }

  _createJourneySummary(events) {
    if (events.length === 0) {
      return {
        routeSummary: ``,
        journeyDates: ``,
        totalCost: 0
      };
    }

    events = events.slice().sort(({beginDateTime: a}, {beginDateTime: b}) => a.getTime() - b.getTime());

    let route = [];
    let currentDestination = ``;
    let totalCost = 0;

    for (let {destination, cost, offers} of events) {
      if (destination !== currentDestination) {
        currentDestination = destination;
        route.push(destination);
      }

      totalCost += cost;
      totalCost += offers.reduce((accum, {cost: offerCost}) => accum + offerCost, 0);
    }

    const routeSummary = route.length <= 3
      ? route.join(` — `)
      : route[0] + ` — ... — ` + route[route.length - 1];

    const journeyDates = formatDatesRange(events[0].beginDateTime, events[events.length - 1].endDateTime);

    return {
      routeSummary,
      journeyDates,
      totalCost
    };
  }
}
