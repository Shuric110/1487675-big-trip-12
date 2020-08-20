import ComponentView from "../view/component.js";

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`
};

export const createElementFromTemplate = function (template) {
  const container = document.createElement(`div`);
  container.innerHTML = template;
  return container.firstElementChild;
};

export const render = function (container, element, position) {
  if (container instanceof ComponentView) {
    container = container.getContainerElement();
  }

  if (element instanceof ComponentView) {
    element = element.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const replace = (newChild, oldChild) => {
  if (oldChild instanceof ComponentView) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof ComponentView) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Can't replace unexisting elements`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (!(component instanceof ComponentView)) {
    throw new Error(`Can remove only components`);
  }

  component.getElement().remove();
  component.removeElement();
};
