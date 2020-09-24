import FilterView from "../view/filter.js";

import {RenderPosition, replaceOrRender, remove} from "../util/render.js";
import {UpdateAction} from "../const.js";

export default class Filter {
  constructor(filterContainer, boardModel, eventsModel) {
    this._filterContainer = filterContainer;
    this._boardModel = boardModel;
    this._eventsModel = eventsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  init() {
    this._boardModel.addObserver(this._onModelEvent);
    this._eventsModel.addObserver(this._onModelEvent);

    this._currentFilter = this._boardModel.getFilter();
    this._calculateAvailibility();
    this._renderFilter();
  }

  _calculateAvailibility() {
    const events = this._eventsModel.getEvents();
    this._filterDefinitions = this._boardModel.getFilterDefinitions().map(({code, title, filter: filterCallback}) => ({
      code,
      title,
      enabled: events.filter(filterCallback).length > 0
    }));
  }

  _renderFilter() {
    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(this._filterDefinitions, this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    replaceOrRender(this._filterContainer, this._filterComponent, oldFilterComponent, RenderPosition.BEFOREEND);
    remove(oldFilterComponent);
  }

  _onModelEvent(updateAction, update) {
    switch (updateAction) {
      case UpdateAction.EVENTS_INIT:
      case UpdateAction.EVENT_UPDATE:
      case UpdateAction.EVENT_ADD:
      case UpdateAction.EVENT_DELETE:
        this._calculateAvailibility();
        this._renderFilter();
        break;

      case UpdateAction.FILTER_SORT_UPDATE:
        if (update.filter) {
          this._currentFilter = update.filter;
          this._renderFilter();
        }
        break;
    }
  }

  _onFilterTypeChange(filterType) {
    if (filterType !== this._currentFilter.code) {
      this._boardModel.setFilter(filterType);
    }
  }

}
