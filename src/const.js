export const SortMode = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const SORT_TYPES = {
  [SortMode.EVENT]: {
    title: `Event`,
    compare: null
  },
  [SortMode.TIME]: {
    title: `Time`,
    compare({beginDateTime: beginA, endDateTime: endA}, {beginDateTime: beginB, endDateTime: endB}) {
      return (endB.getTime() - beginB.getTime()) - (endA.getTime() - beginA.getTime());
    }
  },
  [SortMode.PRICE]: {
    title: `Price`,
    compare({cost: a}, {cost: b}) {
      return b - a;
    }
  },
};

export const EVENT_TYPES = {
  'taxi': {
    displayName: `Taxi`,
    titlePrefix: `Taxi to `,
    isTransport: true
  },
  'bus': {
    displayName: `Bus`,
    titlePrefix: `Bus to `,
    isTransport: true
  },
  'train': {
    displayName: `Train`,
    titlePrefix: `Train to `,
    isTransport: true
  },
  'ship': {
    displayName: `Ship`,
    titlePrefix: `Ship to `,
    isTransport: true
  },
  'transport': {
    displayName: `Transport`,
    titlePrefix: `Transport to `,
    isTransport: true
  },
  'drive': {
    displayName: `Drive`,
    titlePrefix: `Drive to `,
    isTransport: true
  },
  'flight': {
    displayName: `Flight`,
    titlePrefix: `Flight to `,
    isTransport: true
  },
  'check-in': {
    displayName: `Check-in`,
    titlePrefix: `Check-in in `,
    isTransport: false
  },
  'sightseeing': {
    displayName: `Sightseeing`,
    titlePrefix: `Sightseeing in `,
    isTransport: false
  },
  'restaurant': {
    displayName: `Restaurant`,
    titlePrefix: `Restaurant in `,
    isTransport: false
  },
};
