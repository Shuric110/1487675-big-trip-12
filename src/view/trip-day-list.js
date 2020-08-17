import {createElementFromTemplate} from "../util.js";

export default class TripDayList {
  constructor() {
    this._element = null;
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    return `
      <ul class="trip-days">
      </ul>
    `;
  }
}
