import { render, replace, remove } from '../framework/render';
import PointEditView from '../view/point-edit-view/point-edit-view';
import PointView from '../view/point-view/point-view';
import { POINT_STATES } from '../const';

export default class PointPresenter {
  #point = null;
  #boardDestinations = [];
  #listContainer = null;
  #destination = null;
  #offers = [];
  #pointComponent = null;
  #pointEditComponent = null;
  #handleDataChange = null;

  constructor({ boardDestinations, listContainer, onDataChange }) {
    this.#boardDestinations = boardDestinations;
    this.#listContainer = listContainer;
    this.#handleDataChange = onDataChange;
  }

  init(point, destination, offers) {
    this.#point = point;
    this.#destination = destination;
    this.#offers = offers;

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

    if (this.#listContainer.contains(prevPointComponent.element)) {
      replace(this.#pointComponent, prevPointComponent);
    }

    if (this.#listContainer.contains(prevPointEditComponent.element)) {
      replace(this.#pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this.#pointComponent);
    remove(this.#pointEditComponent);
  }

  #changeStatePoint(state) {
    if (!POINT_STATES.includes(state)) {
      return;
    }

    if (state === 'edit') {
      replace(this.#pointEditComponent, this.#pointComponent);
      document.addEventListener('keydown', this.#documentKeydownHandler);
    } else {
      replace(this.#pointComponent, this.#pointEditComponent);
      document.removeEventListener('keydown', this.#documentKeydownHandler);
    }
  }

  #documentKeydownHandler = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#changeStatePoint('view');
    }
  };

  #handleRollupPointClick = () => {
    this.#changeStatePoint('edit');
  };

  #handleRollupPointEditClick = () => {
    this.#changeStatePoint('view');
  };

  #handleFormSubmit = () => {
    this.#changeStatePoint('view');
  };

  #handleFavoriteClick = () => {
    // eslint-disable-next-line camelcase
    this.#handleDataChange({...this.#point, is_favorite: !this.#point.is_favorite});
  };
}
