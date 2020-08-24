export const SortMode = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const EventType = {
  TAXI: `taxi`,
  BUS: `bus`,
  TRAIN: `train`,
  SHIP: `ship`,
  TRANSPORT: `transport`,
  DRIVE: `drive`,
  FLIGHT: `flight`,
  CHECK_IN: `check-in`,
  SIGHTSEEING: `sightseeing`,
  RESTAURANT: `restaurant`
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
  [EventType.TAXI]: {
    displayName: `Taxi`,
    titlePrefix: `Taxi to `,
    isTransport: true
  },
  [EventType.BUS]: {
    displayName: `Bus`,
    titlePrefix: `Bus to `,
    isTransport: true
  },
  [EventType.TRAIN]: {
    displayName: `Train`,
    titlePrefix: `Train to `,
    isTransport: true
  },
  [EventType.SHIP]: {
    displayName: `Ship`,
    titlePrefix: `Ship to `,
    isTransport: true
  },
  [EventType.TRANSPORT]: {
    displayName: `Transport`,
    titlePrefix: `Transport to `,
    isTransport: true
  },
  [EventType.DRIVE]: {
    displayName: `Drive`,
    titlePrefix: `Drive to `,
    isTransport: true
  },
  [EventType.FLIGHT]: {
    displayName: `Flight`,
    titlePrefix: `Flight to `,
    isTransport: true
  },
  [EventType.CHECK_IN]: {
    displayName: `Check-in`,
    titlePrefix: `Check-in in `,
    isTransport: false
  },
  [EventType.SIGHTSEEING]: {
    displayName: `Sightseeing`,
    titlePrefix: `Sightseeing in `,
    isTransport: false
  },
  [EventType.RESTAURANT]: {
    displayName: `Restaurant`,
    titlePrefix: `Restaurant in `,
    isTransport: false
  },
};
