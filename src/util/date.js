import moment from "moment";

export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;
export const MILLISECONDS_PER_SECOND = 1000;
const HOURS_PER_DAY = 24;
const MIDDAY_HOURS = 12;

const formatDateTime = function (date, format) {
  return (date instanceof Date)
    ? moment(date).format(format)
    : ``;
};

export const formatDateTimeAsISOString = function (date) {
  return formatDateTime(date, `YYYY-MM-DD HH:mm`);
};

export const formatDateAsISOString = function (date) {
  return formatDateTime(date, `YYYY-MM-DD`);
};

export const formatDateAsTimeHM = function (date) {
  return formatDateTime(date, `HH:mm`);
};

export const formatDateAsDateMD = function (date) {
  return formatDateTime(date, `MMM D`);
};

export const formatDateForEditor = function (date) {
  return formatDateTime(date, `D/MM/YYYY H:mm`);
};

export const formatDuration = function (durationMinutes) {
  let duration = durationMinutes;

  const minutes = duration % MINUTES_PER_HOUR;
  duration = (duration - minutes) / MINUTES_PER_HOUR;
  let result = `${minutes}M`;
  if (duration === 0) {
    return result;
  }

  const hours = duration % HOURS_PER_DAY;
  duration = (duration - hours) / HOURS_PER_DAY;
  result = `${hours}H ${result}`;
  if (duration === 0) {
    return result;
  }

  result = `${duration}D ${result}`;
  return result;
};

export const formatIntervalDuration = function (beginDate, endDate) {
  return formatDuration(Math.floor((endDate.getTime() - beginDate.getTime()) / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE));
};

export const formatDatesRange = function (beginDate, endDate) {
  const beginMonth = formatDateTime(beginDate, `MMM`);
  const beginDay = beginDate.getDate();
  const endMonth = formatDateTime(endDate, `MMM`);
  const endDay = endDate.getDate();

  const beginDateResult = `${beginMonth} ${beginDay}`;
  if (beginMonth === endMonth && beginDay === endDay) {
    return beginDateResult;
  }

  const endDateResult = beginMonth !== endMonth ? `${endMonth} ${endDay}` : endDay;
  return `${beginDateResult} — ${endDateResult}`;
};

export const truncDate = function (date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getTomorrow = function () {
  return moment().startOf(`day`).add(1, `days`).set(`hour`, MIDDAY_HOURS).toDate();
};
