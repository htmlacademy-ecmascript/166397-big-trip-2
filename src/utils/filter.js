import { FilterType } from '../const';
import { isFuturePoint, isPresentPoint, isPastPoint } from './point';

const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(({date_from: dateFrom }) => isFuturePoint(dateFrom)),
  [FilterType.PRESENT]: (points) => points.filter(({date_from: dateFrom, date_to: dateTo}) => isPresentPoint(dateFrom, dateTo)),
  [FilterType.PAST]: (points) => points.filter(({date_to: dateTo}) => isPastPoint(dateTo)),
};

export { filter };
