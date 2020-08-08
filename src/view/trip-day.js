export const createTripDayTemplate = function (date, number) {
  return `
    <li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${number}</span>
        <time class="day__date" datetime="2019-03-18">${date}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>
  `;
};
