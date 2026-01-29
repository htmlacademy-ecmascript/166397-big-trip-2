import { capitalizeString } from '../../utils/common';

function createFilterTemplate({type, count}) {
  const capitalizedType = capitalizeString(type);
  const disabled = count !== 0 ? '' : 'disabled';

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${disabled}>
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
