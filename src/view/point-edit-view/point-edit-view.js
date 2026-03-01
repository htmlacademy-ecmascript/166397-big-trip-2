import { createPointEditTemplate } from './point-edit-template';
import AbstractStatulView from '../../framework/view/abstract-stateful-view';
import flatpickr from 'flatpickr';

import 'flatpickr/dist/flatpickr.min.css';

const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: 'null',
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export default class PointEditView extends AbstractStatulView {
  #destinations = null;
  #handleRollupClick = null;
  #handleFormSubmit = null;
  #handleDeleteClick = null;
  #getOffers = null;
  #isNewPoint = false;
  #datepickers = [];
  #formElement = null;

  constructor({point = BLANK_POINT, destinations, getOffers, onRollupClick, onFormSubmit, onDeleteClick, isNewPoint = false}) {
    super();
    this.#getOffers = getOffers;
    this._setState(PointEditView.parsePointToState(point));
    this.#destinations = destinations;
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeleteClick = onDeleteClick;
    this.#isNewPoint = isNewPoint;

    this._restoreHandlers();
  }

  get template() {
    return createPointEditTemplate(this._state, this.#destinations, this.#getOffers(this._state.type), this.#isNewPoint);
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
    this.#formElement = this.element.querySelector('form');

    const rollupButton = this.#formElement.querySelector('.event__rollup-btn');

    if (rollupButton) {
      rollupButton.addEventListener('click', this.#rollupClickHandler);
    }

    this.#formElement.addEventListener('submit', this.#formSubmitHandler);
    this.#formElement.querySelector('.event__type-list').addEventListener('change', this.#typeChangeHandler);
    this.#formElement.querySelector('.event__input--destination').addEventListener('change', this.#destinationChangeHandler);
    this.#formElement.querySelector('.event__input--price').addEventListener('change', this.#priceChangeHandler);
    this.#formElement.addEventListener('change', this.#offersChangeHandler);
    this.#formElement.querySelector('.event__reset-btn').addEventListener('click', this.#deleteClickHandler);

    this.#setDatepickers();
  }

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
          onClose: (date) => this.#dateChangeHandler(date, dateType)
        },
      );
    });

    this.#datepickers[0].set('maxDate', this.#datepickers[1].selectedDates[0]);
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

    const clearPrice = Number(evt.target.value.replace(/\D/g, ''));

    this._setState({
      basePrice: clearPrice
    });
  };

  #offersChangeHandler = (evt) => {
    if (evt.target.matches('.event__offer-checkbox')) {
      evt.preventDefault();
      const offersCheckboxes = Array.from(this.#formElement['event-offer-luggage']);

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


  static parsePointToState(point) {
    return {
      ...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
