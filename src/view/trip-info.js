import ComponentView from "./component.js";
import he from "he";

export default class TripInfo extends ComponentView {
  constructor(summary) {
    super();
    this._summary = summary;
  }

  getTemplate() {
    const {routeSummary, journeyDates, totalCost} = this._summary;
    return `
      <section class="trip-main__trip-info  trip-info">
        <div class="trip-info__main">
          <h1 class="trip-info__title">${he.encode(routeSummary)}</h1>

          <p class="trip-info__dates">${journeyDates}</p>
        </div>

        <p class="trip-info__cost">
          Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
        </p>
      </section>
    `;
  }
}
