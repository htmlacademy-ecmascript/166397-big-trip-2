import { humanizePointDateAndTime } from '../../utils/point';
import { getElementByKey, capitalizeString } from '../../utils/common';
import { DESTINATION_TYPES } from '../../const';

function createEventTypesTemplate(activeType, pointId) {
  return DESTINATION_TYPES.map((type) => {
    const capitalizedType = capitalizeString(type);
    const checked = type === activeType ? 'checked' : '';

    return `
      <div class="event__type-item">
        <input id="event-type-${type}-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${checked}>
        <label class="event__type-label  event__type-label--${type}" for="event-type-${type}-${pointId}">${capitalizedType}</label>
      </div>`;
  }).join('');
}

function createOffersTemplate(offers, currentOffers) {
  return `
    <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>
      <div class="event__available-offers">
      ${currentOffers.map(({id, title, price}) => {
    const checked = offers.includes(id) ? 'checked' : '';

    return `
        <div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${id}" type="checkbox" name="event-offer-luggage" ${checked}>
          <label class="event__offer-label" for="event-offer-luggage-${id}"">
            <span class="event__offer-title">${title}</span>
            &plus;&euro;&nbsp;
            <span class="event__offer-price">${price}</span>
          </label>
        </div>`;
  }).join('')}
      </div>
    </section>`;
}

function createDestinationsTemplate(destinations) {
  return destinations.map((destination) => `<option value="${destination.name}" data-destination-id="${destination.id}"></option>`).join('');
}

function createPicturesTemplate(pictures) {
  return `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map(({src, description}) => `<img class="event__photo" src="${src}" alt="${description}">`).join('')}
      </div>
    </div>`;
}

function createDestinationTemplate(description, picturesTemplate) {
  return `
      <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>
        ${picturesTemplate}
      </section>
  `;
}

function createRollupButtonTemplate() {
  return `
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>
  `;
}

function createPointEditTemplate(point, destinations, currentOffers, isNewTask) {
  const { id, base_price: basePrice, date_from: dateFrom, date_to: dateTo, destination, offers, type, currentDestionationInput } = point;

  const currentDestination = getElementByKey('id', destination, destinations);

  const pointId = id || 0;
  const currentType = type || 'flight';
  const price = basePrice || '';
  const humanizedDateFrom = humanizePointDateAndTime(dateFrom);
  const humanizedDateTo = humanizePointDateAndTime(dateTo);
  const {name, description, pictures} = currentDestination || {};
  const finalName = currentDestionationInput ? currentDestionationInput : name;

  const offersTemplate = currentOffers?.length ? createOffersTemplate(offers, currentOffers) : '';
  const picturesTemplate = pictures?.length ? createPicturesTemplate(pictures) : '';
  const destinationsTemplate = destinations?.length ? createDestinationsTemplate(destinations) : '';
  const eventTypesTemplate = DESTINATION_TYPES?.length ? createEventTypesTemplate(currentType, pointId) : '';
  const destinationTemplate = destination ? createDestinationTemplate(description, picturesTemplate) : '';
  const rollupButtonTemplate = !isNewTask ? createRollupButtonTemplate() : '';

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="${currentType} icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                ${eventTypesTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${currentType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${finalName || ''}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${destinationsTemplate}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${pointId}">From</label>
            <input class="event__input  event__input--time" id="event-start-time-${pointId}" type="text" name="event-start-time" value="${humanizedDateFrom}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
            <input class="event__input  event__input--time" id="event-end-time-${pointId}" type="text" name="event-end-time" value="${humanizedDateTo}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${pointId}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${pointId}" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>
          ${rollupButtonTemplate}
        </header>
        <section class="event__details">
          ${offersTemplate}

          ${destinationTemplate}
        </section>
      </form>
    </li>
  `);
}

export { createPointEditTemplate };
