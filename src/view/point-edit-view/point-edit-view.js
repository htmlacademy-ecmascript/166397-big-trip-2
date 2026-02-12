import { createPointEditTemplate } from './point-edit-template';
import { toISOString } from '../../utils/point';
import AbstractStatulView from '../../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  id: '0',
  // eslint-disable-next-line camelcase
  base_price: null,
  // eslint-disable-next-line camelcase
  date_from: '2019-03-19T00:00:00.00Z',
  // eslint-disable-next-line camelcase
  date_to: '2019-03-19T00:00:00.00Z',
  destination: null,
  // eslint-disable-next-line camelcase
  is_favorite: false,
  offers: [],
  type: 'flight'
};

export default class PointEditView extends AbstractStatulView {
  #destinations = null;
  #handleRollupClick = null;
  #handleFormSubmit = null;
  #getOffers = null;
  #getDestination = null;
  #form = null;
  #datepickers = [];

  constructor({point = BLANK_POINT, destinations, getOffers, getDestination, onRollupClick, onFormSubmit}) {
    super();
    this.#getOffers = getOffers;
    this.#getDestination = getDestination;
    this._setState(PointEditView.parsePointToState(point, this.#getOffers(point.type), this.#getDestination(point.destination)));
    this.#destinations = destinations;
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#form = this.element.querySelector('form');

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#getOffers(this._state.type));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickers?.length) {
      this.#datepickers.forEach((datepicker) => {
        datepicker.destroy();
      });
      this.#datepickers = [];
    }
  }

  reset(point, offers, destination) {
    this.updateElement(PointEditView.parsePointToState(point, offers, destination));
  }

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
    this.element.addEventListener('change', this.#typeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.element.addEventListener('change', this.#offersChangeHandler);

    this.#setDatepickers();
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.matches('.event__type-input')) {
      evt.preventDefault();

      this.updateElement({
        type: evt.target.value,
        offers: [],
        isOffers: Boolean(this.#getOffers(evt.target.value)),
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const currentOptionElement = evt.target.list.querySelector(`[value="${evt.target.value}"]`);

    const currentDestination = currentOptionElement ? currentOptionElement.dataset.destinationId : null;

    this.updateElement({
      destination: currentDestination,
      isDestination: Boolean(this.#getDestination(currentDestination)),
      currentDestionationInput: evt.target.value
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      // eslint-disable-next-line camelcase
      base_price: evt.target.value
    });
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.matches('.event__offer-checkbox')) {
      evt.preventDefault();
      const offersCheckboxes = Array.from(this.#form['event-offer-luggage']);

      const checkedOffers = offersCheckboxes.filter((item) => item.checked).map((item) => item.id.replace('event-offer-luggage-', ''));

      this._setState({
        offers: checkedOffers,
        isOffers: Boolean(checkedOffers?.length)
      });
    }
  };

  #dateChangeHandler = ([userDate], dateType) => {
    this.updateElement({
      [dateType]: toISOString(userDate),
    });

  };

  #setDatepickers() {
    const dateElements = this.element.querySelectorAll('.event__input--time');

    dateElements.forEach((item, index) => {
      const isStartTime = item.name === 'event-start-time';
      const dateType = isStartTime ? 'date_from' : 'date_to';

      this.#datepickers[index] = flatpickr(
        item,
        {
          enableTime: true,
          enableSeconds: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: 'd/m/y H:i',
          minDate: isStartTime ? null : this.#datepickers[0].selectedDates[0],
          defaultDate: this._state[dateType],
          onClose: (date) => this.#dateChangeHandler(date, dateType),
        },
      );
    });

    this.#datepickers[0].set('maxDate', this.#datepickers[1].selectedDates[0]);
  }

  static parsePointToState(point, offers, destination) {
    return {
      ...point,
      isOffers: Boolean(offers?.length),
      isDestination: Boolean(destination),
      currentDestionationInput: destination?.name ? destination.name : null
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    if (!point.isOffers) {
      point.offers = [];
    }

    if (!point.isDestination) {
      point.destination = null;
    }

    if (!point.currentDestionationInput) {
      point.destination = null;
    }

    delete point.isOffers;
    delete point.isDestination;
    delete point.currentDestionationInput;

    return point;
  }
}
