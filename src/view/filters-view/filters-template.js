import { capitalizeString } from '../../utils/common';

function createFilterTemplate({type}) {
  const capitalizedType = capitalizeString(type);

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}">
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizedType}</label>
    </div>`;
}

function createFiltersTemplate(filters) {
  const filtersTemplate = filters.map((filter) => createFilterTemplate(filter)).join('');

  return filters?.length ? (`
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `) : '';
}

export { createFiltersTemplate };
