import { createPointEditTemplate } from './point-edit-template';
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
  #handleDeleteClick = null;
  #getOffers = null;
  #isNewTask = false;

  #datepickers = [];
  #form = null;

  constructor({point = BLANK_POINT, destinations, getOffers, onRollupClick, onFormSubmit, onDeleteClick, isNewTask = false}) {
    super();
    this.#getOffers = getOffers;
    this._setState(PointEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewTask = isNewTask;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#getOffers(this._state.type), this.#isNewTask);
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

  reset(point) {
    this.updateElement(PointEditView.parsePointToState(point));
  }

  _restoreHandlers() {
    this.#form = this.element.querySelector('form');

    const rollupButton = this.#form.querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    this.#form.addEventListener('submit', this.#formSubmitHandler);
    this.#form.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
    this.#form.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.#form.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#form.addEventListener('change', this.#offersChangeHandler);
    this.#form.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);

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

  #deleteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(PointEditView.parseStateToPoint(this._state));
  };

  #typeChangeHandler = (evt) => {
    if (evt.target.matches('.event__type-input')) {
      evt.preventDefault();

      this.updateElement({
        type: evt.target.value,
        offers: [],
      });
    }
  };

  #destinationChangeHandler = (evt) => {
    evt.preventDefault();

    const currentOptionElement = evt.target.list.querySelector(`[value="${evt.target.value}"]`);

    const currentDestination = currentOptionElement ? currentOptionElement.dataset.destinationId : null;

    this.updateElement({
      destination: currentDestination,
    });
  };

  #priceChangeHandler = (evt) => {
    evt.preventDefault();

    const clearPrice = evt.target.value.replace(/\D/g, '');

    this._setState({
      basePrice: clearPrice
    });
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.matches('.event__offer-checkbox')) {
      evt.preventDefault();
      const offersCheckboxes = Array.from(this.#form['event-offer-luggage']);

      const checkedOffers = offersCheckboxes.filter((item) => item.checked).map((item) => item.id.replace('event-offer-luggage-', ''));

      this._setState({
        offers: checkedOffers
      });
    }
  };

  #dateChangeHandler = ([userDate], dateType) => {
    this.updateElement({
      [dateType]: userDate,
    });
  };

  #setDatepickers() {
    const dateElements = this.element.querySelectorAll('.event__input--time');

    dateElements.forEach((item, index) => {
      const isStartTime = item.name === 'event-start-time';
      const dateType = isStartTime ? 'dateFrom' : 'dateTo';

      this.#datepickers[index] = flatpickr(
        item,
        {
          enableTime: true,
          enableSeconds: true,
          'time_24hr': true,
          dateFormat: 'd/m/y H:i',
          minDate: isStartTime ? null : this.#datepickers[0].selectedDates[0],
          defaultDate: this._state[dateType],
          onClose: (date) => this.#dateChangeHandler(date, dateType),
        },
      );
    });

    this.#datepickers[0].set('maxDate', this.#datepickers[1].selectedDates[0]);
  }

  static parsePointToState(point) {
    return {
      ...point,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    return point;
  }
}
