import { capitalizeString } from '../../utils/common';

function createFilterTemplate(filter, currentFilterType) {
  const {type, count} = filter;
  const capitalizedType = capitalizeString(type);
  const disabled = count !== 0 ? '' : 'disabled';
  const checked = currentFilterType === type ? 'checked' : '';

  return `
    <div class="trip-filters__filter">
      <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${disabled} ${checked}>
      <label class="trip-filters__filter-label" for="filter-${type}">${capitalizedType}</label>
    </div>`;
}

function createFiltersTemplate(filters, currentFilter) {
  const filtersTemplate = filters.map((filter) => createFilterTemplate(filter, currentFilter)).join('');

  return filters?.length ? (`
    <form class="trip-filters" action="#" method="get">
      ${filtersTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>
  `) : '';
}

export { createFiltersTemplate };
