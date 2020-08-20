import {formatDatesRange} from "../util/date.js";

export const createJourneySummary = function (events) {
  if (events.length === 0) {
    return {
      routeSummary: ``,
      journeyDates: ``,
      totalCost: 0
    };
  }

  events = events.slice().sort(({beginDateTime: a}, {beginDateTime: b}) => a.getTime() - b.getTime());

  let route = [];
  let currentDestination = ``;
  let totalCost = 0;

  for (let {destination, cost, offers} of events) {
    if (destination !== currentDestination) {
      currentDestination = destination;
      route.push(destination);
    }

    totalCost += cost;
    totalCost += offers.filter(({isSelected}) => isSelected).reduce((accum, {cost: offerCost}) => accum + offerCost, 0);
  }

  const routeSummary = route.length <= 3
    ? route.join(` &mdash; `)
    : route[0] + ` &mdash; ... &mdash; ` + route[route.length - 1];

  const journeyDates = formatDatesRange(events[0].beginDateTime, events[events.length - 1].endDateTime);

  return {
    routeSummary,
    journeyDates,
    totalCost
  };
};
