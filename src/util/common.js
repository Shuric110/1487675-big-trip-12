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

export const updateItem = function (items, update) {
  const index = items.findIndex((item) => item.id === update.id);

  if (index >= 0) {
    items[index] = update;
  }
};
