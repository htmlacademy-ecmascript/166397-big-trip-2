import AbstractView from '../framework/view/abstract-view';
import { humanizeTripDates } from '../utils/common';

const MAX_TITLE_LENGTH = 3;

function createTripTemplate(trip, dateStart, dateEnd) {
  const title = trip.length <= MAX_TITLE_LENGTH ? trip.join(' &mdash; ') : `${trip[0]} &mdash; ... &mdash; ${trip[trip.length - 1]}`;
  const datesTemplate = dateStart && dateEnd ? humanizeTripDates(dateStart, dateEnd) : '';
  console.log(dateStart, dateEnd);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${title}</h1>
      <p class="trip-info__dates">${datesTemplate}</p>
    </div>`
  );
}

export default class TripView extends AbstractView {
  #trip = [];
  #dateStart = null;
  #dateEnd = null;

  constructor({trip, dateStart, dateEnd} = {}) {
    super();
    this.#trip = trip;
    this.#dateStart = dateStart;
    this.#dateEnd = dateEnd;
  }

  get template() {
    return createTripTemplate(this.#trip, this.#dateStart, this.#dateEnd);
  }
}
