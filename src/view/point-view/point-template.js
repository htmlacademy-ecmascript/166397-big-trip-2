import { humanizePointDate, humanizePointTime, humanizeDuration } from '../../utils/point';
import { getElementByKey } from '../../utils/common';

function createOffersTemplate(offers, currentOffers) {
  return `
    <ul class="event__selected-offers">
    ${offers.map((offer) => {
    const currentOffer = getElementByKey('id', offer, currentOffers);
    const {title, price} = currentOffer;

    return `
      <li class="event__offer">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </li>`;
  }).join('')}
    </ul>`;
}

function createPointTemplate(point, destination, currentOffers) {
  const { base_price: basePrice, date_from: dateFrom, date_to: dateTo, is_favorite: isFavorite, offers, type } = point;

  const date = humanizePointDate(dateFrom);
  const humanizedDateFrom = humanizePointTime(dateFrom);
  const humanizedDateTo = humanizePointTime(dateTo);
  const duration = humanizeDuration(dateFrom, dateTo);
  const destinationName = destination ? destination.name : '';
  const price = basePrice || '';
  const favouriteActiveClass = isFavorite ? 'event__favorite-btn--active' : '';
  const offersTemplate = currentOffers?.length ? createOffersTemplate(offers, currentOffers) : '';

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
