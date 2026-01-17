// import FiltersView from './view/filters-view';
import BoardPresenter from './presenter/board-presenter';
import TripInfoView from './view/trip-info-view';
import TripView from './view/trip-view';
// import CostView from './view/cost-view';
import { render } from './render';

const headerElement = document.querySelector('.page-header');
const mainElement = document.querySelector('.page-main');
const filtersContainerElement = headerElement.querySelector('.trip-controls__filters');
const tripContainerElement = mainElement.querySelector('.trip-events');
const tripMainElement = headerElement.querySelector('.trip-main');

const tripInfo = new TripInfoView();

const boardPresenter = new BoardPresenter({
  boardContainer: tripContainerElement,
  tripInfoContainer: tripInfo.getElement(),
  filtersContainer: filtersContainerElement
});

render(tripInfo, tripMainElement, 'afterbegin');
render(new TripView(), tripInfo.getElement());
boardPresenter.init();

