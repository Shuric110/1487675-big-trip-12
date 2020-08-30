import ComponentView from "./component.js";

export default class Sort extends ComponentView {
  constructor(sortDefinitions, currentSort) {
    super();
    this._sortDefinitions = sortDefinitions;
    this._currentSort = currentSort;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">
          ${this._currentSort.dayGrouping ? `Day` : ``}
        </span>

        ${this._sortDefinitions.map(({code, title}) => `
          <div class="trip-sort__item  trip-sort__item--${code}">
            <input id="sort-${code}" class="trip-sort__input visually-hidden" type="radio"
              name="trip-sort" value="sort-${code}" ${this._currentSort.code === code ? `checked` : ``}>
            <label class="trip-sort__btn" for="sort-${code}" data-sort="${code}">${title}</label>
          </div>
        `).join(``)}

        <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
      </form>
    `;
  }

  _sortChangeHandler(evt) {
    if (!evt.target.dataset.sort) {
      return;
    }

    evt.preventDefault();
    this._callback.sortChange(evt.target.dataset.sort);
  }

  setSortChangeHandler(callback) {
    this.getElement().addEventListener(`click`, this._sortChangeHandler);
    this._callback.sortChange = callback;
  }
}
