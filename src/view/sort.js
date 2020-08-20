import ComponentView from "./component.js";
import {SORT_TYPES} from "../const.js";

export default class Sort extends ComponentView {
  constructor() {
    super();
    this._sortMode = null;
    this._showDayTitle = true;

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  setSortMode(sortMode) {
    if (this._sortMode !== sortMode) {
      this._sortMode = sortMode;
      this.removeElement();
    }
  }

  setShowDayTitle(showDayTitle) {
    if (this._showDayTitle !== showDayTitle) {
      this._showDayTitle = showDayTitle;
      this.removeElement();
    }
  }

  getTemplate() {
    return `
      <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        <span class="trip-sort__item  trip-sort__item--day">
          ${this._showDayTitle ? `Day` : ``}
        </span>

        ${Object.entries(SORT_TYPES).map(([code, {title}]) => `
          <div class="trip-sort__item  trip-sort__item--${code}">
            <input id="sort-${code}" class="trip-sort__input visually-hidden" type="radio"
              name="trip-sort" value="sort-${code}" ${this._sortMode === code ? `checked` : ``}>
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
