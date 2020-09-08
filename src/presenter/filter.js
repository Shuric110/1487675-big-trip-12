import FilterView from "../view/filter.js";

import {RenderPosition, replaceOrRender, remove} from "../util/render.js";

export default class Filter {
  constructor(filterContainer, boardModel) {
    this._filterContainer = filterContainer;
    this._boardModel = boardModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._onModelEvent = this._onModelEvent.bind(this);
    this._onFilterTypeChange = this._onFilterTypeChange.bind(this);
  }

  init() {
    this._boardModel.addObserver(this._onModelEvent);

    this._currentFilter = this._boardModel.getFilter();
    this._renderFilter();
  }

  _renderFilter() {
    const oldFilterComponent = this._filterComponent;
    this._filterComponent = new FilterView(this._boardModel.getFilterDefinitions(), this._currentFilter);
    this._filterComponent.setFilterTypeChangeHandler(this._onFilterTypeChange);

    replaceOrRender(this._filterContainer, this._filterComponent, oldFilterComponent, RenderPosition.BEFOREEND);
    remove(oldFilterComponent);
  }

  _onModelEvent(updateAction, update) {
    if (update.filter) {
      this._currentFilter = update.filter;
      this._renderFilter();
    }
  }

  _onFilterTypeChange(filterType) {
    if (filterType !== this._currentFilter.code) {
      this._boardModel.setFilter(filterType);
    }
  }

}
