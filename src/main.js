import BoardPresenter from './presenter/board-presenter';
import TripInfoView from './view/trip-info-view';
import TripView from './view/trip-view';
import PointsModel from './model/points-model';
import { render, RenderPosition } from './framework/render';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');
const tripContainerElement = mainElement.querySelector('.trip-events');
const tripMainElement = headerElement.querySelector('.trip-main');

const pointsModel = new PointsModel();

const tripInfo = new TripInfoView();
const boardPresenter = new BoardPresenter({
  boardContainer: tripContainerElement,
  tripInfoContainer: tripInfo.element,
  filtersContainer: filtersContainerElement,
  pointsModel,
});

render(tripInfo, tripMainElement, RenderPosition.AFTERBEGIN);
render(new TripView(), tripInfo.element);

pointsModel.init().finally(() => {
  boardPresenter.init();
});
