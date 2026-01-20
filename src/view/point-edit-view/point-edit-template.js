import { humanizePointDateAndTime, getElementByKey } from '../../utils';

function createOffersTemplate(offers, currentOfferTypeList) {
  return offers?.length ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">
    ${currentOfferTypeList.map((offer) => {
    const checked = offers.includes(offer.id) ? 'checked' : '';

    return `
      <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-${offer.id}" type="checkbox" name="event-offer-luggage" ${checked}>
        <label class="event__offer-label" for="event-offer-luggage-${offer.id}"">
          <span class="event__offer-title">${offer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`;
  }).join('')}
    </div>
  </section>` : '';
}

function createDestinationsTemplate(destinations) {
  return destinations?.length ? destinations.map((destination) => `<option value="${destination.name}"></option>`).join('') : '';
}

function createPictures(destinationPictures) {
  return destinationPictures?.length ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
        ${destinationPictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('')}
      </div>
    </div>` : '';
}

function createPointEditTemplate(point, destinations, offersTypes) {
  const { id, basePrice, dateFrom, dateTo, destination, offers, type } = point;

  const currentDestination = getElementByKey('id', destination, destinations);
  const currentOfferTypeList = getElementByKey('type', type, offersTypes).offers;

  const pointId = id || 0;
  const currentType = type || 'flight';
  const price = basePrice || '';
  const humanizedDateFrom = humanizePointDateAndTime(dateFrom);
  const humanizedDateTo = humanizePointDateAndTime(dateTo);
  const {name: destinationName, description: destinationDescription, pictures: destinationPictures} = currentDestination || {};

  const offersTemplate = createOffersTemplate(offers, currentOfferTypeList);
  const picturesTemplate = createPictures(destinationPictures);
  const destinationsListTemplate = createDestinationsTemplate(destinations);

  return (`
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${currentType}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-${pointId}">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-${pointId}">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-${pointId}">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-${pointId}">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-${pointId}">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-${pointId}">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-${pointId}">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-${pointId}">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-${pointId}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-${pointId}">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-${pointId}">
              ${currentType}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${pointId}" type="text" name="event-destination" value="${destinationName}" list="destination-list-${pointId}">
            <datalist id="destination-list-${pointId}">
              ${destinationsListTemplate}
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
          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>
        <section class="event__details">
          ${offersTemplate}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destinationDescription}</p>
            ${picturesTemplate}
          </section>
        </section>
      </form>
    </li>
  `);
}

export { createPointEditTemplate };
