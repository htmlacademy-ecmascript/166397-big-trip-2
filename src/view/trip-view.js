import AbstractView from '../framework/view/abstract-view';
import { humanizeTripDates } from '../utils/common';

const MAX_TITLE_LENGTH = 3;

function createTripTemplate(destinationsNames, dateStart, dateEnd) {
  const title = destinationsNames.length <= MAX_TITLE_LENGTH ? destinationsNames.join(' &mdash; ') : `${destinationsNames[0]} &mdash; ... &mdash; ${destinationsNames[destinationsNames.length - 1]}`;
  const datesTemplate = dateStart && dateEnd ? humanizeTripDates(dateStart, dateEnd) : '';

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${datesTemplate}</p>
    </div>`
  );
}

export default class TripView extends AbstractView {
  #destinationsNames = [];
  #dateStart = null;
  #dateEnd = null;

  constructor({destinationsNames, dateStart, dateEnd} = {}) {
    super();
    this.#destinationsNames = destinationsNames;
    this.#dateStart = dateStart;
    this.#dateEnd = dateEnd;
  }

  get template() {
    return createTripTemplate(this.#destinationsNames, this.#dateStart, this.#dateEnd);
  }
}
