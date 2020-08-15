export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};


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
  return date.getFullYear() +
    `-` + pad(date.getMonth() + 1) +
    `-` + pad(date.getDate()) +
    `T` + pad(date.getHours()) +
    `:` + pad(date.getMinutes());
};

export const formatDateAsTimeHM = function (date) {
  return date.getHours() + `:` + pad(date.getMinutes());
};

export const formatDateAsDateMD = function (date) {
  return date.toLocaleString(`en-US`, {month: `short`, day: `2-digit`});
};

export const formatDateForEditor = function (date) {
  return pad(date.getDate()) +
    `/` + pad(date.getMonth() + 1) +
    `/` + pad(date.getFullYear() % 100) +
    ` ` + pad(date.getHours()) +
    `:` + pad(date.getMinutes());
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
  const beginMonth = beginDate.toLocaleString(`en-US`, {month: `short`});
  const beginDay = beginDate.getDate();
  const endMonth = endDate.toLocaleString(`en-US`, {month: `short`});
  const endDay = endDate.getDate();

  let beginDateStr = beginMonth + ` ` + beginDay;
  if (beginMonth === endMonth && beginDay === endDay) {
    return beginDateStr;
  }

  return beginDateStr + ` &mdash; ` +
    (beginMonth === endMonth ? `` : endMonth + ` `) +
    endDay;
};

export const getTomorrow = function () {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
};


export const render = function (container, element, position) {
  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElementFromTemplate = function (template) {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstElementChild;
};


export const renderTpl = function (container, position, template) {
  container.insertAdjacentHTML(position, template);
};
