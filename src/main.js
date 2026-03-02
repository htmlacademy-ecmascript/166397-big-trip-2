import BoardPresenter from './presenter/board-presenter';
import PointsModel from './model/points-model';
import FilterModel from './model/filter-model';
import SortModel from './model/sort-model';
import FilterPresenter from './presenter/filter-presenter';
import SortPresenter from './presenter/sort-presenter';
import PointsApiService from './points-api-service';
import TripInfoPresenter from './presenter/trip-info-presenter';

const AUTHORIZATION = 'Basic f1dsfdFFF323S1';
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

const tripInfoPresenter = new TripInfoPresenter({
  tripMainContainer: tripMainElement,
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

pointsModel.init();
boardPresenter.init();
tripInfoPresenter.init();
filterPresenter.init();
sortPresenter.init();
