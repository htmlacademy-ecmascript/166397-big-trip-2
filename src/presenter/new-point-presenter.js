import PointEditView from '../view/point-edit-view/point-edit-view';
import { UserAction, UpdateType } from '../const';
import { remove, render, RenderPosition } from '../framework/render';
import { isEscKey } from '../utils/common';

export default class NewPointPresenter {
  #boardContainer = null;
  #pointsListComponent = null;
  #handleDataChange = null;
  #handleDestroy = null;
  #pointsModel = null;
  #destinations = null;
  #pointEditComponent = null;
  #getEmptyComponent = null;

  constructor({boardContainer, pointsListComponent, onDataChange, onDestroy, getEmptyComponent, pointsModel}) {
    this.#boardContainer = boardContainer;
    this.#pointsListComponent = pointsListComponent;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
    this.#getEmptyComponent = getEmptyComponent;
    this.#pointsModel = pointsModel;
  }

  init() {
    if (this.#pointEditComponent) {
      return;
    }

    if (!this.#pointsModel.points.length) {
      remove(this.#getEmptyComponent());
      render(this.#pointsListComponent, this.#boardContainer);
    }

    this.#destinations = structuredClone(this.#pointsModel.destinations);

    this.#pointEditComponent = new PointEditView({
      destinations: this.#destinations,
      getOffers: this.#getOffers,
      onFormSubmit: this.#formSubmitHandler,
      onDeleteClick: this.#deleteClickHandler,
      isNewPoint: true
    });

    render(this.#pointEditComponent, this.#pointsListComponent.element, RenderPosition.AFTERBEGIN);

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

    if (!this.#pointsModel.points.length) {
      remove(this.#pointsListComponent);
      render(this.#getEmptyComponent(), this.#boardContainer);
    }
  }

  setSaving() {
    this.#pointEditComponent.updateElement({
      isDisabled: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  #getOffers = (type) => this.#pointsModel.getOffersByType(type);

  #formSubmitHandler = (point) => {
    this.#handleDataChange(UserAction.ADD_POINT, UpdateType.MAJOR, point);
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
