import moment from "moment";

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

export const formatIntervalDuration = function (beginDate, endDate) {
  let duration = Math.floor((endDate.getTime() - beginDate.getTime()) / 1000 / 60);

  const minutes = duration % 60;
  duration = (duration - minutes) / 60;
  let result = `${minutes}M`;
  if (duration === 0) {
    return result;
  }

  const hours = duration % 24;
  duration = (duration - hours) / 24;
  result = `${hours}H ${result}`;
  if (duration === 0) {
    return result;
  }

  result = `${duration}D ${result}`;
  return result;
};

export const formatDatesRange = function (beginDate, endDate) {
  const beginMonth = formatDateTime(beginDate, `MMM`);
  const beginDay = beginDate.getDate();
  const endMonth = formatDateTime(endDate, `MMM`);
  const endDay = endDate.getDate();

  let beginDateStr = beginMonth + ` ` + beginDay;
  if (beginMonth === endMonth && beginDay === endDay) {
    return beginDateStr;
  }

  return beginDateStr + ` &mdash; ` +
    (beginMonth === endMonth ? `` : endMonth + ` `) +
    endDay;
};

export const truncDate = function (date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
};

export const getTomorrow = function () {
  const tomorrow = truncDate();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};
