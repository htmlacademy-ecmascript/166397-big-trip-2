import PointEditView from '../view/point-edit-view/point-edit-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition } from '../framework/render';
import { isEscKey } from '../utils/common';

export default class NewPointPresenter {
  #pointsListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointsModel = null;
  #destinations = null;

  #pointEditComponent = null;

  constructor({pointsListContainer, onDataChange, onDestroy, pointsModel}) {
    this.#pointsListContainer = pointsListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#pointEditComponent) {
      return;
    }

    this.#destinations = [...this.#pointsModel.destinations];

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinations,
      getOffers: this.#getOffers,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      isNewPoint: true
    });

    render(this.#pointEditComponent, this.#pointsListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeydownHandler);
  }

  destroy() {
    if (!this.#pointEditComponent) {
      return;
    }

    this.#handleDestroy();

    remove(this.#pointEditComponent);
    this.#pointEditComponent = null;

    document.removeEventListener('keydown', this.#escKeydownHandler);
  }

  #getOffers = (type) => this.#pointsModel.getOffersByType(type);

  #formSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MINOR, point);

  };

  #deleteClickHandler = () => {
    this.destroy();
  };

  #escKeydownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.destroy();
    }
  };
}
