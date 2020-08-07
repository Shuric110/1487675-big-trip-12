export const getRandomInteger = function (a = 0, b = 1, divider = 1) {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  let result = Math.floor(lower + Math.random() * (upper - lower + 1));
  result = result - result % divider;
  if (result < lower) {
    result += divider;
  }

  return result;
};

export const getRandomElement = function (elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
};

export const escapeHtml = function (html) {
  return html
    .replace(/&/g, `&amp;`)
    .replace(/</g, `&lt;`)
    .replace(/>/g, `&gt;`)
    .replace(/"/g, `&quot;`)
    .replace(/'/g, `&#039;`);
};

const pad = function (number) {
  if (number < 10) {
    return `0` + number;
  }
  return number;
};

export const formatDateAsISOString = function (date) {
  return date.getUTCFullYear() +
    `-` + pad(date.getUTCMonth() + 1) +
    `-` + pad(date.getUTCDate()) +
    `T` + pad(date.getUTCHours()) +
    `:` + pad(date.getUTCMinutes());
};

export const formatDateAsTimeHM = function (date) {
  return date.getUTCHours() + `:` + pad(date.getUTCMinutes());
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

export const render = function (container, position, template) {
  container.insertAdjacentHTML(position, template);
};
