import ComponentView from "./component.js";

export default class Filter extends ComponentView {
  constructor(filterDefinitions, currentFilter) {
    super();
    this._filterDefinitions = filterDefinitions;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`change`, this._filterTypeChangeHandler);
  }

  getTemplate() {
    return `
      <div>
        <h2 class="visually-hidden">Filter events</h2>
        <form class="trip-filters" action="#" method="get">
          ${this._filterDefinitions.map(({code, title}) => `
            <div class="trip-filters__filter">
              <input id="filter-${code}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter"
                value="${code}" ${code === this._currentFilter.code ? `checked` : ``}
              >
              <label class="trip-filters__filter-label" for="filter-${code}">${title}</label>
            </div>
          `).join(``)}
<!--          <div class="trip-filters__filter">
            <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" checked>
            <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future">
            <label class="trip-filters__filter-label" for="filter-future">Future</label>
          </div>

          <div class="trip-filters__filter">
            <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past">
            <label class="trip-filters__filter-label" for="filter-past">Past</label>
          </div>
-->
          <button class="visually-hidden" type="submit">Accept filter</button>
        </form>
      </div>
    `;
  }
}
