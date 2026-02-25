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
    render(this.#tripInfoComponent, this.#tripMainContainer, RenderPosition.AFTERBEGIN);
    this.#renderTripInfo();
  }

  #renderTripInfo() {
    this.#renderTripInfoMain();
    this.#renderCost();
  }

  #renderTripInfoMain() {
    this.#tripComponent = new TripView({
      title: this.#pointsModel.trip,
    });
    render(this.#tripComponent, this.#tripInfoContainer);
  }

  #renderCost() {
    this.#costComponent = new CostView();
    render(this.#costComponent, this.#tripInfoContainer);
  }

  #clearTripInfo() {
    remove(this.#costComponent);
    remove(this.#tripComponent);
  }

  #handleModelEvent = (updateType) => {
    switch (updateType) {
      // case UpdateType.PATCH:

      //   break;
      case UpdateType.MINOR:
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
      case UpdateType.MAJOR:
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
      case UpdateType.INIT:
        this.#clearTripInfo();
        this.#renderTripInfo();
        break;
    }
  };
}
