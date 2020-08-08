import {EVENT_TYPES} from "../const.js";

export const getJouneyStatistics = function (events) {
  const statistics = {};

  for (let evt of events) {
    let statItem = {cost: 0, timeMinutes: 0, count: 0};
    if (evt.type in statistics) {
      statItem = statistics[evt.type];
    }

    statItem.cost += evt.cost;
    statItem.timeMinutes += Math.floor((evt.endDateTime.getTime() - evt.beginDateTime.getTime()) / 1000 / 60);
    statItem.count++;

    statistics[evt.type] = statItem;
  }

  return {
    money: Object.fromEntries(
        Object.entries(statistics)
          .map(([type, {cost}]) => [type, cost])
    ),
    transport: Object.fromEntries(
        Object.entries(statistics)
          .filter(([type]) => EVENT_TYPES[type].isTransport)
          .map(([type, {count}]) => [type, count])
    ),
    timeSpent: Object.fromEntries(
        Object.entries(statistics)
          .map(([type, {timeMinutes}]) => [type, timeMinutes])
    )
  };
};
