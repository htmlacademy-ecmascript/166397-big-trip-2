import { render, replace, remove } from '../framework/render';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import { PointMode, UserAction, UpdateType } from '../const';
import { isEscKey } from '../utils/common';

export default class PointPresenter {
  #point = null;
  #destinations = [];
  #listContainer = null;
  #destination = null;
  #offers = [];
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #pointsModel = null;
  #handleModeChange = null;
  #mode = PointMode.VIEW;

  constructor({ listContainer, onDataChange, pointsModel, onModeChange }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#pointsModel = pointsModel;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#pointsModel.getDestinationById(this.#point.destination);
    this.#destinations = structuredClone(this.#pointsModel.destinations);
    this.#offers = this.#getOffers(this.#point.type);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onRollupClick: this.#handleRollupClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      getOffers: this.#getOffers,
      onRollupClick: this.#handleRollupClick,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if (this.#mode === PointMode.VIEW) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#mode === PointMode.EDITING) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  setSaving() {
    if (this.#mode === PointMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === PointMode.EDITING) {
      this.#pointEditComponent.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === PointMode.VIEW) {
      this.#pointComponent.shake();
      return;
    }

    const resetFormState = () => {
      this.#pointEditComponent.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#pointEditComponent.shake(resetFormState);
  }

  resetMode() {
    if (this.#mode !== PointMode.VIEW) {
      this.#pointEditComponent.reset(this.#point);
      this.#togglePointMode();
    }
  }

  #getOffers = (type) => this.#pointsModel.getOffersByType(type);

  #togglePointMode() {
    if (this.#mode !== PointMode.EDITING) {
      replace(this.#pointEditComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.EDITING;

    } else {
      replace(this.#pointComponent, this.#pointEditComponent);
      document.removeEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.VIEW;
    }
  }

  #handleRollupClick = () => {
    if (this.#mode === PointMode.VIEW) {
      this.#handleModeChange();
    }

    this.#togglePointMode();
  };

  #handleFormSubmit = (update) => {
    const isPatchUpdate = update.basePrice === this.#point.basePrice && update.dateFrom.toISOString() === this.#point.dateFrom.toISOString() && update.dateTo.toISOString() === this.#point.dateTo.toISOString() && JSON.stringify(update.offers) === JSON.stringify(this.#point.offers) && update.destination === this.#point.destination;

    this.#handleDataChange(UserAction.UPDATE_POINT, isPatchUpdate ? UpdateType.PATCH : UpdateType.MAJOR, update);
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, isFavorite: !this.#point.isFavorite});
  };

  #documentKeydownHandler = (evt) => {
    if (isEscKey(evt)) {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#togglePointMode();
    }
  };
}
