import { humanizePointDate, humanizePointTime, humanizeDuration, getElementByKey } from '../../utils';

function createOffersTemplate(offers, currentOfferTypeList) {
  return offers?.length ?
    `<ul class="event__selected-offers">${offers.map((offer) => {
      const currentOffer = getElementByKey('id', offer, currentOfferTypeList);

      return `
          <li class="event__offer">
            <span class="event__offer-title">${currentOffer.title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${currentOffer.price}</span>
          </li>
        `;
    }).join('')}
    </ul>` : '';
}

function createPointTemplate(point, destinations, offersTypes) {
  const { basePrice, dateFrom, dateTo, destination, isFavorite, offers, type } = point;

  const currentDestination = getElementByKey('id', destination, destinations);
  const currentOfferTypeList = getElementByKey('type', type, offersTypes).offers;

  const date = humanizePointDate(dateFrom);
  const humanizedDateFrom = humanizePointTime(dateFrom);
  const humanizedDateTo = humanizePointTime(dateFrom);
  const duration = humanizeDuration(dateFrom, dateTo);
  const destinationName = currentDestination ? currentDestination.name : '';
  const price = basePrice || '';
  const favouriteActiveClass = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = createOffersTemplate(offers, currentOfferTypeList);

  return (`
    <li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${date}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type} icon">
        </div>
        <h3 class="event__title">${type} ${destinationName}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dateFrom}">${humanizedDateFrom}</time>
            &mdash;
            <time class="event__end-time" datetime="${dateTo}">${humanizedDateTo}</time>
          </p>
          <p class="event__duration">${duration}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        ${offersTemplate}
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
