import {getRandomElement, getRandomInteger} from "../util/common.js";

export const DESTINATIONS = [`Amsterdam`, `Chamonix`, `Geneva`, `Brussels`, `Vienna`, `Salzburg`, `Insbruk`];

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

export const generateDestinationsInfo = function () {
  return Object.fromEntries(DESTINATIONS.map((destination) => [
    destination,
    {
      photos: new Array(getRandomInteger(1, 3)).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`),
      description: new Array(getRandomInteger(1, 5)).fill().map(() => getRandomElement(DESCRIPTION_TEXT)).join(` `)
    }
  ]));
};
