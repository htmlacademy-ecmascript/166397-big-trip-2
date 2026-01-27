import AbstractView from '../framework/view/abstract-view';
const TEXT_DEFAULT = 'Click New Event to create your first point';

function createListEmptyTemplate(text) {
  return `<p class="trip-events__msg">${text}</p>`;
}

export default class ListEmptyView extends AbstractView {
  #text = null;

  constructor({text} = {}) {
    super();
    this.#text = text || TEXT_DEFAULT;
  }

  get template() {
    return createListEmptyTemplate(this.#text);
  }
}
