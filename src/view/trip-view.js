import AbstractView from '../framework/view/abstract-view';
const DEFAULT_TITLE = 'Amsterdam &mdash; Chamonix &mdash; Geneva';
const DEFAULT_DATES = '18&nbsp;&mdash;&nbsp;20 Mar';

function createTripTemplate(title, dates) {
  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${dates}</p>
    </div>`
  );
}

export default class TripView extends AbstractView {
  #title = null;
  #dates = null;

  constructor({title, dates} = {}) {
    super();
    this.#title = title || DEFAULT_TITLE;
    this.#dates = dates || DEFAULT_DATES;
  }

  get template() {
    return createTripTemplate(this.#title, this.#dates);
  }
}
