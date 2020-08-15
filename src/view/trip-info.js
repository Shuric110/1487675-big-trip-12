import {createElementFromTemplate} from "../util.js";

export default class Filter {
  constructor(summary) {
    this._element = null;
    this._summary = summary;
  }

  getElement() {
    if (!this._element) {
      this._element = createElementFromTemplate(this.getTemplate());
    }
    return this._element;
  }

  getTemplate() {
    const {routeSummary, journeyDates, totalCost} = this._summary;
    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${routeSummary}</h1>

          <p class="trip-info__dates">${journeyDates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>
    `;
  }
}
