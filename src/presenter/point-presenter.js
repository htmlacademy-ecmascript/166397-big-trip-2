import { render, replace, remove } from '../framework/render';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import { PointMode } from '../const';

export default class PointPresenter {
  #point = null;
  #boardDestinations = [];
  #listContainer = null;
  #destination = null;
  #offers = [];
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;
  #pointsModel = null;
  #handleModeChange = null;
  #mode = PointMode.DEFAULT;

  constructor({ listContainer, onDataChange, pointsModel, onModeChange }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#pointsModel = pointsModel;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#pointsModel.getDestinationById(this.#point.destination);
    this.#boardDestinations = [...this.#pointsModel.destinations];
    this.#offers = this.#pointsModel.getOffersByType(point.type);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      destination: this.#destination,
      offers: this.#offers,
      onRollupClick: this.#handleRollupPointClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#boardDestinations,
      offers: this.#offers,
      onRollupClick: this.#handleRollupPointEditClick,
      onFormSubmit: this.#handleFormSubmit
    });

    if (!prevPointComponent || !prevPointEditComponent) {
      render(this.#pointComponent, this.#listContainer);
      return;
    }

    if (this.#mode === PointMode.DEFAULT) {
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

  #changeStatePoint(mode) {
    if (mode === PointMode.EDITING) {
      replace(this.#pointEditComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.EDITING;
    } else {
      replace(this.#pointComponent, this.#pointEditComponent);
      document.removeEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.DEFAULT;
    }
  }

  clearMode() {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#changeStatePoint(PointMode.DEFAULT);
    }
  }

  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#changeStatePoint(PointMode.DEFAULT);
    }
  };

  #handleRollupPointClick = () => {
    this.#handleModeChange();
    this.#changeStatePoint(PointMode.EDITING);

  };

  #handleRollupPointEditClick = () => {
    this.#changeStatePoint(PointMode.DEFAULT);
  };

  #handleFormSubmit = () => {
    this.#changeStatePoint(PointMode.DEFAULT);
  };

  #handleFavoriteClick = () => {
    // eslint-disable-next-line camelcase
    this.#handleDataChange({...this.#point, is_favorite: !this.#point.is_favorite});
  };
}
