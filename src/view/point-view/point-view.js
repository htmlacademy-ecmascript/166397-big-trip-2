import { createPointTemplate } from './point-template';
import AbstractView from '../../framework/view/abstract-view';

export default class PointView extends AbstractView {
  #point = null;
  #destination = null;
  #offers = null;
  #handleRollupClick = null;
  #handleFavouriteClick = null;

  constructor({point, destination, offers, onRollupClick, onFavoriteClick}) {
    super();
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;
    this.#handleRollupClick = onRollupClick;
    this.#handleFavouriteClick = onFavoriteClick;

    this.#initEventListeners();
  }

  get template() {
    return createPointTemplate(this.#point, this.#destination, this.#offers);
  }

  #initEventListeners() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#rollupClickHandler);
    this.element.querySelector('.event__favorite-btn').addEventListener('click', this.#favouriteClickHandler);
  }

  #rollupClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleRollupClick();
  };

  #favouriteClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleFavouriteClick();
  };
}
