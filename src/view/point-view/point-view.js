import { createPointTemplate } from './point-template';
import AbstractView from '../../framework/view/abstract-view';

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleRollupClick = null;

  constructor({point, destination, offers, onRollupClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;

    this.#initEventListeners();
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };
}
