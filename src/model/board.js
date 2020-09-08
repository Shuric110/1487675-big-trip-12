import Observable from "../util/observable.js";
import {UpdateAction} from "../const.js";
import moment from "moment";

export const SortType = {
  EVENT: `event`,
  TIME: `time`,
  PRICE: `price`,
};

export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const SORT_DEFINITIONS = {
  [SortType.EVENT]: {
    code: SortType.EVENT,
    title: `Event`,
    dayGrouping: true,
    compare: ({beginDateTime: a}, {beginDateTime: b}) => moment(a).diff(b, `minutes`)
  },
  [SortType.TIME]: {
    code: SortType.TIME,
    title: `Time`,
    dayGrouping: false,
    compare: ({beginDateTime: beginA, endDateTime: endA}, {beginDateTime: beginB, endDateTime: endB}) =>
      moment(endB).diff(beginB, `minutes`) - moment(endA).diff(beginA, `minutes`)
  },
  [SortType.PRICE]: {
    code: SortType.PRICE,
    title: `Price`,
    dayGrouping: false,
    compare: ({cost: a}, {cost: b}) => b - a
  },
};

const FILTER_DEFINITIONS = {
  [FilterType.EVERYTHING]: {
    code: FilterType.EVERYTHING,
    title: `Everything`,
    filter: () => true
  },
  [FilterType.FUTURE]: {
    code: FilterType.FUTURE,
    title: `Future`,
    filter: ({beginDateTime}) => moment().isBefore(beginDateTime)
  },
  [FilterType.PAST]: {
    code: FilterType.PAST,
    title: `Past`,
    filter: ({endDateTime}) => moment().isAfter(endDateTime)
  }
};


export default class Board extends Observable {
  constructor() {
    super();
    this._filter = FILTER_DEFINITIONS[FilterType.EVERYTHING];
    this._sort = SORT_DEFINITIONS[SortType.EVENT];
  }

  setFilterAndSort(filterType, sortType) {
    const update = {};

    if (filterType) {
      this._filter = FILTER_DEFINITIONS[filterType];
      update.filter = this._filter;
    }

    if (sortType) {
      this._sort = SORT_DEFINITIONS[sortType];
      update.sort = this._sort;
    }

    if (Object.keys(update).length > 0) {
      this._notify(UpdateAction.FILTER_SORT_UPDATE, update);
    }
  }

  setFilter(filterType) {
    if (filterType !== this._filter.code) {
      this.setFilterAndSort(filterType, SortType.EVENT);
    }
  }

  setSort(sortType) {
    if (sortType !== this._sort.code) {
      this.setFilterAndSort(null, sortType);
    }
  }

  getFilter() {
    return this._filter;
  }

  getSort() {
    return this._sort;
  }

  getFilterDefinitions() {
    return Object.values(FILTER_DEFINITIONS);
  }

  getSortDefinitions() {
    return Object.values(SORT_DEFINITIONS);
  }
}
