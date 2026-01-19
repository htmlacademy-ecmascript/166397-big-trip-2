import { humanizePointDate, humanizePointTime, humanizeDuration, getElementByKey, getISODate } from '../../utils';

function createOffers(offers, currentOfferType) {
  return offers.length ? offers.map((offer) => {
    const currentOffer = getElementByKey('id', offer, currentOfferType.offers);

    return `
        <li class="event__offer">
          <span class="event__offer-title">${currentOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${currentOffer.price}</span>
        </li>
      `;
  }).join('') : '';
}

function createPointTemplate(point, destinations, offersTypes) {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = point;

  const date = humanizePointDate(dateFrom);
  const humanizedDateFrom = humanizePointTime(dateFrom);
  const humanizedDateTo = humanizePointTime(dateFrom);
  const duration = humanizeDuration(dateFrom, dateTo);

  const currentDestination = getElementByKey('id', destination, destinations);
  const currentOfferType = getElementByKey('type', type, offersTypes);

  const destinationName = currentDestination ? currentDestination.name : '';
  const price = basePrice ? basePrice : '';

  const dateFromISO = getISODate(dateFrom);
  const dateToISO = getISODate(dateTo);

  const favouriteActiveClass = isFavorite ? 'event__favorite-btn--active' : '';

  const offersTemplate = createOffers(offers, currentOfferType);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFromISO}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFromISO}">${humanizedDateFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateToISO}">${humanizedDateTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${offersTemplate}
        </ul>
        <button class="event__favorite-btn ${favouriteActiveClass}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>
  `);
}

export { createPointTemplate };
