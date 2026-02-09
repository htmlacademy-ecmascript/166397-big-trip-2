import { render, replace, remove } from '../framework/render';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import { PointMode } from '../const';

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
  #mode = PointMode.DEFAULT;

  constructor({ listContainer, onDataChange, pointsModel, onModeChange }) {
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
    this.#pointsModel = pointsModel;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#destination = this.#getDestination(this.#point.destination);
    this.#destinations = [...this.#pointsModel.destinations];
    this.#offers = this.#getOffers(this.#point.type);

    const prevPointComponent = this.#pointComponent;
    const prevPointEditComponent = this.#pointEditComponent;

    this.#pointComponent = new PointView({
      point: this.#point,
      pointsModel: this.#pointsModel,
      destination: this.#destination,
      offers: this.#offers,
      onRollupClick: this.#handleRollupClick,
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#pointEditComponent = new PointEditView({
      point: this.#point,
      destinations: this.#destinations,
      getOffers: this.#getOffers,
      getDestination: this.#getDestination,
      onRollupClick: this.#handleRollupClick,
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

  #getDestination = (id) => this.#pointsModel.getDestinationById(id);

  #getOffers = (type) => this.#pointsModel.getOffersByType(type);

  #togglePointMode() {
    if (this.#mode !== PointMode.EDITING) {
      replace(this.#pointEditComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.EDITING;

    } else {
      replace(this.#pointComponent, this.#pointEditComponent);
      document.removeEventListener('keydown', this.#documentKeydownHandler);

      this.#mode = PointMode.DEFAULT;
    }
  }

  resetMode() {
    if (this.#mode !== PointMode.DEFAULT) {
      this.#pointEditComponent.reset(this.#point, this.#offers, this.#destination);
      this.#togglePointMode();
    }
  }

  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#pointEditComponent.reset(this.#point, this.#offers, this.#destination);
      this.#togglePointMode();
    }
  };

  #handleRollupClick = () => {
    if (this.#mode === PointMode.DEFAULT) {
      this.#handleModeChange();
    }

    this.#togglePointMode();
  };

  #handleFormSubmit = (task) => {
    this.#handleDataChange(task);
    this.#togglePointMode();
  };

  #handleFavoriteClick = () => {
    // eslint-disable-next-line camelcase
    this.#handleDataChange({...this.#point, is_favorite: !this.#point.is_favorite});
  };
}
