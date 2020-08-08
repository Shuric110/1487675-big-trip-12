export const createTripInfoTemplate = function ({routeSummary, journeyDates, totalCost}) {
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
};
