import BoardPresenter from './presenter/board-presenter';
import TripInfoView from './view/trip-info-view';
import TripView from './view/trip-view';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import SortModel from './model/sort-model';
import FilterPresenter from './presenter/filter-presenter';
import SortPresenter from './presenter/sort-presenter';
import NewPointButtonView from './view/new-point-button-view';
import PointsApiService from './points-api-service';
import { render, RenderPosition } from './framework/render';
import TripInfoPresenter from './presenter/trip-info-presenter';

const AUTHORIZATION = 'Basic f1dsfdFFF323S';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';


const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');
const tripContainerElement = mainElement.querySelector('.trip-events');
const tripMainElement = headerElement.querySelector('.trip-main');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});
const filterModel = new FilterModel();
const sortModel = new SortModel();

// const tripInfoComponent = new TripInfoView();

// const newPointButtonComponent = new NewPointButtonView({
//   onClick: handleNewPointButtonClick,
// });

const tripInfoPresenter = new TripInfoPresenter({
  tripMainContainer: tripMainElement,
  // tripInfoComponent: tripInfoComponent,
  pointsModel,
});

const boardPresenter = new BoardPresenter({
  boardContainer: tripContainerElement,
  tripMainContainer: tripMainElement,
  pointsModel,
  filterModel,
  sortModel,
});

const filterPresenter = new FilterPresenter({
  filterContainer: filtersContainerElement,
  filterModel,
  pointsModel,
  sortModel
});

const sortPresenter = new SortPresenter({
  sortContainer: tripContainerElement,
  sortModel,
  pointsModel
});

// render(tripInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
// render(new TripView(), tripInfoComponent.element);

// function handleNewPointFormClose() {
//   newPointButtonComponent.element.disabled = false;
// }

// function handleNewPointButtonClick() {
//   boardPresenter.createPoint();
//   newPointButtonComponent.element.disabled = true;
// }


pointsModel.init().finally(() => {
  // render(newPointButtonComponent, tripMainElement);
  // boardPresenter.init();
});
boardPresenter.init();
tripInfoPresenter.init();
filterPresenter.init();
sortPresenter.init();
