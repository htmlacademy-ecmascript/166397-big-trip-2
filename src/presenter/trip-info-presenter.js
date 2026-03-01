import TripInfoView from '../view/trip-info-view';
import TripView from '../view/trip-view';
import CostView from '../view/cost-view';
import { render, RenderPosition, remove } from '../framework/render';
import { UpdateType } from '../const';

export default class TripInfoPresenter {
  #tripMainContainer = null;
  #pointsModel = null;
  #tripInfoComponent = null;
  #tripInfoContainer = null;
  #tripComponent = null;
  #costComponent = null;

  constructor({tripMainContainer, pointsModel}) {
    this.#tripMainContainer = tripMainContainer;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    this.#tripInfoComponent = new TripInfoView();
    this.#tripInfoContainer = this.#tripInfoComponent.element;
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#renderTripInfoMain();

    if (this.#pointsModel.points.length) {
      this.#renderCost();
    }
  }

  #renderTripInfoMain() {
    this.#tripComponent = new TripView({
      trip: this.#pointsModel.trip,
      dateStart: this.#pointsModel.dateStart,
      dateEnd: this.#pointsModel.dateEnd,
    });
    render(this.#tripComponent, this.#tripInfoContainer);
  }

  #renderCost() {
    this.#costComponent = new CostView({
      cost: this.#pointsModel.cost,
    });
    render(this.#costComponent, this.#tripInfoContainer);
  }

  #clearTripInfo() {
    remove(this.#costComponent);
    remove(this.#tripComponent);
  }

  #handleModelEvent = (updateType) => {
    if (updateType === UpdateType.PATCH) {
      return;
    }

    this.#clearTripInfo();
    this.#renderTripInfo();
  };
}
