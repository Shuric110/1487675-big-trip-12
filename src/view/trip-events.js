import {createElementFromTemplate} from "../util.js";

export default class TripEvents {
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
      <section class="trip-events">
        <h2 class="visually-hidden">Trip events</h2>
      </section>
    `;
  }
}
