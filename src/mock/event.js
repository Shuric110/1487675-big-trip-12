import {getRandomElement, getRandomInteger} from "../util.js";
import {EVENT_TYPES} from "../const.js";

const DESTINATIONS = [`Amsterdam`, `Chamonix`, `Geneva`, `Brussels`, `Vienna`, `Salzburg`, `Insbruk`];
const DESCRIPTION_TEXT = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const OFFERS_MAP = {
  'flight': [
    {
      name: `Add luggage`,
      cost: 50,
      selected: true
    },
    {
      name: `Switch to comfort`,
      cost: 80,
      selected: true
    },
    {
      name: `Add meal`,
      cost: 15,
      selected: false
    },
    {
      name: `Choose seats`,
      cost: 5,
      selected: false
    },
    {
      name: `Travel by train`,
      cost: 40,
      selected: false
    },
  ],
  'taxi': [
    {
      name: `Order Uber`,
      cost: 20,
      selected: true
    },
  ],
  'drive': [
    {
      name: `Rent a car`,
      cost: 200,
      selected: true
    },
  ],
  'check-in': [
    {
      name: `Add breakfast`,
      cost: 50,
      selected: true
    },
  ],
  'sightseeing ': [
    {
      name: `Book tickets`,
      cost: 40,
      selected: true
    },
    {
      name: `Lunch in city`,
      cost: 30,
      selected: true
    },
  ],
};

const generateEvent = function (baseDateTime) {
  const eventType = getRandomElement(Object.keys(EVENT_TYPES));
  const offers = eventType in OFFERS_MAP ? OFFERS_MAP[eventType] : [];

  let durationMinutes = getRandomInteger(30, 180, 5);
  const isDurationDayPlus = EVENT_TYPES[eventType].isTrip && (getRandomInteger(1, 4) === 1);
  if (isDurationDayPlus) {
    durationMinutes += 24 * 60;
  }

  const beginDateTime = new Date(baseDateTime);
  beginDateTime.setMinutes(beginDateTime.getMinutes() + getRandomInteger(60, 180, 5));

  const endDateTime = new Date(beginDateTime);
  endDateTime.setMinutes(endDateTime.getMinutes() + durationMinutes);

  const destinationInfo = {
    photos: new Array(getRandomInteger(1, 3)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
    description: new Array(getRandomInteger(1, 5)).fill().map(() => getRandomElement(DESCRIPTION_TEXT)).join(` `)
  };

  return {
    eventType,
    destination: getRandomElement(DESTINATIONS),
    beginDateTime,
    endDateTime,
    cost: getRandomInteger(20, 600, 10),
    offers,
    destinationInfo
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
