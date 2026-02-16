import { filter} from '../utils/filter';
import { render } from '../framework/render';
import FiltersView from '../view/filters-view/filters-view';
import { UpdateType } from '../const';

export default class FilterPresenter {
  #filterContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filterContainer, filterModel, pointsModel}) {
    this.#filterContainer = filterContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;

    this.#filterModel.addObserver(this.#handleModelEvent);
    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get filters() {
    const points = this.#pointsModel.points;
    console.log(points);

    return Object.entries(filter).map(
      ([filterType, filterPoints]) => ({
        type: filterType,
        count: filterPoints(points).length,
      }),
    );
  }

  init() {
    if (this.#filterComponent === null) {
      this.#filterComponent = new FiltersView({
        filters: this.filters,
        currentFilter: 'everything',
        onFilterChange: this.#handleFilterTypeChange
      });

      render(this.#filterComponent, this.#filterContainer);
    }
  }

  #handleModelEvent = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (filterType === this.#filterModel.filter) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
