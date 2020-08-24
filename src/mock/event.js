import {getRandomElement, getRandomInteger} from "../util/common.js";
import {EventType, EVENT_TYPES} from "../const.js";
import {DESTINATIONS} from "./destination.js";

export const EVENT_OFFERS = {
  [EventType.FLIGHT]: [
    {
      name: `Add luggage`,
      cost: 50,
      isSelected: true
    },
    {
      name: `Switch to comfort`,
      cost: 80,
      isSelected: true
    },
    {
      name: `Add meal`,
      cost: 15,
      isSelected: false
    },
    {
      name: `Choose seats`,
      cost: 5,
      isSelected: false
    },
    {
      name: `Travel by train`,
      cost: 40,
      isSelected: false
    },
  ],
  [EventType.TAXI]: [
    {
      name: `Order Uber`,
      cost: 20,
      isSelected: true
    },
  ],
  [EventType.DRIVE]: [
    {
      name: `Rent a car`,
      cost: 200,
      isSelected: true
    },
  ],
  [EventType.CHECK_IN]: [
    {
      name: `Add breakfast`,
      cost: 50,
      isSelected: true
    },
  ],
  [EventType.SIGHTSEEING]: [
    {
      name: `Book tickets`,
      cost: 40,
      isSelected: true
    },
    {
      name: `Lunch in city`,
      cost: 30,
      isSelected: true
    },
  ],
};

const eventIdSequence = {
  _currentValue: 0,

  getNextValue() {
    this._currentValue++;
    return `event-` + this._currentValue;
  }
};

const generateEvent = function (baseDateTime) {
  const type = getRandomElement(Object.keys(EVENT_TYPES));
  const offers = type in EVENT_OFFERS ? EVENT_OFFERS[type] : [];

  let durationMinutes = getRandomInteger(30, 180, 5);
  const isDurationDayPlus = EVENT_TYPES[type].isTransport && (getRandomInteger(1, 4) === 1);
  if (isDurationDayPlus) {
    durationMinutes += 24 * 60;
  }

  const beginDateTime = new Date(baseDateTime);
  beginDateTime.setMinutes(beginDateTime.getMinutes() + getRandomInteger(60, 180, 5));

  const endDateTime = new Date(beginDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);

  return {
    id: eventIdSequence.getNextValue(),
    type,
    destination: getRandomElement(DESTINATIONS),
    beginDateTime,
    endDateTime,
    cost: getRandomInteger(20, 600, 10),
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers
  };
};

export const generateEvents = function (eventsCount) {
  const result = [];
  let currentDateTime = new Date();
  currentDateTime.setHours(0, 0, 0, 0);
  currentDateTime.setDate(currentDateTime.getDate() - getRandomInteger(1, 5));

  for (let i = 0; i < eventsCount; i++) {
    const currentHour = currentDateTime.getHours();
    if (currentHour < 7) {
      currentDateTime.setHours(7, 0, 0, 0);
    }
    if (currentHour > 18) {
      currentDateTime.setHours(24 + 7, 0, 0, 0);
    }

    const evt = generateEvent(currentDateTime);
    result.push(evt);
    currentDateTime = new Date(evt.endDateTime);
  }

  return result;
};
