import { render, replace, remove } from '../framework/render';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import { PointMode, UserAction, UpdateType } from '../const';

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
    this.#destinations = [...this.#pointsModel.destinations];
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

  resetMode() {
    if (this.#mode !== PointMode.VIEW) {
      this.#pointEditComponent.reset(this.#point);
      this.#togglePointMode();
    }
  }

  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point);
      this.#togglePointMode();
    }
  };

  #handleRollupClick = () => {
    if (this.#mode === PointMode.VIEW) {
      this.#handleModeChange();
    }

    this.#togglePointMode();
  };

  #handleFormSubmit = (update) => {
    const isPatchUpdate = update.type !== this.#point.type || update.destination !== this.#point.destination;
    this.#handleDataChange(UserAction.UPDATE_POINT, isPatchUpdate ? UpdateType.PATCH : UpdateType.MINOR, update);
    this.#togglePointMode();
  };

  #handleDeleteClick = (task) => {
    this.#handleDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, task);
  };

  #handleFavoriteClick = () => {
    // eslint-disable-next-line camelcase
    this.#handleDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {...this.#point, is_favorite: !this.#point.is_favorite});
  };
}
