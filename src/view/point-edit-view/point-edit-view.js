import { createPointEditTemplate } from './point-edit-template';
import AbstractView from '../../framework/view/abstract-view';

const BLANK_POINT = {
  id: '0',
  basePrice: null,
  dateFrom: new Date('2019-03-19T00:00:00.00Z'),
  dateTo: new Date('2019-03-19T00:00:00.00Z'),
  destination: '4',
  isFavorite: true,
  offers: [
    '0', '1'
  ],
  type: 'flight'
};

export default class PointEditView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleRollupClick = null;
  #handleFormSubmit = null;

  constructor({point = BLANK_POINT, destinations, offers, onRollupClick, onFormSubmit}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('form').addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createPointEditTemplate(this.#point, this.#destinations, this.#offers);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
